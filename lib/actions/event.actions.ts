"use server";

import { CreateEventParams } from "@/types";
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

    console.log({
      categoryId: event.categoryId,
      organizer: userId
    });
    

    const newEvent = await Event.create({ ...event, category: event.categoryId, organizer:userId })

    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

export const getEventById = async (eventId: string) => {
  try {
    await connectToDatabase()
    const event = populateEvent(Event.findById(eventId))

    if(!eventId) {
      throw new Error("No such eventId exists")
    }

    return JSON.parse(JSON.stringify(event))
  } catch (error) {
    handleError(error)
  }
}