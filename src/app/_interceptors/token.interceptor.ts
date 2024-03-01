import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const token = localStorage.getItem('token');

    let jwt = request.clone({
        setHeaders: {
          Authorization: 'bearer ' + token,
          accept: 'application/json',
          'Cache-Control': 'no-cache',
        }
    })
    return next.handle(jwt);
  }
}