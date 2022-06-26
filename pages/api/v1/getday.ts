import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUser } from "../../../utils/api/authUtils";

type Response = {
  error?: string;
  day?: {
    id: string;
    rating: number;
    description: string | null;
    date: Date;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  let date = (req.query.date as string) || String(new Date().toISOString());

  date = date.includes("T") ? date.split("T")[0] : date;
  const matchedDate = /^[0-9]{5,5}-[0-9]{3,3}-[0-9]{3,3}/.exec(date);
  if (matchedDate) {
    return res.status(400).json({ error: "Invalid date" });
  }

  const parsedDate = new Date(date);

  const prisma = new PrismaClient();
  const day = await prisma.day.findFirst({
    where: {
      user: { id: user.id },
      date: parsedDate,
    },
    select: {
      id: true,
      date: true,
      description: true,
      rating: true,
    },
  });
  prisma.$disconnect();

  if (!day) {
    return res.status(404).json({ error: "No data found for specified date" });
  }

  res.json({ day });
}
