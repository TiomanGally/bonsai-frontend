import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AuthConfig, OAuthModule} from 'angular-oauth2-oidc';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['http://localhost:8123'],
        sendAccessToken: true
      }
    })),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch(),
    ),
    provideAnimations()
  ]
};

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/bonsai',
  redirectUri: window.location.origin,
  clientId: 'bonsai-pkce-client',
  responseType: 'code',
  strictDiscoveryDocumentValidation: false,
  scope: 'openid profile email',
  useSilentRefresh: true,
  showDebugInformation: true
}
