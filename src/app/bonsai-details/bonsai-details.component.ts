import {Component, inject, OnInit} from '@angular/core';
import {Note, Picture} from '../http/Bonsai';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BackendService} from '../http/backend.service';
import {AsyncPipe, CurrencyPipe, DatePipe, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {AgeDifferencePipe} from '../age-difference.pipe';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {map, of, switchMap, take} from 'rxjs';
import {QrCodeDialogComponent} from '../qr-code-dialog/qr-code-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-bonsai-details',
  imports: [
    CurrencyPipe,
    MatButton,
    RouterLink,
    NgIf,
    DatePipe,
    AgeDifferencePipe,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    MatSuffix,
    MatIcon,
    MatIconButton,
    MatDivider,
    AsyncPipe,
    MatPaginator,
    MatCardModule
  ],
  templateUrl: './bonsai-details.component.html',
  styleUrl: './bonsai-details.component.css'
})
export class BonsaiDetailsComponent implements OnInit {
  bonsaiId: string = ''
  newNoteContent: string = '';
  picturePage: number = 1;
  picturePageSize: number = 25;
  notesPage: number = 1;
  notesPageSize: number = 25;
  selectedFiles: File[] = [];
  notes: Note[] = [];
  pictures: Picture[] = [];
  private route = inject(ActivatedRoute)
  private backendService = inject(BackendService)
  bonsai$ = this.route.params.pipe(switchMap(params => {
    const bonsaiId = params["id"] as string;
    return this.backendService.getBonsaiById(bonsaiId)
  }));
  private matDialog = inject(MatDialog)

  ngOnInit(): void {
    const bonsaiId = this.route.snapshot.paramMap.get('id');
    if (bonsaiId) {
      this.bonsaiId = bonsaiId
      this.backendService.getAllNotesByBonsaiId(bonsaiId, this.notesPage, this.notesPageSize).subscribe(data => {
        this.notes = data;
      })
      this.backendService.getPicturesByBonsaiId(bonsaiId, this.picturePage, this.picturePageSize).subscribe(data => {
        this.pictures = data;
      })
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  uploadImages() {
    if (this.selectedFiles.length === 0) return;

    const formData = new FormData();
    this.selectedFiles.forEach(file => formData.append('pictures', file));

    this.backendService.uploadPictures(this.bonsaiId, formData).pipe(
      switchMap(() => this.route.params),
      switchMap(params => this.backendService.getPicturesByBonsaiId(params["id"] as string, this.picturePage, this.picturePageSize))
    ).subscribe(data => {
      this.pictures = data;
      this.selectedFiles = []
    });
  }

  addNote(): void {
    if (!this.bonsaiId || !this.newNoteContent.trim()) return;

    const newNote: Partial<Note> = {content: this.newNoteContent};

    this.backendService.addNoteToBonsai(this.bonsaiId, newNote).subscribe((createdNote: Note) => {
      this.notes.unshift(createdNote);
      this.newNoteContent = '';
    });
  }

  deleteNote(noteId: string): void {
    this.backendService.deleteNote(noteId).subscribe(() => {
      this.notes = this.notes.filter(n => n.uuid !== noteId);
    });
  }

  showQrCode(bonsaiId: string) {
    this.matDialog.open(QrCodeDialogComponent, {
      data: {bonsaiId}
    })
  }

  wasRepotted() {
    this.bonsai$.pipe(
      take(1),
      switchMap(bonsai =>
        this.backendService.updateBonsai(bonsai.uuid, {
          ...bonsai,
          lastRepoted: new Date().toISOString()
        }).pipe(
          switchMap(() =>
            this.route.params.pipe(
              switchMap(() => {
                return this.backendService.getBonsaiById(bonsai.uuid);
              })
            )
          )
        )
      )
    ).subscribe(updatedBonsai => {
      this.bonsai$ = of(updatedBonsai);
    });
  }

  onPicturePageChange(event: PageEvent) {
    this.picturePageSize = event.pageSize;
    this.picturePage = event.pageIndex;

    this.route.params.pipe(
      switchMap((params) =>
        this.backendService.getPicturesByBonsaiId(params['id' as string], this.picturePage, this.picturePageSize).pipe(
          map((pictures) => this.pictures = pictures)
        ))
    ).subscribe()
  }

  onNotesPageChange(event: PageEvent) {
    this.notesPageSize = event.pageSize;
    this.notesPage = event.pageIndex;

    this.route.params.pipe(
      switchMap((params) =>
        this.backendService.getAllNotesByBonsaiId(params['id' as string], this.notesPage, this.notesPageSize).pipe(
          map((notes) => this.notes = notes)
        ))
    ).subscribe()
  }
}
