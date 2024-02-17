"use server";

import { CreateEventParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../models/user.model";
import Event from "../models/event.model";

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
