import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';
import { RecipeService } from '../recipes/recipe.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private recipeService: RecipeService, private shoppingListService: ShoppingListService) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCvtX5oo9yfp18Ka0Gt9qtLbDb-jE9l9lI',
        
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError), // http error-ებს გავუმკლავდეთ
        tap(resData => {
          this.handleAuthentication( // დაბრუნებული data გამოვიყენოთ user-ის დასაემიტებლად
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCvtX5oo9yfp18Ka0Gt9qtLbDb-jE9l9lI',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError), // http error-ებს გავუმკლავდეთ
        tap(resData => {
          this.handleAuthentication( // დაბრუნებული data გამოვიყენოთ user-ის დასაემიტებლად
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData')!); // თუ login გავლილი მაქვს მაშინ localStorage-ში უნდა იყოს სტრინგად შენახული ობიექტი
    if (!userData) { // თუ localStorage ცარიელია ესეიგი არვარ დალოგინებული
      return;
    }

    const loadedUser = new User( // javascript-ის ობიექტი გარდავქმნათ ჩვენ მიერ შექმნილ User ობიექტში
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) { // თუ token არსებობს და ამავდროულად არ გასვლია ვადა
      this.user.next(loadedUser); // მაშინ დავაემიტოთ ეს იუზერი
      const expirationDuration = // გამოვიანგარიშოთ ვადის გასვლის დრო
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration); // და autologout გავაკეთოთ ვადის გასვლის შემდეგ.
    }
  }

  logout() {
    this.user.next(null); // დავაემიტოთ null user-ში
    this.router.navigate(['/auth']); // გადავიდეთ authentication გვერდზე
    // გასვლამდე გავასუფთავოთ local მეხსიერება (local storage)
    localStorage.removeItem('userData');

    // გასვლამდე გავასუფთავოთ local მეხსიერება (arrays)
    this.recipeService.setRecipes([]);
    this.shoppingListService.setIngredients([]);

    // თუ ნაადრევად გავდივართ მაშინ timeout გავწმინდოთ რომ შემდეგ ხელახლა არ გამოიძახოს autologout-ი
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration); // expirationDuration დროის შემდეგ გამოიძახება logout ფუნქცია
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate); // ვქმნით user-ს http request-დან დაბრუნებული data-ით
    this.user.next(user); // ვაემიტებთ ამ იუზერს
    this.autoLogout(expiresIn * 1000); // აუტო logout-ს ვაყენებთ
    localStorage.setItem('userData', JSON.stringify(user)); // და ვავსებთ localStorage-ს ამ იუზერ ობიექტით რომელსაც სტრინგად ვინახავთ
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (!errorRes.error || !errorRes.error.error) { // http request ასეთი სახის ობიექტს აბრუნებს
      return throwError(errorMessage);
    }

    console.log(errorRes); // კონსოლში უკეთ ვნახავთ

    switch (errorRes.error.error.message) {
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Email or Password is incorrect';
        break;
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
