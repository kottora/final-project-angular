import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template:
    '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>', //loading spinner html from internet
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {}
