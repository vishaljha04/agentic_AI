import { eq, ilike } from "drizzle-orm";
import { db } from "./db/index.js";
import { todosTable } from "./db/schema.js";
import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function getAllTodos() {
  const todos = await db.select().from(todosTable);
  return todos;
}

async function createTodo(todo) {
  const result = await db.insert(todosTable).values({ todo }).returning();
  return result;
}

async function searchTodo(query) {
  const todo = await db
    .select()
    .from(todosTable)
    .where(ilike(todosTable.todo, `%${query}%`));
  return todo;
}

async function deleteTodoById(id) {
  const result = await db
    .delete(todosTable)
    .where(eq(todosTable.id, id))
    .returning();
  return result;
}

const tools = {
  getAllTodos,
  createTodo,
  searchTodo,
  deleteTodoById,
};

const SYSTEM_PROMPT = `
You are an AI TODO list assistant with START PLAN ACTION Observation and Output state.
Wait for the user prompt and first plan with available tools.
After planning, Take a action with appropiate tools and wait for observation based on Action.
Once you get the observation,Return the AI Response based on START prompt and observation.

you can manage task by adding viewing updating and deleting them.
You must strictly follow the JSON output format.

TODO Db Schema :
id:Int and primary key,
todo :String,
created_At:Date Time,
updated_At:Date Time,

Available Tools: - 
-getAllTodos() : Return all the Todos from the database,
-createTodo(todo:string) : Create a new todo in Database take a todo as a string and return,
-deleteTodoById(id:string) : Delete todo from database by ID given in db (primary key)
-SearchTodo(query:string) : searches all todos in db and return the one which matches the given query using iLike() in dB

Example: - 
START 
{ "type": "user", "user": "Add a task for shopping groceries." }
{ "type": "plan", "plan": "I will try to get more context on what user needs to shop." }
{ "type": "output", "output": "Can you tell me what all items you want to shop for?" }
{ "type": "user", "user": "I want to shop for milk, kurkure, lays and choco." }
{ "type": "plan", "plan": "I will use createTodo to create a new Todo in DB." }
{ "type": "action", "function": "createTodo", "input": "Shopping for milk, kurkure, lays and choco." }
{ "type": "observation", "observation": "2" }
{ "type": "output", "output": "Your todo has been added successfully." }
`;

const messages = [
  {
    role: "user",
    parts: [{ text: SYSTEM_PROMPT }],
  },
];

while (true) {
  const query = readlineSync.question(">> ");

  messages.push({
    role: "user",
    parts: [{ text: query }],
  });

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
    });

    let text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) break;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let action;

    try {
      action = JSON.parse(text);
    } catch {
      break;
    }

    messages.push({
      role: "model",
      parts: [{ text }],
    });

    if (action.type === "output") {
      console.log("🤖:", action.output);
      break;
    }

    if (action.type === "action") {
      const fn = tools[action.function];
      if (!fn) throw new Error("Invalid tool: " + action.function);

      const observation = await fn(action.input);

      messages.push({
        role: "user",
        parts: [
          {
            text: JSON.stringify({
              type: "observation",
              observation,
            }),
          },
        ],
      });
    }
  }
}
