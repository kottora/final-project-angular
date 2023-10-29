import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageNotFoundService } from './PageNotFound.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  constructor(private pageNotFoundService: PageNotFoundService) {}

  ngOnInit(): void {
    this.pageNotFoundService.PageNotFound.next(true);
  }

  ngOnDestroy(): void {
    this.pageNotFoundService.PageNotFound.next(false);
  }
}
