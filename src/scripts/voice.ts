import { ElevenLabsClient } from "elevenlabs";
import { createWriteStream } from "fs";

const elevenlabs = new ElevenLabsClient();

export async function generateVoice(text: string, fileName: string) {
  const audioStream = await elevenlabs.generate({
    stream: true,
    voice: "5x4OabTaxKEADQiUryOC",
    text,
    model_id: "eleven_multilingual_v2",
  });

  const fileStream = createWriteStream(fileName);

  await new Promise((resolve, reject) => {
    audioStream.pipe(fileStream);
    audioStream.on("end", resolve);
    audioStream.on("error", reject);
  });
}
