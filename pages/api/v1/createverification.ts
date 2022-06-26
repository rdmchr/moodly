import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUser } from "../../../utils/api/authUtils";
import { sendVerificationEmail } from "../../../utils/api/emailUtils";

type Response = {
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  if (user.verified)
    return res.status(400).json({ error: "User already verified" });
  if (
    Date.now() - user.lastVerificationGeneratedAt.getTime() <
    1000 * 60 * 30
  ) {
    return res.status(400).json({
      error: "Please wait 30 minuted before requesting another email",
    });
  }

  const prisma = new PrismaClient();
  await prisma.user.update({
    where: { id: user.id },
    data: { lastVerificationGeneratedAt: new Date() },
  });
  prisma.$disconnect();

  await sendVerificationEmail(user.email, user.name, user.id);
  return res.json({
    user: {
      email: user.email,
      name: user.name,
      id: user.id,
      verified: user.verified,
    },
  });
}
