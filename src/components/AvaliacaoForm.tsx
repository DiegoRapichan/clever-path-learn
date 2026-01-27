import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { enviarAvaliacao, NovaAvaliacao } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AvaliacaoFormProps {
  usuarioId: string;
  onAvaliacaoEnviada: (reforco: string | null) => void;
}

const MODULOS = [
  "Matemática Básica",
  "Português e Redação",
  "Ciências da Natureza",
  "História do Brasil",
  "Geografia",
  "Física",
  "Química",
  "Biologia",
  "Inglês",
  "Outro",
];

const NIVEIS = [
  { value: 1, label: "1 - Muito difícil", color: "bg-red-500" },
  { value: 2, label: "2 - Difícil", color: "bg-orange-500" },
  { value: 3, label: "3 - Médio", color: "bg-yellow-500" },
  { value: 4, label: "4 - Fácil", color: "bg-green-400" },
  { value: 5, label: "5 - Muito fácil", color: "bg-green-600" },
];

export function AvaliacaoForm({ usuarioId, onAvaliacaoEnviada }: AvaliacaoFormProps) {
  const [modulo, setModulo] = useState("");
  const [moduloCustom, setModuloCustom] = useState("");
  const [nivel, setNivel] = useState<number>(3);
  const [relato, setRelato] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const moduloFinal = modulo === "Outro" ? moduloCustom : modulo;

    if (!moduloFinal.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione ou informe o módulo.",
        variant: "destructive",
      });
      return;
    }

    if (!relato.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva sua experiência ou dificuldade.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const avaliacao: NovaAvaliacao = {
        usuario_id: usuarioId,
        modulo: moduloFinal,
        nivel,
        relato: relato.trim(),
      };

      const resultado = await enviarAvaliacao(avaliacao);

      if (resultado.success) {
        toast({
          title: "Avaliação enviada!",
          description: resultado.message,
        });
        onAvaliacaoEnviada(resultado.reforco || null);
        // Limpar formulário
        setModulo("");
        setModuloCustom("");
        setNivel(3);
        setRelato("");
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
        description: "Ocorreu um erro ao enviar a avaliação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          📝 Nova Avaliação
        </CardTitle>
        <CardDescription>
          Avalie seu nível de compreensão e descreva suas dificuldades para receber um reforço personalizado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Módulo */}
          <div className="space-y-2">
            <Label htmlFor="modulo">Módulo / Matéria</Label>
            <Select value={modulo} onValueChange={setModulo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o módulo" />
              </SelectTrigger>
              <SelectContent>
                {MODULOS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {modulo === "Outro" && (
              <Input
                placeholder="Digite o nome do módulo"
                value={moduloCustom}
                onChange={(e) => setModuloCustom(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Nível */}
          <div className="space-y-3">
            <Label>Nível de Compreensão</Label>
            <div className="flex flex-wrap gap-2">
              {NIVEIS.map((n) => (
                <button
                  key={n.value}
                  type="button"
                  onClick={() => setNivel(n.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    nivel === n.value
                      ? `${n.color} text-white shadow-md scale-105`
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
            {nivel <= 2 && (
              <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                💡 Como você indicou dificuldade, vamos gerar um material de reforço personalizado para você!
              </p>
            )}
          </div>

          {/* Relato */}
          <div className="space-y-2">
            <Label htmlFor="relato">Descreva sua experiência ou dificuldade</Label>
            <Textarea
              id="relato"
              placeholder="Ex: Estou tendo dificuldade em entender equações do segundo grau. Não consigo aplicar a fórmula de Bhaskara..."
              value={relato}
              onChange={(e) => setRelato(e.target.value)}
              rows={4}
              className="resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {relato.length}/1000 caracteres
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-hero shadow-primary hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando reforço com IA...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Avaliação
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
