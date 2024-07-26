

"use client"
import useSWR from 'swr';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { AreaGraph } from '@/components/charts/area-graph';
import { BarGraph } from '@/components/charts/bar-graph';
import { PieGraph } from '@/components/charts/pie-graph';
import { RecentSales } from '@/components/recent-sales';
import Loader from '@/app/components/components/common/Loader';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export default function Page() {
  const { data, error } = useSWR('/api/dashboardfig', fetcher);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRunUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/manualUpdate', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to run manual update');
      }
      const result = await response.json();
      toast.success(result.message);
    } catch (error) {

       if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) return <div>Error loading data</div>;
  if (!data) return <Loader/>;

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button onClick={handleRunUpdate} disabled={isUpdating}>
              {isUpdating ? 'Running...' : 'Run interest'}
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${data.totalRevenue.amount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.totalRevenue.change > 0 ? '+' : ''}{data.totalRevenue.change.toFixed(1)}% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{data.totalSubscriptions.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.totalSubscriptions.change > 0 ? '+' : ''}{data.totalSubscriptions.change.toFixed(1)}% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{data.newUsers.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.newUsers.change > 0 ? '+' : ''}{data.newUsers.change.toFixed(1)}% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{data.totalInterests.amount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.totalInterests.change > 0 ? '+' : ''}{data.totalInterests.change.toFixed(1)}% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${data.totalBalance.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
