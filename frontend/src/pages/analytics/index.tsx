import PageTitle from "@/components/PageTitle";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
  // TODO: Implement analytics with charts and detailed metrics
  // Ticket: #ANALYTICS-001

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Analytics"
        subtitle="Track your scheduling performance and insights"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">+12.5%</span> from
              last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.3%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">+3.2%</span> from
              last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">+18.2%</span> from
              last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Advanced Analytics Coming Soon
        </h3>
        <p className="text-gray-600 max-w-lg mx-auto mb-4">
          We're working on comprehensive analytics including booking trends,
          popular event types, peak booking times, and detailed performance
          metrics.
        </p>
        <p className="text-sm text-gray-500">
          Expected features: Charts, Graphs, Exports, Custom Reports
        </p>
      </div>
    </div>
  );
};

export default Analytics;
