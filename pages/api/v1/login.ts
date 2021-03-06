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

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { email },
  });
  prisma.$disconnect();

  if (!user) return res.status(400).json({ error: "User does not exist" });

  const isValid = await compare(password, user.password);
  if (!isValid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user.id, name: user.name }, jwtSecret);
  return res
    .status(200)
    .setHeader("Set-Cookie", `Authorization=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`)
    .json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
      },
    });
}
