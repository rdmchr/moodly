import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type Response = {
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
  };
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (!req.method || req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const body = JSON.parse(req.body);
  const token = body.token;
  const userId = body.userId;
  const verification = await prisma.verification.findUnique({
    where: {
      token,
    },
  });
  if (!verification) {
    return res.status(401).json({ error: "Invalid verification link" });
  }
  if (verification.userId !== userId) {
    return res.status(401).json({ error: "Invalid verification link" });
  }
  if (verification.createdAt.getTime() + 3600000 < Date.now()) {
    return res.status(401).json({ error: "Verification link expired" });
  }
  // delete all remaining verification links
  await prisma.verification.deleteMany({
    where: {
      userId: userId,
    },
  });
  // update user
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      verified: true,
    },
  });
  return res.json({
    user: {
      id: userId,
      email: user.email,
      name: user.name,
      verified: user.verified,
    },
  });
}
