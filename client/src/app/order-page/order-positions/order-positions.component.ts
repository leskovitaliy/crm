import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PositionsService } from '../../shared/services/positions.service';
import { Observable } from 'rxjs';
import { IPosition } from '../../shared/interfaces';
import { map, switchMap } from 'rxjs/operators';
import { OrderService } from '../order.service';
import { MaterialService } from '../../shared/services/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<IPosition[]>;

  constructor(private aRouter: ActivatedRoute,
              private positionsService: PositionsService,
              private orderService: OrderService) { }

  ngOnInit() {
    this.positions$ = this.aRouter.params
      .pipe(
        switchMap((params: Params) => this.positionsService.get(params['id'])),
        map((positions: IPosition[]) => {
          return positions.map(position => {
            position.quantity = 1;
            return position;
          });
        })
      );
  }

  addToOrder(position: IPosition) {
    MaterialService.toast(`Added x${position.quantity}`);
    this.orderService.add(position);
  }

}
