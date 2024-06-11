import { anthropic } from "@ai-sdk/anthropic";
import { generateText, generateObject } from "ai";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { categories } from "./data";
import { generateImage } from "./image";
import { z } from "zod";
import filenamify from "filenamify";
import slugify from "slugify";

await mkdir("./public/images", { recursive: true });

for (const category of categories) {
  console.log(`generating an product for ${category}`);

  const product = await generateObject({
    model: anthropic("claude-3-sonnet-20240229"),
    messages: [
      {
        role: "system",
        content: [
          "You are an expert for inventing baby products",
          "Your task is to invent new baby products",
          "The products should be futuristic and environmently friendly",
          "Invent a new innovative baby product",
          "You are also an expert prompt engineer for Stable Diffusion",
          "Your task is to write a prompt for the product you just invented",
        ].join(". "),
      },
      { role: "user", content: `Invent a baby product for ${category}` },
    ],
    schema: z.object({
      prompt: z.string().describe("A prompt for Stable Diffusion XL"),
      name: z.string().describe("Name of the product"),
    }),
  });

  console.log(`generating image`);

  const imageFilename = `${slugify(product.object.name)}.png`;

  const imageURL = await generateImage(
    product.object.prompt,
    `./public/images/${filenamify(imageFilename)}`
  );

  console.log(`generating article`);

  const result = await generateText({
    model: anthropic("claude-3-sonnet-20240229"),
    messages: [
      {
        role: "system",
        content: [
          "You are an expert copywriter",
          "Your task is to write a product description page for a product",
          "Give the seperate topics a heading",
          "Respond directly in markdown. Do not wrap the markdown in a code block",
        ].join(". "),
      },
      {
        role: "user",
        content: [
          { type: "image", image: new URL(imageURL) },
          {
            type: "text",
            text: "Please write a text base on the image. Use all details of the images such as colors, sizes and shapes",
          },
        ],
      },
    ],
    temperature: 0.7,
  });

  const articleText = [
    "---",
    `title: ${product.object.name}`,
    "---",
    `![${product.object.name}](/images/${imageFilename})\n`,
    result.text,
  ].join("\n");

  const path = "src/content/docs/products";
  const filename = `${category}.md`;

  console.log("creating directory");
  await mkdir(path, { recursive: true });

  console.log("saving to disc");
  await writeFile(join(path, filename), articleText, { encoding: "utf-8" });

  console.log("done");
}
