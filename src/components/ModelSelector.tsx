'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MistralModel } from '@/types/chat';
import { Bot, Zap, Code, Cpu } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [models, setModels] = useState<MistralModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/models');

      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      const data = await response.json();
      setModels(data.models);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models');
      // Fallback to default models if API fails
      setModels([
        {
          id: 'mistral-large-latest',
          object: 'model',
          created: 0,
          owned_by: 'mistral',
          description: 'Most capable model for complex tasks',
          category: 'Large Models'
        },
        {
          id: 'mistral-medium-latest',
          object: 'model',
          created: 0,
          owned_by: 'mistral',
          description: 'Balanced performance and efficiency',
          category: 'Medium Models'
        },
        {
          id: 'mistral-small-latest',
          object: 'model',
          created: 0,
          owned_by: 'mistral',
          description: 'Fast and efficient for simple tasks',
          category: 'Small Models'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Large Models':
        return <Cpu className="h-3 w-3" />;
      case 'Code Models':
        return <Code className="h-3 w-3" />;
      case 'Lightweight Models':
        return <Zap className="h-3 w-3" />;
      default:
        return <Bot className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Large Models':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Code Models':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Lightweight Models':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const selectedModelInfo = models.find(m => m.id === selectedModel);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        AI Model
      </label>

      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a model">
            {selectedModelInfo && (
              <div className="flex items-center gap-2">
                {getCategoryIcon(selectedModelInfo.category)}
                <span className="truncate">{selectedModelInfo.id}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="max-h-80">
          {/* Group models by category */}
          {Array.from(new Set(models.map(m => m.category))).map(category => {
            // Get unique models for this category
            const categoryModels = models
              .filter(model => model.category === category)
              .filter((model, index, arr) =>
                // Remove duplicates by keeping only the first occurrence of each id
                arr.findIndex(m => m.id === model.id) === index
              );

            return (
              <div key={category}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {category}
                </div>
                {categoryModels.map((model, index) => (
                  <SelectItem
                    key={`${model.id}-${index}`}
                    value={model.id}
                  >
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {getCategoryIcon(model.category)}
                        <div className="min-w-0">
                          <div className="font-medium truncate">{model.id}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {model.description}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs shrink-0 ${getCategoryColor(model.category)}`}
                      >
                        {model.category.split(' ')[0]}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </div>
            );
          })}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-xs text-destructive">
          {error} (Using fallback models)
        </p>
      )}

      {selectedModelInfo && (
        <p className="text-xs text-muted-foreground">
          {selectedModelInfo.description}
        </p>
      )}
    </div>
  );
}
