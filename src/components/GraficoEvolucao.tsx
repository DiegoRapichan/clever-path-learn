import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Avaliacao } from "@/lib/api";

interface GraficoEvolucaoProps {
  avaliacoes: Avaliacao[];
}

export function GraficoEvolucao({ avaliacoes }: GraficoEvolucaoProps) {
  if (avaliacoes.length === 0) {
    return null;
  }

  // Agrupar avaliações por módulo e ordenar por data
  const dadosPorModulo: Record<string, { data: string; nivel: number; dataCompleta: Date }[]> = {};

  avaliacoes.forEach((av) => {
    if (!dadosPorModulo[av.modulo]) {
      dadosPorModulo[av.modulo] = [];
    }
    const data = new Date(av.created_at);
    dadosPorModulo[av.modulo].push({
      data: data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      nivel: av.nivel,
      dataCompleta: data,
    });
  });

  // Ordenar cada módulo por data
  Object.keys(dadosPorModulo).forEach((modulo) => {
    dadosPorModulo[modulo].sort((a, b) => a.dataCompleta.getTime() - b.dataCompleta.getTime());
  });

  // Preparar dados para o gráfico (timeline única)
  const todasDatas = Array.from(
    new Set(
      avaliacoes.map((av) =>
        new Date(av.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      )
    )
  ).sort((a, b) => {
    const [diaA, mesA] = a.split("/").map(Number);
    const [diaB, mesB] = b.split("/").map(Number);
    return mesA - mesB || diaA - diaB;
  });

  const dadosGrafico = todasDatas.map((data) => {
    const ponto: Record<string, string | number> = { data };
    Object.keys(dadosPorModulo).forEach((modulo) => {
      const avaliacao = dadosPorModulo[modulo].find((d) => d.data === data);
      if (avaliacao) {
        ponto[modulo] = avaliacao.nivel;
      }
    });
    return ponto;
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

  const modulos = Object.keys(dadosPorModulo);

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-secondary" />
          Evolução por Módulo
        </CardTitle>
        <CardDescription>
          Acompanhe sua evolução de compreensão ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dadosGrafico}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="data"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              {modulos.map((modulo, index) => (
                <Line
                  key={modulo}
                  type="monotone"
                  dataKey={modulo}
                  stroke={cores[index % cores.length]}
                  strokeWidth={2}
                  dot={{ fill: cores[index % cores.length], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>1 = Muito difícil</span>
          <span>→</span>
          <span>5 = Muito fácil</span>
        </div>
      </CardContent>
    </Card>
  );
}
