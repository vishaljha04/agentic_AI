# 🌦️ Mock AI Weather Agent

A simple **Agentic AI Weather Assistant** built using **Node.js** and **Google Gemini AI**.

This project demonstrates how modern AI agents work internally using:

* Planning
* Tool Calling
* Observation Handling
* Multi-step Reasoning
* AI Agent Loops

---

# 🚀 Features

* Interactive CLI Chat
* AI Planning System
* Tool Calling Architecture
* Observation Based Reasoning
* JSON Based AI Responses
* Gemini 2.5 Flash Integration
* Beginner Friendly Agentic AI Project

---

# 🧠 Agent Workflow

The AI follows this architecture:

```txt
User Query
   ↓
PLAN
   ↓
ACTION
   ↓
OBSERVATION
   ↓
OUTPUT
```

Example:

```json
{"type":"plan","plan":"I will get weather data"}

{"type":"action","function":"getWeatherDetail","input":"delhi"}

{"type":"observation","observation":"45°C"}

{"type":"output","output":"Weather of delhi is 45°C"}
```

---

# 🛠️ Tech Stack

* Node.js
* Google Gemini AI
* dotenv
* readline-sync

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/mock-ai-weather-agent.git
```

Move into the project:

```bash
cd mock-ai-weather-agent
```

Install dependencies:

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory.

```env
GEMINI_API_KEY=your_api_key_here
```

Get your API key from:

https://aistudio.google.com/app/apikey

---

# ▶️ Run The Project

```bash
npm start
```

---

# 💬 Example Usage

```bash
>> what is the weather of delhi
```

Output:

```txt
AI: {"type":"plan","plan":"I will get weather"}

AI: {"type":"action","function":"getWeatherDetail","input":"delhi"}

OBSERVATION: 45°C

AI: {"type":"output","output":"Weather of delhi is 45°C"}

FINAL ANSWER: Weather of delhi is 45°C
```

---

# 📁 Project Structure

```txt
📦 mock-ai-weather-agent
 ┣ 📜 index.js
 ┣ 📜 package.json
 ┣ 📜 .env
 ┗ 📜 README.md
```

---

# ⚡ How It Works

The AI does not directly execute JavaScript functions.

Instead:

1. Gemini generates an ACTION.
2. Node.js reads the action.
3. The correct tool/function gets executed.
4. Observation is sent back to Gemini.
5. Gemini generates the final OUTPUT.

This is the same core idea used in:

* OpenAI Agents
* LangChain
* Cursor AI
* Claude Tool Use
* AI Autonomous Systems

---

# 🧩 Current Tool

```js
getWeatherDetail(city)
```

Returns mock temperature data.

Supported Cities:

* Delhi
* Patiala
* Pune
* Bangalore
* Chandigarh

---

# 🔥 Future Improvements

* Real Weather API Integration
* Multiple Tool Support
* Memory System
* Autonomous Agents
* Function Calling APIs
* LangChain Integration
* Web Search Tool
* Voice Assistant Support

---

# 🐞 Common Errors

## Invalid JSON

Sometimes Gemini returns markdown JSON:

````txt
```json
{
}
```
````

The project automatically cleans it before parsing.

---

## Undefined Response

Handled safely using:

```js
response?.candidates?.[0]?.content?.parts?.[0]?.text
```

---

# 📚 Learning Goals

This project is perfect for understanding:

* AI Agents
* ReAct Pattern
* Tool Calling
* LLM Workflows
* Prompt Engineering
* Multi-step Reasoning
* AI Orchestration

---

# 👨‍💻 Author
VISHAL JHA

Built with ❤️ using Gemini AI and Node.js.
