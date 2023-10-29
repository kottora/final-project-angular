import { Ingredient } from './ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [];

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients; // ჩავანაცვლოთ ჩვენი ინგრედიენტების სია
    this.ingredientsChanged.next(this.ingredients.slice()); // დავაემიტოთ ახალი სია
  }

  getIngredients() {
    return this.ingredients.slice(); // აბრუნებს ინგრედიენტების copy-ს
  }

  getIngredient(index: number) {
    return this.ingredients[index]; // კონკრეტულ ინგრედიენტს აბრუნებს
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient); // ერთი ინგრედიენტის დამატება
    this.ingredientsChanged.next(this.ingredients.slice()); // updated მასივის დაემიტება
  }

  addIngredients(ingredients: Ingredient[] | undefined) {
    this.ingredients.push(...ingredients!); // რამდენიმე ინგრედიენტის დამატება
    this.ingredientsChanged.next(this.ingredients.slice()); // updated მასივის დაემიტება
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient; // კონკრეტული ინგრედიენტის განახლება
    this.ingredientsChanged.next(this.ingredients.slice()); // updated მასივის დაემიტება
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1); // კონკრეტული ინგრედიენტის წაშლა
    this.ingredientsChanged.next(this.ingredients.slice()); // updated მასივის დაემიტება
  }
}
