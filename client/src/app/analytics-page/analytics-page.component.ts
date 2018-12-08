import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { IAnalytics } from './interfaces/analyticts';
import { Subscription } from 'rxjs';

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
    this.analyticsSub$ = this.analyticsService.getAnalytics()
      .subscribe((data: IAnalytics) => {
        this.average = data.average;

        this.pending = false;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.analyticsSub$) {
      this.analyticsSub$.unsubscribe();
    }
  }

}
