import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { modulo, nivel, relato } = await req.json();
    
    // Validação básica
    if (!modulo || !nivel || !relato) {
      return new Response(
        JSON.stringify({ error: "Módulo, nível e relato são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Só gera reforço se nível <= 2 (dificuldade)
    if (nivel > 2) {
      return new Response(
        JSON.stringify({ 
          reforco: null,
          message: "Parabéns! Você está indo bem neste módulo." 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não está configurada");
    }

    // Prompt educacional para gerar reforço
    const systemPrompt = `Você é um tutor educacional especializado em criar materiais de reforço para estudantes.
Seu objetivo é ajudar o aluno a superar dificuldades de forma clara, paciente e encorajadora.

Diretrizes:
- Use linguagem simples e acessível
- Explique conceitos passo a passo
- Inclua exemplos práticos
- Seja motivador e positivo
- Estruture bem o conteúdo`;

    const userPrompt = `O aluno está estudando o módulo "${modulo}" e relatou a seguinte dificuldade:

"${relato}"

O nível de compreensão auto-avaliado foi ${nivel}/5 (onde 1 é muito difícil e 5 é muito fácil).

Por favor, crie um material de reforço que inclua:

1. **Explicação Simplificada**: Uma explicação clara e didática do conceito principal relacionado à dificuldade.

2. **Exercícios Práticos**: 2 ou 3 exercícios para o aluno praticar, com dificuldade progressiva.

3. **Dicas de Estudo**: Sugestões de como o aluno pode melhorar sua compreensão.

Formate a resposta de forma clara e organizada usando markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA insuficientes. Por favor, adicione créditos." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Erro do gateway AI:", response.status, errorText);
      throw new Error("Erro ao gerar reforço");
    }

    const data = await response.json();
    const reforco = data.choices?.[0]?.message?.content || "Não foi possível gerar o reforço.";

    return new Response(
      JSON.stringify({ 
        reforco,
        message: "Reforço gerado com sucesso!" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro na função gerar-reforco:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
