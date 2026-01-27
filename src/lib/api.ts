import { supabase } from "@/integrations/supabase/client";

// Tipos
export interface Usuario {
  id: string;
  nome: string;
  created_at: string;
}

export interface Avaliacao {
  id: string;
  usuario_id: string;
  modulo: string;
  nivel: number;
  relato: string | null;
  reforco: string | null;
  created_at: string;
}

export interface NovaAvaliacao {
  usuario_id: string;
  modulo: string;
  nivel: number;
  relato: string;
}

// Buscar usuário demo
export async function buscarUsuarioDemo(): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("nome", "Aluno Demo")
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }

  return data;
}

// Buscar histórico de avaliações
export async function buscarHistorico(usuarioId: string): Promise<Avaliacao[]> {
  const { data, error } = await supabase
    .from("avaliacoes")
    .select("*")
    .eq("usuario_id", usuarioId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }

  return data || [];
}

// Enviar avaliação e gerar reforço se necessário
export async function enviarAvaliacao(avaliacao: NovaAvaliacao): Promise<{
  success: boolean;
  avaliacaoId?: string;
  reforco?: string | null;
  message: string;
}> {
  let reforco: string | null = null;

  // Se nível <= 2 e relato preenchido, gera reforço via IA
  if (avaliacao.nivel <= 2 && avaliacao.relato.trim()) {
    try {
      const { data, error } = await supabase.functions.invoke("gerar-reforco", {
        body: {
          modulo: avaliacao.modulo,
          nivel: avaliacao.nivel,
          relato: avaliacao.relato,
        },
      });

      if (error) {
        console.error("Erro ao gerar reforço:", error);
      } else {
        reforco = data?.reforco || null;
      }
    } catch (err) {
      console.error("Erro na chamada da função:", err);
    }
  }

  // Salvar avaliação no banco
  const { data: insertedData, error: insertError } = await supabase
    .from("avaliacoes")
    .insert({
      usuario_id: avaliacao.usuario_id,
      modulo: avaliacao.modulo,
      nivel: avaliacao.nivel,
      relato: avaliacao.relato,
      reforco: reforco,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Erro ao salvar avaliação:", insertError);
    return {
      success: false,
      message: "Erro ao salvar avaliação. Tente novamente.",
    };
  }

  return {
    success: true,
    avaliacaoId: insertedData.id,
    reforco: reforco,
    message: reforco
      ? "Avaliação salva e reforço gerado com sucesso!"
      : "Avaliação salva com sucesso! Continue assim!",
  };
}

// Gerar arquivo .txt para download
export function gerarArquivoReforco(avaliacao: Avaliacao): void {
  if (!avaliacao.reforco) return;

  const conteudo = `
=====================================
APOIO INTELIGENTE - Material de Reforço
=====================================

Módulo: ${avaliacao.modulo}
Nível de compreensão: ${avaliacao.nivel}/5
Data: ${new Date(avaliacao.created_at).toLocaleDateString("pt-BR")}

-------------------------------------
RELATO DO ALUNO:
-------------------------------------
${avaliacao.relato || "Não informado"}

-------------------------------------
MATERIAL DE REFORÇO:
-------------------------------------
${avaliacao.reforco}

=====================================
Bons estudos! 📚
=====================================
`;

  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reforco-${avaliacao.modulo.toLowerCase().replace(/\s+/g, "-")}-${new Date(avaliacao.created_at).toISOString().split("T")[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
