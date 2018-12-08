export interface IOverviewPage {
  profit: IOverviewPageItem;
  orders: IOverviewPageItem;
}

export interface IOverviewPageItem {
  percent: number;
  compare: number;
  yesterday: number;
  isHigher: boolean;
}
