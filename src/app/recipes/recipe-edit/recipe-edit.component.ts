import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
  id!: number;
  editMode = false;
  recipeForm!: FormGroup;

  get recipeControls() {
    return (this.recipeForm?.get('ingredients') as FormArray).controls
  }

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => { // activated route-დან ვიღებთ პარამეტრებს
      this.id = +params['id']; // id-ს ვანიჭებთ
      this.editMode = params['id'] != null; // თუ id არაა ცარიელი ესეიგი editmode-შივართ
      this.initForm(); // ვიწყებთ ფორმის ინიციალიზებას
    });
  }

  onSubmit() { 
    if (this.editMode) { // თუ editmode იყო, მაშინ ვააფდეითებთ იმ რეცეპტს რომლის აიდიც გვქონდა route-ში
      this.recipeService.updateRecipe(this.id, this.recipeForm?.value);
    } else { // წინააღმდეგ შემთხვევაში ვამატებთ
      this.recipeService.addRecipe(this.recipeForm?.value);
    }
    this.onCancel(); // და შემდეგ ვამისამართებთ უკან, უფრო ზედა route-ზე
  }

  onAddIngredient() { // ინგრედიენტის დამატებაზე
    // ჩვენ მიერ შექმნილი formgroup-დან(recipeform) ვიღებთ formarray-ს(ingredients)
    // და მასში ვამატებთ formgroup-ს ცარიელი name და amount formcontrol-ებით
    (<FormArray>this.recipeForm?.get('ingredients')).push( 
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngredient(index: number) { // წაშლისას formarray-დან ვშლით ერთ formgroup-ს ანუ ინგრედიენტს
    (<FormArray>this.recipeForm?.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray<FormGroup>([]); // formgroup-ების formarray-ი

    if (this.editMode) { // თუ editmode-ში ვართ
      const recipe = this.recipeService.getRecipe(this.id); // activated route-ის შესაბამისი id_ით ავიღოთ რეცეპტი
      recipeName = recipe.name; // რეცეპტის სახელი
      recipeImagePath = recipe.imagePath; // რეცეპტის სურათის path-ი
      recipeDescription = recipe.description; // და აღწერა
      if (recipe['ingredients']) { // თუ რეცეპტს ინგრედიენტები აქვს
        for (let ingredient of recipe.ingredients) { // ყოველი ინგრედიენტისთვის
          recipeIngredients.push( // დავამატოთ formgroup-ი name და amount formcontrol-ებით
            new FormGroup({
              name: new FormControl(ingredient?.name, Validators.required),
              amount: new FormControl(ingredient?.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({ // ვქმნით formgroup-ს შესაბამისი formcontrol-ებით და ჩადგმული FormArray<FormGroup>-ით, თუ არიყო editmode-ში ცარიელი მნიშვნელობებით
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }
}
