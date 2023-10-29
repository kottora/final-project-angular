import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { PageNotFoundService } from './auth/page-not-found/PageNotFound.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  PageNotFound = false;
  constructor(
    private authService: AuthService,
    private pageNotFoundService: PageNotFoundService
  ) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.pageNotFoundService.PageNotFound.subscribe((pageisfound) => { // თუ invalid URL არის მაშინ header არ გამოჩნდეს
      this.PageNotFound = !pageisfound;
    });
  }
}
