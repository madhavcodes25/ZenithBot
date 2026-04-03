# 🤖 Discord Multi-Purpose RPG Bot

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

A feature-rich, modular Discord bot built with **Discord.js (v14)** and **Node.js**. This project features a fully persistent database-driven RPG economy, asynchronous REST API integrations, native AI capabilities, and server moderation tools. 

## ✨ Key Features

### 💰 Persistent Economy & RPG System
Powered by **MongoDB/Mongoose**, users can earn, trade, and gamble virtual currency.
* **Core Economy:** `/balance`, `/daily`, `/work`, `/pay`
* **Gambling:** `/gamble`, `/slotmachine`
* **Item System:** `/shop`, `/buy`, `/inventory`
* **Interactive Items:** `/fish` 

### 🧠 External API & AI Integrations
* **`/askai`**: Integrated with Google's Gemini API for dynamic, conversational responses.
* **`/pokedex`**: Fetches and parses live data from the official PokéAPI.
* **`/jail`**: Utilizes Canvas/Image manipulation APIs and Discord's `AttachmentBuilder` to dynamically generate and attach edited images of user avatars.

### 🛡️ Moderation & Utility
* **Moderation:** `/kick`, `/ban`
* **System Metrics:** `/botinfo`, `/ping` 
* **User Data:** `/userinfo`
* **Dynamic Help:** `/help`

## 🛠️ Tech Stack & Architecture

* **Language:** JavaScript (Node.js)
* **Library:** Discord.js v14 (Slash Commands, EmbedBuilders, DeferReply handling)
* **Database:** MongoDB Atlas & Mongoose ORM
* **Architecture:** Modular Command Handler (Dynamically reads, validates, and registers `.js` files to the Discord API to prevent crashes).

---

## 🚀 Local Installation & Setup

Want to run this bot yourself? Follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/madhavcodes25/ZenithBot.git
cd ZenithBot
``` 

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a .env file in the root directory and add the following keys:

```Code snippet
BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_application_id
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Register Commands & Start
First, push the slash commands to the Discord API, then start the bot:

```Bash
node build.js
node index.js
```