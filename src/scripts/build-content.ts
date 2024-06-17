import { confirm, input } from "@inquirer/prompts";
import { mkdir, readdir } from "fs/promises";
import { generateProduct } from "./product";

await mkdir("./public/images", { recursive: true });
await mkdir("./public/audio", { recursive: true });

const existingCategories = (await readdir("./src/content/docs/products")).map(
  (filename) => filename.slice(0, -3)
);

do {
  const category = await input({
    message: "What product category you want to generate for",
    transformer: (value) => value.toLowerCase().trim(),
    validate: (value) =>
      existingCategories.includes(value)
        ? " Category already exists. Choose another one"
        : true,
  });
  await generateProduct(category);
  existingCategories.push(category);
} while (
  (await confirm({
    message: "Do you want to generate one more product?",
  })) &&
  existingCategories.length <= 20
);
