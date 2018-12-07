import { Component, Input, OnInit } from '@angular/core';
import { IOrder } from '../../shared/interfaces';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {
  @Input() orders: IOrder[];

  constructor() { }

  ngOnInit() {
  }

}
