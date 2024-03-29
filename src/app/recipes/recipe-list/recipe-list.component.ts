import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes!: Recipe[];
  subscription!: Subscription;

  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscription = this.recipeService.recipesChanged // მოვუსმინოთ რეცეპტების სიის ცვლილებას რომ დავააფდეითოთ მასივი
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
    this.recipes = this.recipeService.getRecipes(); // ჩატვირთვისას სერვისიდან წამოვიღოთ მასივის copy
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route}); // ახალი რეცეპტის შექმნისას გადავიდეთ new კომპონენტზე რომელიც აქტიური route-ს რელატიურია
  }

  ngOnDestroy() { // for memory leak problem
    this.subscription.unsubscribe();
  }
}
