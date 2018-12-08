import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { IAnalytics } from './interfaces/analyticts';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('profit') profitRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  average: number;
  pending = true;

  analyticsSub$: Subscription;

  constructor(private analyticsService: AnalyticsService,
              private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    const profitConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    };

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    };

    this.analyticsSub$ = this.analyticsService.getAnalytics()
      .subscribe((data: IAnalytics) => {
        this.average = data.average;

        profitConfig.labels = data.chart.map((item) => item.label);
        profitConfig.data = data.chart.map((item) => item.profit);

        orderConfig.labels = data.chart.map((item) => item.label);
        orderConfig.data = data.chart.map((item) => item.order);

        const profitContext = this.profitRef.nativeElement.getContext('2d');
        const orderContext = this.orderRef.nativeElement.getContext('2d');
        profitContext.canvas.height = '300px';
        orderContext.canvas.height = '300px';

        new Chart(profitContext, this.createChartConfig(profitConfig));
        new Chart(orderContext, this.createChartConfig(orderConfig));

        this.pending = false;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.analyticsSub$) {
      this.analyticsSub$.unsubscribe();
    }
  }

  createChartConfig({ labels, data, label, color }) {
    return {
      type: 'line',
      options: {
        responsive: true
      },
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            borderColor: color,
            steppedLine: false,
            fill: false
          }
        ]
      }
    };
  }
}
