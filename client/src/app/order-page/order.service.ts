import { Injectable } from '@angular/core';
import { IOrderPosition, IPosition } from '../shared/interfaces';

@Injectable()
export class OrderService {

  public list: IOrderPosition[] = [];
  public price = 0;

  constructor() { }

  add(position: IPosition) {
    const orderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    });

    const found = this.list.find(item => item._id === position._id);

    if (found) {
      found.quantity += position.quantity;
    } else {
      this.list.push(orderPosition);
    }

    this.computePrice();
  }

  remove(orderPosition: IOrderPosition) {
    const index = this.list.findIndex(item => item._id === orderPosition._id);
    this.list.splice(index, 1);
    this.computePrice();
  }

  clear() {

  }

  private computePrice() {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }
}
