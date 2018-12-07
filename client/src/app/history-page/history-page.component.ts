import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IMaterialInstance, MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: IMaterialInstance;
  isFilterVisible = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy() {
    this.tooltip.destroy();
  }

}
