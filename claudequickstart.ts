import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const msg = await anthropic.messages.create({
  model: "claude-opus-4-20250514",
  max_tokens: 1000,
  temperature: 1,
  system: "Respond only with short poems.",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Why is the ocean salty?"
        }
      ]
    }
  ]
});
console.log(msg);