"use server";

import { CreateEventParams, GetAllEventsParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../models/user.model";
import Event from "../models/event.model";
import Category from "../models/category.model";

const populateEvent = async (query: any) => {
  return query
  .populate({path: 'organizer', model: User, select: '_id firstName lastName'})
  .populate({path: 'category', model: Category, select: '_id name'})
}

export const createEvent = async ({ event, userId, path }: CreateEventParams) => {
  try {
    await connectToDatabase();

    const organizer = await User.findById(userId);

    if (!organizer) {
      throw new Error("NO user (organizer) found to connect this event too..");
    }
    // console.log({
    //   categoryId: event.categoryId,
    //   organizer: userId
    // });
    const newEvent = await Event.create({ ...event, category: event.categoryId, organizer:userId })

    return JSON.parse(JSON.stringify(newEvent))

  } catch (error) {
    // console.log(error);
    handleError(error);
  }
};

export const getEventById = async (eventId: string) => {
  try {
    await connectToDatabase()
    const event = await populateEvent(Event.findById(eventId)) // ! was missing "await"

    if(!event) { // ! was testing if eventId...
      throw new Error("No such eventId exists")
    }

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}


export const getAllEvents = async ({query, limit = 6, page, category}: GetAllEventsParams) => {
  try {
    await connectToDatabase()
    const conditions = {}

    const eventsQuery = Event.find(conditions)
    .sort({ createdAt: 'desc' })
    .skip(0)
    .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Event.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit)
    }
  } catch (error) {
    handleError(error)
  }
}