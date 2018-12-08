import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IMaterialInstance, MaterialService } from '../shared/services/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { STEP } from './constants/history';
import { Subscription } from 'rxjs';
import { IOrder } from '../shared/interfaces';
import { IFIlter } from './interfaces/history';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: IMaterialInstance;
  ordersSub$: Subscription;

  isFilterVisible = false;
  orders: IOrder[] = [];
  filter: IFIlter = {};

  offset = 0;
  limit = STEP;

  loading = false;
  reloading = false;
  noMoreOrders = false;

  constructor(private ordersService: OrdersService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.reloading = true;
    this.getOrders();
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy() {
    this.tooltip.destroy();

    if (this.ordersSub$) {
      this.ordersSub$.unsubscribe();
    }
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getOrders();
  }

  applyFilter(filter: IFIlter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.getOrders();
    this.cdr.detectChanges();
  }

  isFiltered(): boolean {
    return this.filter ? Object.keys(this.filter).length !== 0 : false;
  }

  private getOrders() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });

    this.ordersSub$ = this.ordersService.get(params).subscribe(orders => {
      this.orders = this.orders.concat(orders);
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;
      this.cdr.detectChanges();
    });
  }

}
