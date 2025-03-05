import {Component, inject, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Observable} from 'rxjs';
import {WeatherData} from '../http/WeatherData';
import {AsyncPipe, LowerCasePipe, NgIf} from '@angular/common';
import {BackendService} from '../http/backend.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {RouterLink} from '@angular/router';
import {User} from '../http/Bonsai';
import {BonsaiAuthService} from '../bonsai-auth.service';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatToolbar,
    MatIconButton,
    AsyncPipe,
    NgIf,
    LowerCasePipe,
    MatProgressSpinner,
    RouterLink,
    MatButton
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title?: String;
  private backendService = inject(BackendService);
  authService = inject(BonsaiAuthService);
  weatherData$: Observable<WeatherData> = this.backendService.getCurrentWeatherInfo();
  userData$: Observable<User> = this.backendService.getCurrentUserInformation();
}
