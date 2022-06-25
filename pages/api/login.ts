// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

type Data = {
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
  };
};

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!req.method || req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) return res.status(400).json({ error: "User does not exist" });

  const isValid = await compare(password, user.password);
  if (!isValid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user.id, name: user.name }, jwtSecret);
  return res
    .status(200)
    .setHeader("Set-Cookie", `Authorization=${token}; HttpOnly; Secure`)
    .json({ user: { id: user.id, name: user.name, email: user.email, verified: user.verified } });
}
