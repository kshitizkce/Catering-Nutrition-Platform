import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [

    provideRouter(routes),

    provideAnimations(),

    provideToastr(),

    provideHttpClient(withInterceptorsFromDi()),

    importProvidersFrom(FormsModule),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }

  ]
};