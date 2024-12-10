import { calendar_v3, google } from 'googleapis';
import * as path from 'path';
import { logger } from '@/src/lib/logger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Event } from '@/src/common/types';
import { EventCategory, EventStatus } from '@/src/common/enums';
import { stringToEnum } from '@/src/lib/utils';

@Injectable()
export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve('google-services.json'),
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async getHolidayEvents(
    timeMin: string,
    timeMax?: string,
    maxResults?: number,
    country: string = 'indian',
  ): Promise<Event[]> {
    const holidayCalendarId = {
      indian: 'en.indian#holiday@group.v.calendar.google.com',
      usa: 'en.usa#holiday@group.v.calendar.google.com',
    };

    const calendarId = holidayCalendarId[country];

    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin,
        timeMax,
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events: Event[] = response.data.items.map((i) => {
        const event: Event = {
          id: i.id,
          name: i.summary,
          description: i.description,
          status: stringToEnum(EventStatus, i.status, EventStatus.TENTATIVE),
          category: EventCategory.HOLIDAY,
          createdBy: null,
          associatedTo: [],
          createdAt: new Date(i.created),
          updatedAt: new Date(i.updated),
          startAt: new Date(i.start.date),
          endAt: new Date(i.end.date),
        };
        return event;
      });
      return events;
    } catch (error) {
      logger.error((error as any)?.message, error);
      throw new BadRequestException('Failed from Google Api');
    }
  }
}
