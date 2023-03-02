// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import { LiquidityEntity } from "@/src/entities/radyum.entity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LiquidityEntity[]>
) {
  const jsonDirectory = path.join(process.cwd(), "src");
  const fileContents = await fs.readFile(
    jsonDirectory + "/mainnet.json",
    "utf8"
  );
  const data = JSON.parse(fileContents);
  res.status(200).json(data?.official?.concat(data?.unOfficial));
}
