import { eq, ilike } from "drizzle-orm";
import { db } from "./db/index.js";
import { todosTable } from "./db/schema.js";
import readlineSync from "readline-sync";
import "dotenv/config";

async function ollamaChat(messages) {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "codellama",
      messages,
      stream: false,
      temperature: 0,
    }),
  });

  const data = await res.json();
  return data.message.content;
}

// ---------------- DB TOOLS ----------------

async function getAllTodos() {
  return await db.select().from(todosTable);
}

async function createTodo(todo) {
  return await db.insert(todosTable).values({ todo }).returning();
}

async function searchTodo(query) {
  return await db
    .select()
    .from(todosTable)
    .where(ilike(todosTable.todo, `%${query}%`));
}

async function deleteTodoById(id) {
  return await db
    .delete(todosTable)
    .where(eq(todosTable.id, id))
    .returning();
}

const tools = {
  getAllTodos,
  createTodo,
  searchTodo,
  deleteTodoById,
};

// ---------------- SYSTEM PROMPT ----------------

const SYSTEM_PROMPT = `
You are a strict AI agent.

You MUST ALWAYS respond ONLY in valid JSON.

Allowed formats:

{ "type": "plan", "plan": "..." }
{ "type": "action", "function": "functionName", "input": "..." }
{ "type": "output", "output": "..." }

RULES:
- ONLY JSON output
- NO explanation
- NO markdown
- NO text outside JSON
- If wrong, retry with correct JSON

TOOLS:
getAllTodos
createTodo
searchTodo
deleteTodoById

FLOW:
user → plan → action → observation → output
`;


const messages = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
];


function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}


while (true) {
  const query = readlineSync.question(">> ");

  messages.push({
    role: "user",
    content: query,
  });

  while (true) {
    const text = await ollamaChat(messages);

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const action = safeParse(cleanText);

    if (!action) {
      console.log("Invalid model response:\n", text);
      break;
    }

    messages.push({
      role: "assistant",
      content: cleanText,
    });

    if (action.type === "output") {
      console.log("🤖:", action.output);
      break;
    }

    if (action.type === "action") {
      const fn = tools[action.function];

      if (!fn) {
        throw new Error("Invalid tool: " + action.function);
      }

      const observation = await fn(action.input);

      messages.push({
        role: "user",
        content: JSON.stringify({
          type: "observation",
          observation,
        }),
      });
    }
  }
}