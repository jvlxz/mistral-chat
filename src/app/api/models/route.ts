import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Mistral API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.mistral.ai/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Mistral API error:', response.status, errorData);

      return NextResponse.json(
        { error: `Failed to fetch models: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Define interfaces for type safety
    interface RawModel {
      id: string;
      object: string;
      created: number;
      owned_by: string;
    }

    interface ProcessedModel {
      id: string;
      object: string;
      created: number;
      owned_by: string;
      description: string;
      category: string;
    }

    // Filter, deduplicate and sort models for better UX
    const uniqueModels = new Map<string, ProcessedModel>();

    (data.data as RawModel[])
      .filter((model) => model.id && !model.id.includes('embed'))
      .forEach((model) => {
        // Use model.id as key to automatically deduplicate
        if (!uniqueModels.has(model.id)) {
          uniqueModels.set(model.id, {
            id: model.id,
            object: model.object,
            created: model.created,
            owned_by: model.owned_by,
            description: getModelDescription(model.id),
            category: getModelCategory(model.id),
          });
        }
      });

    const models = Array.from(uniqueModels.values())
      .sort((a, b) => {
        // Sort by category, then by name
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.id.localeCompare(b.id);
      });

    return NextResponse.json({ models });

  } catch (error) {
    console.error('Models API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getModelDescription(modelId: string): string {
  const descriptions: Record<string, string> = {
    'mistral-large-latest': 'Most capable model for complex tasks',
    'mistral-large-2407': 'Large model with enhanced capabilities',
    'mistral-medium-latest': 'Balanced performance and efficiency',
    'mistral-small-latest': 'Fast and efficient for simple tasks',
    'codestral-latest': 'Specialized for code generation and analysis',
    'mistral-nemo': 'Lightweight model for basic tasks',
    'voxtral-mini-2507': 'Compact multimodal model with voice capabilities',
    'pixtral-large-latest': 'Large multimodal model for vision tasks',
    'pixtral-12b-2409': 'Efficient vision model for image analysis',
  };

  return descriptions[modelId] || 'Mistral AI language model';
}

function getModelCategory(modelId: string): string {
  if (modelId.includes('large')) return 'Large Models';
  if (modelId.includes('medium')) return 'Medium Models';
  if (modelId.includes('small')) return 'Small Models';
  if (modelId.includes('codestral') || modelId.includes('code')) return 'Code Models';
  if (modelId.includes('nemo') || modelId.includes('mini')) return 'Lightweight Models';
  if (modelId.includes('pixtral') || modelId.includes('voxtral')) return 'Multimodal Models';
  return 'Other Models';
}
