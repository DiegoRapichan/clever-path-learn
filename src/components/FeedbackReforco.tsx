import { useState } from "react";
import { ThumbsUp, Send, Loader2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { enviarAvaliacao, NovaAvaliacao } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface FeedbackReforcoProps {
  usuarioId: string;
  modulo: string;
  onFeedbackEnviado: () => void;
}

const NIVEIS_FEEDBACK = [
  { value: 1, label: "Ainda não entendi", emoji: "😔", color: "bg-red-500" },
  { value: 2, label: "Entendi um pouco", emoji: "🤔", color: "bg-orange-500" },
  { value: 3, label: "Entendi parcialmente", emoji: "😐", color: "bg-yellow-500" },
  { value: 4, label: "Entendi bem", emoji: "😊", color: "bg-green-400" },
  { value: 5, label: "Entendi completamente!", emoji: "🎉", color: "bg-green-600" },
];

export function FeedbackReforco({ usuarioId, modulo, onFeedbackEnviado }: FeedbackReforcoProps) {
  const [nivel, setNivel] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (nivel === null) {
      toast({
        title: "Selecione uma opção",
        description: "Por favor, indique o quanto você entendeu após estudar o material.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const avaliacao: NovaAvaliacao = {
        usuario_id: usuarioId,
        modulo: modulo,
        nivel: nivel,
        relato: comentario.trim() || `Feedback pós-reforço: ${NIVEIS_FEEDBACK.find(n => n.value === nivel)?.label}`,
      };

      const resultado = await enviarAvaliacao(avaliacao);

      if (resultado.success) {
        setEnviado(true);
        toast({
          title: "Feedback enviado! 🎉",
          description: nivel >= 4 
            ? "Que ótimo que você aprendeu! Continue assim!" 
            : "Obrigado pelo feedback! Vamos continuar te ajudando.",
        });
        onFeedbackEnviado();
      } else {
        toast({
          title: "Erro",
          description: resultado.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o feedback.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (enviado) {
    return (
      <Card className="glass-card border-green-500/30 animate-slide-up">
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Feedback registrado!
            </h3>
            <p className="text-muted-foreground">
              Seu progresso foi atualizado no gráfico de evolução.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-primary/30 animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Como foi o estudo?
        </CardTitle>
        <CardDescription>
          Após estudar o material de reforço, o quanto você conseguiu entender sobre <strong>{modulo}</strong>?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Níveis de feedback */}
        <div className="space-y-2">
          <Label>Selecione seu nível de compreensão agora:</Label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {NIVEIS_FEEDBACK.map((n) => (
              <button
                key={n.value}
                type="button"
                onClick={() => setNivel(n.value)}
                className={`p-3 rounded-lg text-center transition-all border-2 ${
                  nivel === n.value
                    ? `${n.color} text-white border-transparent shadow-lg scale-105`
                    : "bg-muted hover:bg-muted/80 border-transparent hover:border-primary/30"
                }`}
              >
                <span className="text-2xl block mb-1">{n.emoji}</span>
                <span className="text-xs font-medium">{n.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comentário opcional */}
        <div className="space-y-2">
          <Label htmlFor="comentario">Comentário (opcional)</Label>
          <Textarea
            id="comentario"
            placeholder="Conte-nos mais sobre sua experiência de aprendizado..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={2}
            className="resize-none"
            maxLength={500}
          />
        </div>

        {/* Botão de enviar */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading || nivel === null}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar Feedback
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
