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

## API Integration

The application uses the [Mistral AI Chat Completion API](https://docs.mistral.ai/api/) with the following configuration:

- **Default Model**: `mistral-large-latest`
- **Temperature**: `0.7` (configurable)
- **Max Tokens**: `1000` (configurable)
- **Streaming**: Currently disabled (can be enabled for real-time responses)

## Customization

### Changing the AI Model

You can modify the default model in `src/app/api/chat/route.ts`:

```typescript
const { messages, model = 'mistral-medium', temperature = 0.7, max_tokens = 1000 }
```

### Styling

The application uses Tailwind CSS with Shadcn UI. You can customize:

- Colors in `src/app/globals.css`
- Component styles in individual component files
- Theme configuration in `tailwind.config.ts`

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your `MISTRAL_API_KEY` environment variable in Vercel's dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Node.js:

- Railway
- Render
- Heroku
- AWS
- Google Cloud

Make sure to set the `MISTRAL_API_KEY` environment variable in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues:

1. Check that your Mistral API key is correctly set
2. Ensure you have sufficient API credits
3. Verify your network connection
4. Check the browser console for error messages

For Mistral AI API specific issues, refer to the [official documentation](https://docs.mistral.ai/api/).