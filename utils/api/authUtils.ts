import type { NextApiRequest } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const jwtSecret = process.env.JWT_SECRET as string;

export type User = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  lastVerificationGeneratedAt: Date;
};

/**
 * Returns the authenticated user or null if the user is not authenticated.
 * @param req The request object.
 */
export async function getAuthenticatedUser(req: NextApiRequest) {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const token = cookie.split("=")[1];
  if (!token) return null;

  const { userId, name } = jwt.verify(token, jwtSecret) as JwtPayload;
  if (!userId || !name) return null;

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  prisma.$disconnect();

  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    verified: user.verified,
    lastVerificationGeneratedAt: user.lastVerificationGeneratedAt,
  };
}

/**
 * Returns a new JWT token for a user.
 * @param id the id of the user.
 * @param name the name of the user.
 */
export async function createJWT(id: string, name: string) {
  const jwtToken = jwt.sign({ userId: id, name: name }, jwtSecret);
  return jwtToken;
}
