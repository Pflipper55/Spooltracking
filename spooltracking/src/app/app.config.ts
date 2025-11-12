import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Configuration } from './services/api-clients/configuration';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { firstValueFrom } from 'rxjs';

// Global config object
let apiConfig = {
  apiHost: 'localhost',
  apiPort: '5000'
};

// Function to load config from config.json
const loadConfig = (http: HttpClient) => async () => {
  try {
    const config = await firstValueFrom(http.get<any>('config.json'));
    apiConfig = config;
  } catch (error) {
    console.warn('Could not load config.json, using defaults', error);
  }
};

// Get API base URL from loaded config
const getApiBaseUrl = (): string => {
  return `http://${apiConfig.apiHost}:${apiConfig.apiPort}`;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [HttpClient],
      multi: true
    },
    {
      provide: Configuration,
      useValue: new Configuration({ basePath: getApiBaseUrl() })
    },
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
