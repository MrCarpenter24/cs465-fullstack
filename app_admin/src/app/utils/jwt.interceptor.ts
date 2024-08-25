import { HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';

@Injectable ()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      var isAuthAPI: boolean;

      // console.log('Interceptor::URL' + request.url);
      if(request.url.includes('/login') || request.url.includes('/register')) {
        isAuthAPI = true;
      }
      else {
        isAuthAPI = false;
      }

      if(this.authenticationService.isLoggedIn() && !isAuthAPI) {
        let token = this.authenticationService.getToken();
        const authReq = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(authReq);
      }
      return next.handle(request);
    }
}

export const authInterceptProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
};

