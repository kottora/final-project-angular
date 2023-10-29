import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Ingredient } from './ingredient.model';
import { DataStorageService } from '../shared/data-storage.service';
import { ShoppingListService } from './shopping-list.service';

@Injectable({ providedIn: 'root' })
export class IngredientsResolverService implements Resolve<Ingredient[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private shoppingListService: ShoppingListService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const Ingredients = this.shoppingListService.getIngredients(); // ავიღოთ სერვისიდან ინგრედიენტების copy

    if (Ingredients.length === 0) { // თუ ცარიელია
      return this.dataStorageService.fetchIngredients(); // სევრერიდან წამოვიღოთ
    } else {
      return Ingredients; // თუ არადა რაც გვქონდა ის დავაბრუნოთ
    }
  }
}