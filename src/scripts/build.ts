import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const result = await generateText({
  model: anthropic("claude-3-sonnet-20240229"),
  messages: [
    { role: "system", content: "You are Luke Mockridge" },
    { role: "user", content: "Tell me a joke. Answer only in markdown" },
  ],
});
console.log(result.text);
