# Quick Setup Guide

## 🚀 Getting Your Mistral Chat App Running

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Your API Key

Create a file named `.env.local` in the root directory and add:

```
MISTRAL_API_KEY=your_actual_api_key_here
```

**Get your API key:**
1. Go to [https://console.mistral.ai/](https://console.mistral.ai/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy and paste it in your `.env.local` file

### Step 3: Run the App
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and start chatting!

## ⚠️ Important Notes

- Keep your API key private and never commit it to version control
- The `.env.local` file is already in `.gitignore` to prevent accidental commits
- You need a valid Mistral AI account with available credits

## 🛠️ Troubleshooting

**"Mistral API key not configured" error?**
- Make sure your `.env.local` file exists
- Check that `MISTRAL_API_KEY=` has your actual key after the equals sign
- Restart the development server after adding the key

**API errors?**
- Verify your API key is valid
- Check your Mistral AI account has available credits
- Ensure you have internet connectivity
