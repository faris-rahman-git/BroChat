import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@client/components/ui/select';
import { Users, MessageCircle, Users2, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { StatsReturn } from '@bro/shared';
import SummaryCard from '../../elements/dashBoard/SummaryCard';
import ChartCard from '../../elements/dashBoard/ChartCard';
import { useDashBoardPanelHook } from '@client/hooks/PageHooks/admin/dashBoard/useDashBoardPanelHook';

export function DashBoardPanel() {
  const {
    dashboardData,
    userTimeFilter,
    setUserTimeFilter,
    chatTimeFilter,
    setChatTimeFilter,
    groupTimeFilter,
    setGroupTimeFilter,
    revenueTimeFilter,
    setRevenueTimeFilter,
  } = useDashBoardPanelHook();

  return (
    <div className="w-full overflow-y-auto  bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Users"
            icon={<Users className="h-4 w-4" />}
            mainMetric={String(dashboardData?.userCount.totalUsers)}
            mainLabel="Total Users"
            subMetric={String(dashboardData?.userCount.activeUsers)}
            subLabel="Active Users"
          />
          <SummaryCard
            title="Personal Chats"
            icon={<MessageCircle className="h-4 w-4" />}
            mainMetric={String(dashboardData?.personalchatCount.totalChat)}
            mainLabel="Total Personal Chats"
            subMetric={String(dashboardData?.personalchatCount.newChat)}
            subLabel="New Chats"
          />
          <SummaryCard
            title="Groups"
            icon={<Users2 className="h-4 w-4" />}
            mainMetric={String(dashboardData?.groupChatCount.totalChat)}
            mainLabel="Total Groups"
            subMetric={String(dashboardData?.groupChatCount.newChat)}
            subLabel="New Groups"
          />
          <SummaryCard
            title="Revenue"
            icon={<DollarSign className="h-4 w-4" />}
            mainMetric={'₹ ' + String(dashboardData?.revenueCount.totalRevenue)}
            mainLabel="Total Revenue"
            subMetric={'₹ ' + String(dashboardData?.revenueCount.todayRevenue)}
            subLabel="Today's Revenue"
          />
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Row 1: User Stats and Personal Chats */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="User Stats"
              filter={
                <Select
                  value={userTimeFilter}
                  onValueChange={setUserTimeFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    dashboardData?.userState[
                      userTimeFilter as keyof StatsReturn
                    ]
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString()}`,
                      'Users',
                    ]}
                  />{' '}
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Personal Chats"
              filter={
                <Select
                  value={chatTimeFilter}
                  onValueChange={setChatTimeFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    dashboardData?.chatState[
                      chatTimeFilter as keyof StatsReturn
                    ]
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString()}`,
                      'chats',
                    ]}
                  />{' '}
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Row 2: Group Stats and Revenue */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Group Stats"
              filter={
                <Select
                  value={groupTimeFilter}
                  onValueChange={setGroupTimeFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    dashboardData?.groupState[
                      groupTimeFilter as keyof StatsReturn
                    ]
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString()}`,
                      'Groups',
                    ]}
                  />{' '}
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--chart-3))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Revenue"
              filter={
                <Select
                  value={revenueTimeFilter}
                  onValueChange={setRevenueTimeFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={
                    dashboardData?.revenueState[
                      revenueTimeFilter as keyof StatsReturn
                    ]
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      'Revenue',
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-4))"
                    fill="hsl(var(--chart-4))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
