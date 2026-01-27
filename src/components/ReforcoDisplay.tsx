import { BookOpen, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ReforcoDisplayProps {
  reforco: string;
}

export function ReforcoDisplay({ reforco }: ReforcoDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reforco);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "O conteúdo foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o conteúdo.",
        variant: "destructive",
      });
    }
  };

  // Renderizar markdown básico
  const renderMarkdown = (text: string) => {
    // Dividir em linhas e processar
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-1 my-2">
            {listItems.map((item, i) => (
              <li key={i} className="text-foreground/90">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Headers
      if (trimmed.startsWith("###")) {
        flushList();
        elements.push(
          <h4 key={index} className="text-md font-semibold text-foreground mt-4 mb-2">
            {trimmed.replace(/^###\s*/, "")}
          </h4>
        );
      } else if (trimmed.startsWith("##")) {
        flushList();
        elements.push(
          <h3 key={index} className="text-lg font-semibold text-foreground mt-4 mb-2">
            {trimmed.replace(/^##\s*/, "")}
          </h3>
        );
      } else if (trimmed.startsWith("#")) {
        flushList();
        elements.push(
          <h2 key={index} className="text-xl font-bold text-foreground mt-4 mb-2">
            {trimmed.replace(/^#\s*/, "")}
          </h2>
        );
      }
      // Bold text (standalone line)
      else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        flushList();
        elements.push(
          <p key={index} className="font-semibold text-foreground mt-3 mb-1">
            {trimmed.replace(/^\*\*|\*\*$/g, "")}
          </p>
        );
      }
      // List items
      else if (trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed)) {
        inList = true;
        const item = trimmed.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
        listItems.push(item);
      }
      // Regular paragraph
      else if (trimmed) {
        flushList();
        elements.push(
          <p key={index} className="text-foreground/90 leading-relaxed my-2">
            {trimmed}
          </p>
        );
      }
      // Empty line
      else {
        flushList();
      }
    });

    flushList();
    return elements;
  };

  return (
    <Card className="glass-card border-secondary/30 animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2 text-secondary">
            <BookOpen className="h-5 w-5" />
            Material de Reforço Gerado
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-lg p-4 max-h-[500px] overflow-y-auto">
          {renderMarkdown(reforco)}
        </div>
      </CardContent>
    </Card>
  );
}
