import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  form: FormGroup;
  isNew = true;
  image: File;
  imagePreview = '';
  category: ICategory;

  @ViewChild('input') inputRef: ElementRef;

  constructor(private aRoute: ActivatedRoute,
              private fb: FormBuilder,
              private categoriesService: CategoriesService,
              private cdr: ChangeDetectorRef) { }

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
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
          this.cdr.detectChanges();
        },
        err => MaterialService.toast(err.error.message)
      );
  }

  openLoadImg() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
      this.cdr.detectChanges();
    };

    if (file) {
      reader.readAsDataURL(file);
      this.cdr.detectChanges();
    }
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image);
    }

    obs$.subscribe(
      (category: ICategory) => {
        this.category = category;
        MaterialService.toast('Changes saved');
        this.form.enable();
        this.cdr.detectChanges();
      },
      err => {
        MaterialService.toast(err.error.message);
        this.form.enable();
        this.cdr.detectChanges();
      }
    );
  }

}
