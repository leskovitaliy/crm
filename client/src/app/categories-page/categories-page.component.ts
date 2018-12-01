import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { ICategory } from '../shared/interfaces';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesPageComponent implements OnInit {

  loading = false;
  categories: ICategory[] = [];

  constructor(private categoriesService: CategoriesService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loading = true;
    this.categoriesService.get().subscribe((categories: Array<ICategory>) => {
      this.loading = false;
      this.categories = categories;
      this.cdr.detectChanges();
    });
  }

}
