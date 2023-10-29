import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipesService: RecipeService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipesService.getRecipes(); // ავიღოთ სერვისიდან რეცეპტების copy

    if (recipes.length === 0) { // თუ ცარიელია
      return this.dataStorageService.fetchRecipes(); // სევრერიდან წამოვიღოთ
    } else {
      return recipes; // თუ არადა რაც გვქონდა ის დავაბრუნოთ
    }
  }
}
