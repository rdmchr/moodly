// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";

type Input = {
  email: string;
  password: string;
  name: string;
};

type Response = {
  error?: string;
};

const prisma = new PrismaClient();

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
  if (
    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
      password
    )
  ) {
    return res.status(400).json({
      error:
        "Password must include at least one uppercase letter, one lowercase letter, one number and one special character",
    });
  }
  // validate name
  if (!/^[a-zA-Z ]{2,30}$/.test(name))
    return res.status(400).json({ error: "Invalid name" });

  const user = await prisma.user.findUnique({
    where: { email },
  });
  console.log(user);

  if (user) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return res.status(200).json({});
}
