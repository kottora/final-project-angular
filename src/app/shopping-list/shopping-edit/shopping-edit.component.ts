import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm!: NgForm;
  subscription!: Subscription;
  editMode = false;
  editedItemIndex!: number;
  editedItem!: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing // edit-ის დაწყებას მოვუსმინოთ და როცა დაიწყება და დააემიტებენ index-ს მაშინ შევცვალოთ ცვლადები
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedItem = this.slService.getIngredient(index); // ავიღოთ ის ინგრედიენტი რომელსაც ვაედითებთ
          this.slForm.setValue({ // ფორმაში გამოვსახოთ ამ აითემის სახელი და რაოდენობა
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount); // საბმითზე შევქმნათ ახალი ინგრედიენტი შემოტანილი ველებით
    if (this.editMode) { // editmode-ში ვიყავით მაშინ update გამოვიძახოთ
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else { // თუ არადა add-ი
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false; // მორჩა edit-ი
    form.reset(); // ფორმა გავწმინდოთ
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }
 
  onDelete() { // delete მხოლოდ editmode-ში ხდება
    this.slService.deleteIngredient(this.editedItemIndex); // ვშლით იმას რომელსაც ვაედითებდით
    this.onClear(); // ვასუფთავებთ ფორმას და editmode = false;
  }

  ngOnDestroy() { // for memory leak problem
    this.subscription.unsubscribe(); 
  }

}
