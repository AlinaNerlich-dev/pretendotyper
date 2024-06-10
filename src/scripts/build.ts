import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { categories } from "./data";

for (const category of categories) {
  console.log(`generating an product for ${category}`);

  const result = await generateText({
    model: anthropic("claude-3-sonnet-20240229"),
    messages: [
      {
        role: "system",
        content: [
          "You are an expert for inventing baby products",
          "Your task is to invent new baby products",
          "The products should be futuristic and environmently friendly",
          "Respond directly in markdown. Do not wrap the markdown in a code block",
          "Add a field called title in the frontmatter section of the markdown file",
          "Add the name of the product to the title field",
        ].join(". "),
      },
      { role: "user", content: `Invent a baby product for ${category}` },
    ],
    temperature: 0.7,
  });

  const path = "src/content/docs/products";
  const filename = `${category}.md`;

  console.log("creating directory");
  await mkdir(path, { recursive: true });

  console.log("saving to disc");
  await writeFile(join(path, filename), result.text, { encoding: "utf-8" });

  console.log("done");
}
