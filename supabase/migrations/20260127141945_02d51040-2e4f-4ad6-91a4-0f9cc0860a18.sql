-- Tabela de usuários
CREATE TABLE public.usuarios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de avaliações
CREATE TABLE public.avaliacoes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    modulo TEXT NOT NULL,
    nivel INTEGER NOT NULL CHECK (nivel >= 1 AND nivel <= 5),
    relato TEXT,
    reforco TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS (mas com políticas públicas para o usuário demo)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (para simplificar o demo - sem autenticação)
CREATE POLICY "Permitir leitura pública de usuarios" 
ON public.usuarios FOR SELECT 
USING (true);

CREATE POLICY "Permitir leitura pública de avaliacoes" 
ON public.avaliacoes FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserção pública de avaliacoes" 
ON public.avaliacoes FOR INSERT 
WITH CHECK (true);

-- Inserir usuário demo
INSERT INTO public.usuarios (nome) VALUES ('Aluno Demo');