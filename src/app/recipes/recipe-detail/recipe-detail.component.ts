import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  id!: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params // ვუსმონოთ avtivated route-ის პარამეტრებს
      .subscribe((params: Params) => {
        this.id = +params['id']; // და ავიღოთ იქიდან id
        this.recipe = this.recipeService.getRecipe(this.id); // და შესაბამისად რეცეპტი
      });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients); // რეცეპტის ინგრედიენტები დავამატოთ shopping-list-ში
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route }); // რეცეპტის დაედიტებაზე გადავიდეთ edit-ზე
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id); // წავშალოთ რეცეპტი
    this.router.navigate(['/recipes']); // და დავბრუნდეთ /recipes გვერდზე
  }
}
