import { useState, useEffect } from "react";
import { Loader2, User } from "lucide-react";
import { Header } from "@/components/Header";
import { AvaliacaoForm } from "@/components/AvaliacaoForm";
import { ReforcoDisplay } from "@/components/ReforcoDisplay";
import { Historico } from "@/components/Historico";
import { GraficoEvolucao } from "@/components/GraficoEvolucao";
import { buscarUsuarioDemo, buscarHistorico, Avaliacao, Usuario } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [reforcoAtual, setReforcoAtual] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário e histórico inicial
  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        const usuarioDemo = await buscarUsuarioDemo();
        if (usuarioDemo) {
          setUsuario(usuarioDemo);
          const historico = await buscarHistorico(usuarioDemo.id);
          setAvaliacoes(historico);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Callback quando uma avaliação é enviada
  const handleAvaliacaoEnviada = async (reforco: string | null) => {
    setReforcoAtual(reforco);
    
    // Recarregar histórico
    if (usuario) {
      const historico = await buscarHistorico(usuario.id);
      setAvaliacoes(historico);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando Apoio Inteligente...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-destructive text-lg">Erro ao carregar usuário demo.</p>
          <p className="text-muted-foreground mt-2">Por favor, recarregue a página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Barra do usuário */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Logado como:</span>
          <Badge variant="secondary" className="font-medium">
            {usuario.nome}
          </Badge>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Coluna esquerda - Formulário e Reforço */}
          <div className="space-y-6">
            <AvaliacaoForm
              usuarioId={usuario.id}
              onAvaliacaoEnviada={handleAvaliacaoEnviada}
            />

            {reforcoAtual && <ReforcoDisplay reforco={reforcoAtual} />}
          </div>

          {/* Coluna direita - Histórico e Gráfico */}
          <div className="space-y-6">
            <GraficoEvolucao avaliacoes={avaliacoes} />
            <Historico avaliacoes={avaliacoes} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Apoio Inteligente © 2026 - Sistema de Reforço de Aprendizado com IA</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
