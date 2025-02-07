import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, forkJoin, map, Observable, of, switchMap, timeout} from 'rxjs';
import {Bonsai, CreateBonsaiRequestBody, Note, Picture} from './Bonsai';
import {WeatherData} from './WeatherData';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private BASE_URL = 'http://localhost:8123'
  private API_URL = '/api/v1/bonsais';
  private WEATHER_URL = '/api/v1/weather';

  constructor(private httpClient: HttpClient) {
  }

  getCurrentWeatherInfo() {
    return this.httpClient.get<WeatherData>(this.BASE_URL + this.WEATHER_URL).pipe(
      timeout(5000),
      map(data => ({
        ...data,
        weather: data.weather.map(w => ({
          main: this.mapWeatherName(w.main)
        }))
      })),
      catchError(() => {
        const fallbackWeatherData: WeatherData = {
          weather: [{main: 'block'}],
          main: {temp: 0},
          name: 'Unknown'
        };
        return of(fallbackWeatherData);
      })
    );
  }

  private mapWeatherName(weather: string): string {
    switch (weather.toLowerCase()) {
      case 'rain':
        return 'rainy';
      case 'snow':
        return 'weather_snowy'
      case 'clouds':
        return 'cloudy'
      case 'clear':
        return 'sunny'
      case 'sun':
        return 'sunny'; // thunderstorm
      default:
        return 'block';
    }
  }

  getBonsais(): Observable<Bonsai[]> {
    return this.httpClient.get<Bonsai[]>(this.BASE_URL + this.API_URL);
  }

  getBonsaiById(id: string): Observable<Bonsai> {
    return this.httpClient.get<Bonsai>(this.BASE_URL + this.API_URL + '/' + id);
  }

  getAllNotesByBonsaiId(id: string, page: number, pageSize: number): Observable<Note[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
    return this.httpClient.get<Note[]>(this.BASE_URL + this.API_URL + '/' + id + '/notes', {params})
  }

  addNoteToBonsai(bonsaiId: string, note: Partial<Note>): Observable<Note> {
    return this.httpClient.post<Note>(this.BASE_URL + this.API_URL + '/' + bonsaiId + '/notes', note);
  }

  deleteNote(noteId: string): Observable<void> {
    return this.httpClient.delete<void>(this.BASE_URL + this.API_URL + '/notes/' + noteId);
  }

  createBonsai(bonsai: CreateBonsaiRequestBody): Observable<string> {
    return this.httpClient.post(this.BASE_URL + this.API_URL, bonsai, {responseType: 'blob', observe: 'response'})
      .pipe(
        map(response => {
          // Returns the newly generated qr code of the bonsai
          return URL.createObjectURL(response.body as Blob)
        })
      );
  }

  uploadPictures(bonsaiId: string, formData: FormData): Observable<void> {
    return this.httpClient.post<void>(`${this.BASE_URL}${this.API_URL}/${bonsaiId}/pictures`, formData);
  }

  getPicturesByBonsaiId(bonsaiId: string, page: number, pageSize: number): Observable<Picture[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())

    return this.httpClient
      .get<string[]>(`${this.BASE_URL}${this.API_URL}/${bonsaiId}/pictures`, {params})
      .pipe(
        switchMap((pictureIds: string[]) => {
          if (pictureIds.length === 0) {
            return of([]);
          }
          return forkJoin(
            pictureIds.map(pictureId =>
              this.httpClient.get(this.BASE_URL + this.API_URL + '/pictures/' + pictureId, {
                responseType: 'blob',
                observe: 'response'
              }).pipe(
                map(response => {
                  const blob = response.body as Blob;
                  const createdAt = response.headers.get("X-Created-At") || '';
                  const fileName = response.headers.get("X-Filename") || '';

                  return {
                    uuid: pictureId,
                    fileName: fileName,
                    imageUrl: URL.createObjectURL(blob),
                    createdAt: createdAt
                  };
                })
              )
            )
          );
        })
      );
  }

  getQrCodeForBonsai(bonsaiId: string): Observable<string> {
    return this.httpClient
      .get(this.BASE_URL + this.API_URL + '/' + bonsaiId + '/qr-code', {
        responseType: 'blob',
        observe: 'response'
      }).pipe(
        map(data => {
            return URL.createObjectURL(data.body as Blob)
          }
        )
      )
  }

  updateBonsai(bonsaiId: string, bonsai: Bonsai): Observable<void> {
    return this.httpClient.put<void>(this.BASE_URL + this.API_URL + '/' + bonsaiId, bonsai);
  }
}
