import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOverviewPage } from '../../overview-page/interfaces/overview';
import { IAnalytics } from '../../analytics-page/interfaces/analyticts';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) { }

  getOverview(): Observable<IOverviewPage> {
    return this.http.get<IOverviewPage>('/api/analytics/overview');
  }

  getAnalytics(): Observable<IAnalytics> {
    return this.http.get<IAnalytics>('/api/analytics/analytics');
  }
}
