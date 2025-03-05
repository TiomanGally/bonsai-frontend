import {inject, Injectable} from '@angular/core';
import {authConfig} from './app.config';
import {OAuthService} from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class BonsaiAuthService {

  private authService = inject(OAuthService);

  constructor() {
    this.authService.configure(authConfig)
    this.authService.loadDiscoveryDocumentAndTryLogin();
  }

  isAuthenticated() {
    return this.authService.getAccessToken()?.length > 0;
  }

  login() {
    this.authService.initCodeFlow()
  }

  logout() {
    this.authService.logOut()
  }
}
