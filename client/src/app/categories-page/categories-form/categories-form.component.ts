import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {
  isNew = true;

  constructor(private aRoute: ActivatedRoute) { }

  ngOnInit() {
    this.aRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        // edit form
        this.isNew = false;
      }
    });
  }

}
