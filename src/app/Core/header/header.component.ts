import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../../shared/data-storage.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription | undefined; // for unsubscribe
  userName: string | undefined;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user; // თუ იუზერი გვყავს მაშინ გამოჩნდეს header-ზე routerlink-ები
      this.userName = user?.email;  // და შესაბამისი ემაილიც თუ არადა არც გამოჩნდება
    });
  }

  onSaveData() { // savedata ღილაკზე დაჭერის შემდეგ
    this.dataStorageService.storeRecipes(); // შევინახოთ რეცეპტები სერვერზე
    this.dataStorageService.storeIngredients(); // და შევინახოთ ინგრედიენტებიც სერვერზე
  }

  onFetchData() { // fetchdata ღილაკზე დაჭერის შემდეგ
    this.dataStorageService.fetchRecipes().subscribe(
      (recipes) => {
        console.log(recipes);
      },
      (error) => {
        console.log('There is no Data on the Server');
      }
    );

    this.dataStorageService.fetchIngredients().subscribe(
      (recipes) => {
        console.log(recipes);
      },
      (error) => {
        console.log('There is no Data on the Server');
      }
    );
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}
