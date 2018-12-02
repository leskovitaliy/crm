import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from '../../shared/services/material.service';
import { ICategory } from '../../shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {
  isNew = true;
  form: FormGroup;

  constructor(private aRoute: ActivatedRoute,
              private fb: FormBuilder,
              private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.required]
    });

    this.form.disable();

    this.aRoute.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe(
        (category: ICategory) => {
          if (category) {
            this.form.patchValue({
              name: category.name
            });
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        err => MaterialService.toast(err.error.message)
      );
  }

  onSubmit() {

  }

}
