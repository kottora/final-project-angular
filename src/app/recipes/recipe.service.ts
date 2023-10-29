import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shopping-list/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes; // ჩავანაცვლოთ ჩვენი რეცეპტების სია
    this.recipesChanged.next(this.recipes.slice()); // დავაემიტოთ ახალი სია
  }

  getRecipes() {
    return this.recipes.slice(); // დავაბრუნოთ რეცეპტების copy
  }

  getRecipe(index: number) {
    return this.recipes[index]; // კონკრეტული რეცეპტის დასაბრუნებლად
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients); 
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe); // ერთი რეცეპტის დამატება
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe; // ერთი რეცეპტის განახლება
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1); // ერთი რეცეპტის წაშლა
    this.recipesChanged.next(this.recipes.slice());
  }
}
