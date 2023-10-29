import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from './ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients!: Ingredient[];
  private subscription!: Subscription;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.slService.getIngredients(); // shopping-list კომპონენტზე გადასვლისას ყოველთვის განახლდეს ინგრედიენტების მასივი
    this.subscription = this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients; // მოვუსმინოთ რომ ყოველი ცვლილებისას მასივი დავაფდეითოთ
        }
      );
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index); // დაeditებისას startedEditing-ს იმ ინგრედიენტის ინდექსი დავუემიტოთ რომელსაც ვაედითებთ
  }

  ngOnDestroy() { // memory leak რომ არ მოხდეს
    this.subscription.unsubscribe();
  }
}
