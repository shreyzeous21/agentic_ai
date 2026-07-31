import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { google } from "googleapis";
import { getCalendarClient } from "../utils/calendar-auth";

async function createEvent(params: {
  summary: string;
  startTime: string;
  endTime: string;
  description?: string;
  location?: string;
  attendees?: string;
}) {
  try {
    const auth = await getCalendarClient();
    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary: params.summary,
      description: params.description,
      location: params.location,
      start: { dateTime: params.startTime, timeZone: "UTC" },
      end: { dateTime: params.endTime, timeZone: "UTC" },
      attendees: params.attendees
        ? params.attendees.split(",").map((e) => ({ email: e.trim() }))
        : [],
    };

    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return JSON.stringify({
      success: true,
      eventId: res.data.id,
      htmlLink: res.data.htmlLink,
      summary: res.data.summary,
      start: res.data.start?.dateTime,
      end: res.data.end?.dateTime,
    });
  } catch (err: any) {
    return JSON.stringify({
      success: false,
      error: err?.message ?? "Failed to create event.",
    });
  }
}

async function listEvents(params: { maxResults?: number }) {
  try {
    const auth = await getCalendarClient();
    const calendar = google.calendar({ version: "v3", auth });

    const res = await calendar.events.list({
      calendarId: "primary",
      maxResults: params.maxResults ?? 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (res.data.items ?? []).map((e) => ({
      summary: e.summary,
      start: e.start?.dateTime ?? e.start?.date,
      end: e.end?.dateTime ?? e.end?.date,
      link: e.htmlLink,
    }));

    return JSON.stringify({ success: true, count: events.length, events });
  } catch (err: any) {
    return JSON.stringify({
      success: false,
      error: err?.message ?? "Failed to list events.",
    });
  }
}

export const createEventTool = tool(createEvent, {
  name: "calendar_create_event",
  description:
    "Create a Google Calendar event. Requires OAuth2 setup (see README). Times must be ISO 8601 (e.g. 2025-01-15T14:00:00Z).",
  schema: z.object({
    summary: z.string().describe("Event title"),
    startTime: z.string().describe("Start time in ISO 8601 format (e.g. 2025-01-15T14:00:00Z)"),
    endTime: z.string().describe("End time in ISO 8601 format"),
    description: z.string().optional().describe("Event description"),
    location: z.string().optional().describe("Event location"),
    attendees: z
      .string()
      .optional()
      .describe("Comma-separated email addresses of attendees"),
  }),
});

export const listEventsTool = tool(listEvents, {
  name: "calendar_list_events",
  description:
    "List upcoming Google Calendar events.",
  schema: z.object({
    maxResults: z.number().optional().describe("Max events to return (default 10)"),
  }),
});
