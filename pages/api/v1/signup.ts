// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { sendVerificationEmail } from "../../../utils/api/emailUtils";
import jwt from "jsonwebtoken";
import { createJWT } from "../../../utils/api/authUtils";

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
  if (!req.method || req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  /* validate inputs */
  // validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Invalid email" });
  // validate password
  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long",
    });
  }
  if (!new RegExp("[0-9]").test(password)) {
    return res.status(400).json({
      error: "Password must contain at least one number",
    });
  }
  if (!new RegExp("[a-zA-Z]").test(password)) {
    return res.status(400).json({
      error: "Password must contain at least one letter",
    });
  }
  // validate name
  if (!/^[a-zA-Z ]{2,30}$/.test(name))
    return res.status(400).json({ error: "Invalid name" });

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    prisma.$disconnect();
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  prisma.$disconnect();

  //await sendVerificationEmail(email, name, newUser.id);
  const jwtToken = await createJWT(newUser.id, name);

  return res
    .status(200)
    .setHeader("Set-Cookie", `Authorization=${jwtToken}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`)
    .json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        verified: true,
      },
    });
}
