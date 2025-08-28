import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Quote } from "@/hooks/useQuotes";
import { useState } from "react";

interface QuoteCardProps {
  quote: Quote;
  isAdmin?: boolean;
  onEdit?: (quote: Quote) => void;
  onDelete?: (id: string) => void;
}

const EMOJIS = [
  { emoji: "❤️", label: "love" },
  { emoji: "😂", label: "funny" },
  { emoji: "🔥", label: "inspiring" },
  { emoji: "👏", label: "applause" },
];

export const QuoteCard = ({ quote, isAdmin, onEdit, onDelete }: QuoteCardProps) => {
  const [reactions, setReactions] = useState<{ [key: string]: number }>({});
  const [animating, setAnimating] = useState<{ [key: string]: boolean }>({});

  const handleReact = (label: string) => {
    setReactions((prev) => ({ ...prev, [label]: (prev[label] || 0) + 1 }));
    setAnimating((prev) => ({ ...prev, [label]: true }));
    setTimeout(() => setAnimating((prev) => ({ ...prev, [label]: false })), 700);
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border-l-4 border-l-primary/50 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            {quote.categories && (
              <Badge variant="secondary" className="mb-2">
                {quote.categories.name}
              </Badge>
            )}
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit?.(quote)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete?.(quote.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <blockquote className="text-lg font-medium leading-relaxed mb-4 text-foreground/90">
          "{quote.quote}"
        </blockquote>
        {/* Emoji Reaction Bar */}
        <div className="flex gap-3 mb-2 justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          {EMOJIS.map(({ emoji, label }) => (
            <button
              key={label}
              className={`emoji-btn relative text-xl transition-transform duration-200 hover:scale-125 focus:outline-none ${animating[label] ? 'animate-float-heart' : ''}`}
              onClick={() => handleReact(label)}
              aria-label={label}
            >
              {emoji}
              {reactions[label] ? (
                <span className="absolute -top-2 -right-2 bg-primary text-xs text-white rounded-full px-1.5 py-0.5 animate-bounce">
                  {reactions[label]}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        <footer className="flex flex-col gap-2">
          <cite className="text-sm font-semibold text-primary">
            — {quote.author}
          </cite>
          {quote.description && (
            <p className="text-sm text-muted-foreground">
              {quote.description}
            </p>
          )}
          <time className="text-xs text-muted-foreground">
            {new Date(quote.created_at).toLocaleDateString()}
          </time>
        </footer>
      </CardContent>
    </Card>
  );
};