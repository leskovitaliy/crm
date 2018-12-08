import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IFIlter } from '../interfaces/history';
import { IMaterialDatepicker, MaterialService } from '../../shared/services/material.service';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {
  @ViewChild('start') startRef: ElementRef;
  @ViewChild('end') endRef: ElementRef;

  @Output() onFilter = new EventEmitter<IFIlter>();

  order: number;
  start: IMaterialDatepicker;
  end: IMaterialDatepicker;

  isValid = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this));
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.start.destroy();
    this.end.destroy();
    this.cdr.detectChanges();
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      return;
    }

    this.isValid = this.start.date < this.end.date;
    this.cdr.detectChanges();
  }

  submitFilter() {
    const filter: IFIlter = {};

    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.onFilter.emit(filter);
    this.cdr.detectChanges();
  }

}
