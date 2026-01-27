import { useState } from "react";
import { History, Download, ChevronDown, ChevronUp, Calendar, BookMarked } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avaliacao, gerarArquivoReforco } from "@/lib/api";

interface HistoricoProps {
  avaliacoes: Avaliacao[];
}

const getNivelInfo = (nivel: number) => {
  const niveis = {
    1: { label: "Muito difícil", className: "bg-red-500 hover:bg-red-600" },
    2: { label: "Difícil", className: "bg-orange-500 hover:bg-orange-600" },
    3: { label: "Médio", className: "bg-yellow-500 hover:bg-yellow-600 text-foreground" },
    4: { label: "Fácil", className: "bg-green-400 hover:bg-green-500" },
    5: { label: "Muito fácil", className: "bg-green-600 hover:bg-green-700" },
  };
  return niveis[nivel as keyof typeof niveis] || niveis[3];
};

function AvaliacaoItem({ avaliacao }: { avaliacao: Avaliacao }) {
  const [isOpen, setIsOpen] = useState(false);
  const nivelInfo = getNivelInfo(avaliacao.nivel);
  const data = new Date(avaliacao.created_at);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookMarked className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium text-foreground">{avaliacao.modulo}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {data.toLocaleDateString("pt-BR")} às {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={nivelInfo.className}>
                  {avaliacao.nivel}/5
                </Badge>
                {avaliacao.reforco && (
                  <Badge variant="outline" className="border-secondary text-secondary">
                    Com reforço
                  </Badge>
                )}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4 space-y-3">
          {avaliacao.relato && (
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-sm font-medium text-muted-foreground mb-1">Relato:</p>
              <p className="text-sm text-foreground">{avaliacao.relato}</p>
            </div>
          )}

          {avaliacao.reforco && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => gerarArquivoReforco(avaliacao)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Reforço (.txt)
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function Historico({ avaliacoes }: HistoricoProps) {
  if (avaliacoes.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma avaliação registrada ainda.</p>
            <p className="text-sm">Faça sua primeira avaliação para começar!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Avaliações
          <Badge variant="secondary" className="ml-2">
            {avaliacoes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {avaliacoes.map((avaliacao) => (
            <AvaliacaoItem key={avaliacao.id} avaliacao={avaliacao} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
