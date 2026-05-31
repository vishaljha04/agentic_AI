import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";

configDotenv();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function getWeatherDetail(city = "") {
  if (city.toLowerCase() === "patiala") return "10°C";
  if (city.toLowerCase() === "chandigarh") return "30°C";
  if (city.toLowerCase() === "delhi") return "45°C";
  if (city.toLowerCase() === "bangalore") return "34°C";
  if (city.toLowerCase() === "pune") return "15°C";

  return "Weather data not found";
}

const user = "Hey, What is the weather of Patiala";

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: user,
  });

  console.log(response.text);
}

main();