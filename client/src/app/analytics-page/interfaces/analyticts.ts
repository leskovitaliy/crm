export interface IAnalytics {
  average: number;
  chart: IAnalyticsChartItem;
}

export interface IAnalyticsChartItem {
  profit: number;
  order: number;
  label: string;
}
