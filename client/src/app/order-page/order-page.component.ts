import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IMaterialInstance, MaterialService } from '../shared/services/material.service';
import { OrderService } from './order.service';
import { IOrder, IOrderPosition } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  isRoot: boolean;
  modal: IMaterialInstance;
  pending = false;
  orderSub$: Subscription;

  @ViewChild('modal') modalRef: ElementRef;

  constructor(private router: Router,
              public orderService: OrderService,
              private ordersService: OrdersService) {
  }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal.destroy();

    if (this.orderSub$) {
      this.orderSub$.unsubscribe();
    }
  }

  removePosition(orderPosition: IOrderPosition) {
    this.orderService.remove(orderPosition);
  }

  open() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.pending = true;

    const order: IOrder = {
      list: this.orderService.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.orderSub$ = this.ordersService.create(order)
      .subscribe(
        newOrder => {
          MaterialService.toast(`Order №${newOrder.order} added.`);
          this.orderService.clear();
        },
        error => MaterialService.toast(error.error.message),
        () => {
          this.modal.close();
          this.pending = false;
        }
      );
  }

}
