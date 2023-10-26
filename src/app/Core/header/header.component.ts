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
  private userSub: Subscription | undefined;
  userName: string | undefined;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.userName = user?.email;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
    this.dataStorageService.storeIngredients();
  }

  onFetchData() {
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
