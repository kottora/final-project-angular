import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false; // isOpen მიება open კლასს, თუ true მიენიჭება თუ არადა მოშორდება

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen; // clickზე თუ true იყო false გახდება და vice versa
  }
}
