// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUser, User } from "../../../utils/api/authUtils";

type Data = {
  user?: User;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: "Unauthenticated" });
  res.status(200).json({ user });
}
