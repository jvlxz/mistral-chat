# Mistral AI Chat Application

A modern chat application built with Next.js 15, TypeScript, and Shadcn UI that integrates with the Mistral AI API.

## Features

- 🤖 **Mistral AI Integration**: Powered by Mistral's latest language models
- 🔄 **Model Selection**: Choose from different Mistral models (Large, Medium, Small, Code models)
- 📚 **Chat History**: Persistent chat sessions with local storage
- 💬 **Multiple Sessions**: Create and manage multiple conversation threads
- 🎨 **Modern UI**: Beautiful interface built with Shadcn UI components
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🗂️ **Smart Organization**: Conversations grouped by date (Today, Yesterday, This Week, Older)
- ⚡ **Fast Performance**: Built with Next.js 15 and React 18
- 🔧 **TypeScript**: Fully typed for better developer experience
- 💾 **Local Storage**: Your conversations are saved locally and persist between sessions

## Prerequisites

- Node.js 18+
- npm or yarn
- A Mistral AI API key ([Get one here](https://console.mistral.ai/))

## Getting Started

### 1. Clone and Install

```bash
cd mistral-chat
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Mistral AI API Configuration
MISTRAL_API_KEY=your_mistral_api_key_here
```

To get your Mistral API key:
1. Visit [Mistral AI Console](https://console.mistral.ai/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env.local` file

### 3. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the chat interface.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Mistral AI chat completion API
│   │   └── models/route.ts    # Fetch available Mistral models
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page component
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── ChatInterface.tsx      # Main chat interface with sidebar
│   ├── ChatMessage.tsx        # Individual message component
│   ├── ChatInput.tsx          # Message input component
│   ├── ChatHistory.tsx        # Chat sessions sidebar
│   └── ModelSelector.tsx      # AI model selection dropdown
├── hooks/
│   ├── useChat.ts             # Basic chat state management
│   └── useChatSessions.ts     # Advanced multi-session management
├── types/
│   └── chat.ts                # TypeScript type definitions
└── lib/
    └── utils.ts               # Utility functions
```

## How to Use

### Model Selection
- Choose from different Mistral AI models in the sidebar
- Models are categorized by capability: Large, Medium, Small, Code models
- Each model has different strengths and pricing

### Chat History
- All conversations are automatically saved to local storage
- Access previous conversations from the sidebar
- Conversations are organized by date: Today, Yesterday, This Week, Older
- Click on any conversation to resume where you left off

### Managing Sessions
- Create new chat sessions with the "New Chat" button
- Each session maintains its own conversation history and selected model
- Delete individual sessions or clear all conversations
- Session titles are automatically generated from the first message
