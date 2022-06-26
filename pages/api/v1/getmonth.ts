import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUser } from "../../../utils/api/authUtils";

type Response = {
  error?: string;
  month?: {
    id: string;
    rating: number;
    description: string | null;
    date: Date;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const month =
    (req.query.month as string) || String(new Date().getMonth() + 1);
  const year = (req.query.year as string) || String(new Date().getFullYear());

  const gte = new Date(`${year}-${month}-01`);
  const lte = new Date(gte.getTime());
  lte.setMonth(lte.getMonth() + 1);

  const prisma = new PrismaClient();
  const data = await prisma.day.findMany({
    where: {
      user: { id: user.id },
      date: {
        lte,
        gte,
      },
    },
    select: {
      id: true,
      date: true,
      description: true,
      rating: true,
    },
  });
  prisma.$disconnect();

  res.json({ month: data });
}
