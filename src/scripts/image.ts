import * as fal from "@fal-ai/serverless-client";
import { writeFile } from "fs/promises";

export async function generateImage(prompt: string, fileName: string) {
  const result = (await fal.subscribe("fal-ai/fast-sdxl", {
    input: {
      prompt,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs?.map((log) => log.message).forEach(console.log);
      }
    },
  })) as { images: { url: string }[] };

  if (result.images.length < 1) {
    throw new Error("No images returned");
  }

  const { url } = result.images[0];

  const buffer = await fetch(url).then(async (response) => {
    return Buffer.from(await response.arrayBuffer());
  });

  await writeFile(fileName, buffer);

  return url;
}
