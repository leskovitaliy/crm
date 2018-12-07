import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IMaterialInstance, MaterialService } from '../shared/services/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { STEP } from './constants/history';
import { Subscription } from 'rxjs';
import { IOrder } from '../shared/interfaces';

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

  private getOrders() {
    const params = {
      offset: this.offset,
      limit: this.limit
    };
    this.ordersSub$ = this.ordersService.get(params).subscribe(orders => {
      this.orders = this.orders.concat(orders);
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;
      this.cdr.detectChanges();
    });
  }

}
