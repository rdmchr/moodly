import type { NextApiRequest } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const jwtSecret = process.env.JWT_SECRET as string;
const prisma = new PrismaClient();

export type User = {
  id: string;
  email: string;
  name: string;
};

/**
 * Returns the authenticated user or null if the user is not authenticated.
 * @param req The request object.
 */
export async function getAuthenticatedUser(req: NextApiRequest) {
  const token = req.headers.authorization;
  if (!token) return null;
  const { userId, name } = jwt.verify(token, jwtSecret) as JwtPayload;
  if (!userId || !name) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
