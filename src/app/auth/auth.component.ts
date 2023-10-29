import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true; // html button-სთვის
  isLoading = false; // loading spinner-სთვის
  error: string = ""; // error მესიჯებისთვის

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode; // from sign up to login and vice versa :D
  }

  onSubmit(form: NgForm) {
    if (!form.valid) { // თუ template driven ფორმის დაემიტების შემდეგ არავალიდური იყო ფორმა, არაფერი ვქნათ
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true; // ამ დროს ლოდინი დაიწყოს :)

    if (this.isLoginMode) { // იმის მიხედვით რომელი Button გამოიყენა მომხმარებელმა შესაბამისი request გაკეთდეს
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (resData) => { // თუ წარმატებით დასრულდა request
        console.log(resData); // მაშინ დაბრუნებული response დავბეჭდოთ
        this.isLoading = false; // ლოდინი დასრულდა
        this.router.navigate(['/recipes']); // გადავამისამართოთ /recipes-ზე
      },
      (errorMessage) => { // თუ არადა შესაბამისი error-ი ვაჩვენოთ
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset(); // ფორმა უნდა დარესეტდეს საბმიტის მერე
  }
}
