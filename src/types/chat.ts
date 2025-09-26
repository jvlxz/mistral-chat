export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatRequest {
  messages: Omit<Message, 'id' | 'timestamp'>[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MistralModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  description: string;
  category: string;
}
