import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUser } from "../../../utils/api/authUtils";

type Response = {
  error?: string;
  day?: {
    id: string;
    date: string;
    description: string | null;
    rating: number;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  let { date, rating, description } = req.body as {
    date: string;
    rating: number;
    description?: string;
  };
  if (!date || !rating) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  rating = Number(rating);

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  if (!/^[0-9]{5,5}-[0-9]{3,3}-[0-9]{3,3}$/.test(date)) {
    return res.status(400).json({ error: "Invalid date" });
  }

  const parsedDate = new Date(date);

  const prisma = new PrismaClient();

  const dbDay = await prisma.day.findFirst({
    where: {
      user: { id: user.id },
      date: parsedDate,
    },
  });
  if (dbDay) {
    prisma.$disconnect();
    return res.status(400).json({ error: "Day already exists" });
  }

  const day = await prisma.day.create({
    data: {
      date: parsedDate,
      rating,
      description,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  prisma.$disconnect();

  return res.status(200).json({
    day: {
      id: day.id,
      date: day.date.toISOString(),
      description: day.description,
      rating: day.rating,
    },
  });
}
