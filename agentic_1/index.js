import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
import readlineSync from "readline-sync";

configDotenv();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


function getWeatherDetail(city = "") {
  if (city.toLowerCase() === "patiala") return "10°C";
  if (city.toLowerCase() === "delhi") return "45°C";
  if (city.toLowerCase() === "pune") return "15°C";
  if (city.toLowerCase() === "bangalore") return "34°C";

  return "Weather data not found";
}


const SYSTEM_PROMPT = `
You are an AI assistant.

You have these states:
- plan
- action
- output

Available Tool:
getWeatherDetail(city)

Rules:
- Always respond in valid JSON only
- Do not use markdown
- One step at a time

Examples:

{"type":"plan","plan":"I will get weather"}

{"type":"action","function":"getWeatherDetail","input":"pune"}

{"type":"output","output":"Weather is 15°C"}
`;


const messages = [
  {
    role: "user",
    parts: [{ text: SYSTEM_PROMPT }],
  },
];


async function main() {
  while (true) {
    const query = readlineSync.question("\n>> ");

    if (query.toLowerCase() === "exit") {
      break;
    }

    messages.push({
      role: "user",
      parts: [{ text: query }],
    });

    while (true) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: messages,
        });


        let text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          console.log("No response from AI");
          break;
        }

        text = text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        console.log("\nAI:", text);

        let data;

        try {
          data = JSON.parse(text);
        } catch (err) {
          console.log("Invalid JSON");
          break;
        }


        messages.push({
          role: "model",
          parts: [{ text }],
        });

        // ===== PLAN =====

        if (data.type === "plan") {
          continue;
        }


        if (data.type === "action") {
          let result = "";

          if (data.function === "getWeatherDetail") {
            result = getWeatherDetail(data.input);
          }

          console.log("\nOBSERVATION:", result);

          messages.push({
            role: "user",
            parts: [
              {
                text: JSON.stringify({
                  type: "observation",
                  observation: result,
                }),
              },
            ],
          });

          continue;
        }

        if (data.type === "output") {
          console.log("\nFINAL ANSWER:", data.output);
          break;
        }
      } catch (error) {
        console.log("\nERROR:", error.message);
        break;
      }
    }
  }
}

main();