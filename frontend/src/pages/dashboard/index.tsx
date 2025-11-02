import PageTitle from "@/components/PageTitle";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  // TODO: Implement dashboard with real metrics and data
  // Ticket: #DASH-001

  const stats = [
    {
      title: "Total Events",
      value: "12",
      icon: Calendar,
      description: "Active event types",
    },
    {
      title: "Upcoming Meetings",
      value: "8",
      icon: Clock,
      description: "In the next 7 days",
    },
    {
      title: "Team Members",
      value: "5",
      icon: Users,
      description: "Active collaborators",
    },
    {
      title: "Booking Rate",
      value: "78%",
      icon: TrendingUp,
      description: "Last 30 days",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Dashboard"
        subtitle="Overview of your scheduling activity and metrics"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Dashboard Coming Soon
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We're building a comprehensive dashboard with analytics, recent
          activity, and quick actions. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
