import PageTitle from "@/components/PageTitle";
import { Calendar, Users, Clock, TrendingUp, Video, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalyticsQueryFn } from "@/lib/api";
import { Loader } from "@/components/loader";
import { format } from "date-fns";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["dashboard_analytics"],
    queryFn: getDashboardAnalyticsQueryFn,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" color="black" />
      </div>
    );
  }

  const overview = analyticsData?.data.overview;
  const topAttendees = analyticsData?.data.topAttendees || [];
  const meetingsPerDay = analyticsData?.data.meetingsPerDay || {};
  const recentMeetings = analyticsData?.data.recentMeetings || [];
  const popularEvents = analyticsData?.data.popularEvents || [];

  const stats = [
    {
      title: "Total Events",
      value: overview?.totalEvents || 0,
      icon: Calendar,
      description: "Active event types",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Upcoming Meetings",
      value: overview?.upcomingMeetings || 0,
      icon: Clock,
      description: "In the next 7 days",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Meetings",
      value: overview?.totalMeetings || 0,
      icon: Video,
      description: "All scheduled",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Booking Rate",
      value: overview?.bookingRate || "0%",
      icon: TrendingUp,
      description: "Last 30 days",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title="Dashboard"
        subtitle="Real-time overview of your scheduling activity and metrics"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Meetings Per Day Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-600" />
              Meetings This Week
            </CardTitle>
            <CardDescription>Daily meeting activity (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(meetingsPerDay).map(([day, count]) => (
                <div key={day} className="flex items-center gap-3">
                  <div className="text-sm font-medium w-16">{day}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / 10) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-blue-500 h-full flex items-center justify-end pr-2"
                    >
                      {count > 0 && (
                        <span className="text-xs text-white font-medium">{count}</span>
                      )}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Attendees */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Top Attendees
            </CardTitle>
            <CardDescription>Most frequent meeting participants</CardDescription>
          </CardHeader>
          <CardContent>
            {topAttendees.length > 0 ? (
              <div className="space-y-3">
                {topAttendees.map((attendee) => (
                  <div key={attendee.email} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm">
                      {attendee.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{attendee.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {attendee.email}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-purple-600">
                      {attendee.meetingCount} meetings
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No attendees yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Meetings */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Recent Meetings
            </CardTitle>
            <CardDescription>Your upcoming scheduled meetings</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMeetings.length > 0 ? (
              <div className="space-y-3">
                {recentMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <div className="text-xs font-semibold text-muted-foreground uppercase">
                        {format(new Date(meeting.startTime), "MMM")}
                      </div>
                      <div className="text-2xl font-bold">
                        {format(new Date(meeting.startTime), "dd")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(meeting.startTime), "HH:mm")}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{meeting.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        with {meeting.guestName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming meetings
              </p>
            )}
          </CardContent>
        </Card>

        {/* Popular Events */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Popular Events
            </CardTitle>
            <CardDescription>Most booked event types</CardDescription>
          </CardHeader>
          <CardContent>
            {popularEvents.length > 0 ? (
              <div className="space-y-3">
                {popularEvents.map((event, index) => (
                  <div key={event.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.bookings} bookings
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No events created yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
