import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { Ingredient } from '../shopping-list/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private shoppingListService: ShoppingListService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://test-64bc3-default-rtdb.firebaseio.com/recipes/' + this.authService?.user?.value?.id + '/data.json',
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://test-64bc3-default-rtdb.firebaseio.com/recipes/' + this.authService?.user?.value?.id + '/data.json',
      )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

  storeIngredients() {
    const ingredients = this.shoppingListService.getIngredients();
    this.http
      .put(
        'https://test-64bc3-default-rtdb.firebaseio.com/ingredients/' + this.authService?.user?.value?.id + '/data.json',
        ingredients
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchIngredients(){
    return this.http
      .get<Ingredient[]>(
        'https://test-64bc3-default-rtdb.firebaseio.com/ingredients/' + this.authService?.user?.value?.id + '/data.json',
      )
      .pipe(
        map(ingredients => {
          return ingredients.map(ingredient => {
            return {
              ...ingredient,
            };
          });
        }),
        tap(ingredients => {
          this.shoppingListService.setIngredients(ingredients);
        })
      );
  }
}
