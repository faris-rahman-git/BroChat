import { StatsReturn } from '@bro/shared';

export type DashBoardDataType = {
  userCount: {
    totalUsers: number;
    activeUsers: number;
  };
  personalchatCount: {
    totalChat: number;
    newChat: number;
  };
  groupChatCount: { totalChat: number; newChat: number };
  revenueCount: { totalRevenue: number; todayRevenue: number };
  userState: StatsReturn;
  chatState: StatsReturn;
  groupState: StatsReturn;
  revenueState: StatsReturn;
};