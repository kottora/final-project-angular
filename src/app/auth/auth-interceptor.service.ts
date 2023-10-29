import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1), // ბოლო დაემიტებულ იუზერს იღებს და შემდეგ unsubscribe-საც უკეთებს
      exhaustMap(user => { // შეასრულებს პირველ response-ს და შემდეგ მეორე request-ს გააკეთებს
        if (!user) { // თუ იუზერი არ არის იმ reqeust-ს გააგზავნის რაც მიიღო
          return next.handle(req);
        }
        const modifiedReq = req.clone({ // თუ არადა authentication-ის დამადასტურებელ ნიშანსაც მიაყოლებს :)
          params: new HttpParams().set('auth', user.token!)
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
