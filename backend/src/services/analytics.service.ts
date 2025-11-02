import { Between, MoreThan, LessThan } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { Meeting, MeetingStatus } from "../database/entities/meeting.entity";
import { Event } from "../database/entities/event.entity";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

export const getDashboardAnalyticsService = async (userId: string) => {
  const meetingRepository = AppDataSource.getRepository(Meeting);
  const eventRepository = AppDataSource.getRepository(Event);

  const now = new Date();
  const last30Days = subDays(now, 30);
  const last7Days = subDays(now, 7);

  // Total Events
  const totalEvents = await eventRepository.count({
    where: { user: { id: userId } },
  });

  // Upcoming Meetings (next 7 days)
  const upcomingMeetings = await meetingRepository.count({
    where: {
      user: { id: userId },
      status: MeetingStatus.SCHEDULED,
      startTime: Between(now, endOfDay(subDays(now, -7))),
    },
  });

  // Total Meetings (all time)
  const totalMeetings = await meetingRepository.count({
    where: {
      user: { id: userId },
      status: MeetingStatus.SCHEDULED,
    },
  });

  // Meetings this month
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const meetingsThisMonth = await meetingRepository.count({
    where: {
      user: { id: userId },
      status: MeetingStatus.SCHEDULED,
      startTime: Between(firstDayOfMonth, now),
    },
  });

  // Meetings last 30 days
  const meetingsLast30Days = await meetingRepository.count({
    where: {
      user: { id: userId },
      status: MeetingStatus.SCHEDULED,
      startTime: Between(last30Days, now),
    },
  });

  // Calculate booking rate (meetings scheduled vs total available slots)
  // Simplified calculation: (meetings / potential meetings) * 100
  const potentialMeetings = totalEvents * 20; // Assume 20 potential bookings per event
  const bookingRate = potentialMeetings > 0 
    ? Math.round((meetingsLast30Days / potentialMeetings) * 100) 
    : 0;

  // Top attendees (guests with most meetings)
  const topAttendeesData = await meetingRepository
    .createQueryBuilder("meeting")
    .select("meeting.guestEmail", "email")
    .addSelect("meeting.guestName", "name")
    .addSelect("COUNT(*)", "count")
    .where("meeting.userId = :userId", { userId })
    .andWhere("meeting.status = :status", { status: MeetingStatus.SCHEDULED })
    .groupBy("meeting.guestEmail")
    .addGroupBy("meeting.guestName")
    .orderBy("count", "DESC")
    .limit(5)
    .getRawMany();

  const topAttendees = topAttendeesData.map((attendee) => ({
    name: attendee.name,
    email: attendee.email,
    meetingCount: parseInt(attendee.count),
  }));

  // Meetings per day (last 7 days)
  const meetingsPerDayData: { [key: string]: number } = {};
  
  for (let i = 6; i >= 0; i--) {
    const day = subDays(now, i);
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    
    const count = await meetingRepository.count({
      where: {
        user: { id: userId },
        status: MeetingStatus.SCHEDULED,
        startTime: Between(dayStart, dayEnd),
      },
    });
    
    meetingsPerDayData[format(day, "MMM dd")] = count;
  }

  // Recent meetings
  const recentMeetings = await meetingRepository.find({
    where: {
      user: { id: userId },
      status: MeetingStatus.SCHEDULED,
      startTime: MoreThan(now),
    },
    relations: ["event"],
    order: { startTime: "ASC" },
    take: 5,
  });

  // Popular events (events with most bookings)
  const popularEventsData = await meetingRepository
    .createQueryBuilder("meeting")
    .select("event.id", "id")
    .addSelect("event.title", "title")
    .addSelect("COUNT(*)", "bookings")
    .innerJoin("meeting.event", "event")
    .where("meeting.userId = :userId", { userId })
    .andWhere("meeting.status = :status", { status: MeetingStatus.SCHEDULED })
    .groupBy("event.id")
    .addGroupBy("event.title")
    .orderBy("bookings", "DESC")
    .limit(5)
    .getRawMany();

  const popularEvents = popularEventsData.map((event) => ({
    id: event.id,
    title: event.title,
    bookings: parseInt(event.bookings),
  }));

  return {
    overview: {
      totalEvents,
      upcomingMeetings,
      totalMeetings,
      bookingRate: `${bookingRate}%`,
    },
    topAttendees,
    meetingsPerDay: meetingsPerDayData,
    recentMeetings: recentMeetings.map((m) => ({
      id: m.id,
      title: m.event?.title || "Meeting",
      guestName: m.guestName,
      guestEmail: m.guestEmail,
      startTime: m.startTime,
      endTime: m.endTime,
      meetLink: m.meetLink,
    })),
    popularEvents,
  };
};
