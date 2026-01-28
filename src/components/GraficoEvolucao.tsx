import { TrendingUp, TrendingDown, Minus, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Avaliacao } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface GraficoEvolucaoProps {
  avaliacoes: Avaliacao[];
}

interface ProgressoModulo {
  modulo: string;
  avaliacaoInicial: number;
  avaliacaoFinal: number;
  melhoria: number;
  totalAvaliacoes: number;
}

export function GraficoEvolucao({ avaliacoes }: GraficoEvolucaoProps) {
  if (avaliacoes.length === 0) {
    return null;
  }

  // Separar avaliações iniciais das de feedback
  const avaliacoesIniciais = avaliacoes.filter(av => !av.relato?.startsWith("Feedback pós-reforço:"));
  const avaliacoesFeedback = avaliacoes.filter(av => av.relato?.startsWith("Feedback pós-reforço:"));

  // Calcular progresso por módulo
  const calcularProgresso = (): ProgressoModulo[] => {
    const modulosUnicos = Array.from(new Set(avaliacoes.map(av => av.modulo)));
    
    return modulosUnicos.map(modulo => {
      const avaliacoesModulo = avaliacoes
        .filter(av => av.modulo === modulo)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      const primeiraAvaliacao = avaliacoesModulo[0]?.nivel || 0;
      const ultimaAvaliacao = avaliacoesModulo[avaliacoesModulo.length - 1]?.nivel || 0;
      
      return {
        modulo,
        avaliacaoInicial: primeiraAvaliacao,
        avaliacaoFinal: ultimaAvaliacao,
        melhoria: ultimaAvaliacao - primeiraAvaliacao,
        totalAvaliacoes: avaliacoesModulo.length,
      };
    }).filter(p => p.totalAvaliacoes > 1); // Só mostrar módulos com mais de uma avaliação
  };

  const progressos = calcularProgresso();

  // Agrupar avaliações por módulo e ordenar por data
  const dadosPorModulo: Record<string, { data: string; nivel: number; dataCompleta: Date; isFeedback: boolean }[]> = {};

  avaliacoes.forEach((av) => {
    if (!dadosPorModulo[av.modulo]) {
      dadosPorModulo[av.modulo] = [];
    }
    const data = new Date(av.created_at);
    const isFeedback = av.relato?.startsWith("Feedback pós-reforço:") || false;
    dadosPorModulo[av.modulo].push({
      data: data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
      nivel: av.nivel,
      dataCompleta: data,
      isFeedback,
    });
  });

  // Ordenar cada módulo por data
  Object.keys(dadosPorModulo).forEach((modulo) => {
    dadosPorModulo[modulo].sort((a, b) => a.dataCompleta.getTime() - b.dataCompleta.getTime());
  });

  // Preparar dados para o gráfico (timeline única com índice sequencial)
  const todasAvaliacoesOrdenadas = avaliacoes
    .map(av => ({
      ...av,
      dataCompleta: new Date(av.created_at),
      isFeedback: av.relato?.startsWith("Feedback pós-reforço:") || false,
    }))
    .sort((a, b) => a.dataCompleta.getTime() - b.dataCompleta.getTime());

  const dadosGrafico = todasAvaliacoesOrdenadas.map((av, index) => {
    const ponto: Record<string, string | number | boolean> = {
      index: index + 1,
      data: av.dataCompleta.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      dataHora: av.dataCompleta.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    };
    
    // Adicionar o nível do módulo
    ponto[av.modulo] = av.nivel;
    ponto[`${av.modulo}_feedback`] = av.isFeedback;
    
    return ponto;
  });

  // Preencher valores anteriores para manter linhas contínuas
  const modulos = Object.keys(dadosPorModulo);
  let ultimosValores: Record<string, number> = {};
  
  dadosGrafico.forEach(ponto => {
    modulos.forEach(modulo => {
      if (ponto[modulo] !== undefined) {
        ultimosValores[modulo] = ponto[modulo] as number;
      }
    });
  });

  // Cores para os módulos
  const cores = [
    "hsl(217, 91%, 50%)",   // Azul
    "hsl(152, 69%, 45%)",   // Verde
    "hsl(45, 93%, 47%)",    // Amarelo
    "hsl(280, 65%, 60%)",   // Roxo
    "hsl(340, 75%, 55%)",   // Rosa
    "hsl(190, 80%, 45%)",   // Ciano
  ];

  const getProgressIcon = (melhoria: number) => {
    if (melhoria > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (melhoria < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getProgressColor = (melhoria: number) => {
    if (melhoria > 0) return "text-green-600 dark:text-green-400";
    if (melhoria < 0) return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">Avaliação #{label}</p>
          {payload.map((entry: any, index: number) => {
            const moduloName = entry.dataKey;
            const isFeedback = entry.payload[`${moduloName}_feedback`];
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{moduloName}:</span>
                <span className="font-medium" style={{ color: entry.color }}>
                  {entry.value}/5
                </span>
                {isFeedback && (
                  <Badge variant="outline" className="text-xs py-0 px-1 border-green-500 text-green-600">
                    Pós-estudo
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-secondary" />
          Evolução por Módulo
        </CardTitle>
        <CardDescription>
          Acompanhe sua progressão real ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cards de Progresso */}
        {progressos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {progressos.map((progresso, index) => (
              <div 
                key={progresso.modulo}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{progresso.modulo}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{progresso.avaliacaoInicial}/5</span>
                    <ArrowUp className="h-3 w-3" />
                    <span>{progresso.avaliacaoFinal}/5</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getProgressIcon(progresso.melhoria)}
                  <span className={`text-lg font-bold ${getProgressColor(progresso.melhoria)}`}>
                    {progresso.melhoria > 0 ? "+" : ""}{progresso.melhoria}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legenda de tipos de avaliação */}
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Avaliação inicial</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs py-0 px-1 border-green-500 text-green-600">
              Pós-estudo
            </Badge>
            <span className="text-muted-foreground">Após material de reforço</span>
          </div>
        </div>

        {/* Gráfico */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dadosGrafico}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="index"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Avaliações', position: 'insideBottom', offset: -5, fontSize: 11 }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Nível', angle: -90, position: 'insideLeft', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {/* Linha de referência para nível médio */}
              <ReferenceLine 
                y={3} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5" 
                strokeOpacity={0.5}
              />
              {modulos.map((modulo, index) => (
                <Line
                  key={modulo}
                  type="monotone"
                  dataKey={modulo}
                  stroke={cores[index % cores.length]}
                  strokeWidth={2}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const isFeedback = payload[`${modulo}_feedback`];
                    if (payload[modulo] === undefined) return null;
                    
                    if (isFeedback) {
                      // Marcador especial para feedback (estrela/diamante)
                      return (
                        <g key={`dot-${modulo}-${props.index}`}>
                          <polygon
                            points={`${cx},${cy-6} ${cx+4},${cy+4} ${cx-4},${cy+4}`}
                            fill={cores[index % cores.length]}
                            stroke="white"
                            strokeWidth={1}
                          />
                        </g>
                      );
                    }
                    // Marcador normal (círculo)
                    return (
                      <circle
                        key={`dot-${modulo}-${props.index}`}
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill={cores[index % cores.length]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda de níveis */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>1 = Muito difícil</span>
          <span>→</span>
          <span>5 = Muito fácil</span>
        </div>

        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{avaliacoesIniciais.length}</p>
            <p className="text-xs text-muted-foreground">Avaliações</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{avaliacoesFeedback.length}</p>
            <p className="text-xs text-muted-foreground">Feedbacks pós-estudo</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary">{modulos.length}</p>
            <p className="text-xs text-muted-foreground">Módulos ativos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
