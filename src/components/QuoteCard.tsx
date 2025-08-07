import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Quote } from "@/hooks/useQuotes";

interface QuoteCardProps {
  quote: Quote;
  isAdmin?: boolean;
  onEdit?: (quote: Quote) => void;
  onDelete?: (id: string) => void;
}

export const QuoteCard = ({ quote, isAdmin, onEdit, onDelete }: QuoteCardProps) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-primary/50">
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