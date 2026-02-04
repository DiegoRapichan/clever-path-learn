# 🎓 Clever Path Learn

Plataforma completa de aprendizado com trilhas personalizadas, construída com React, TypeScript e Supabase.

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?style=flat&logo=supabase&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Sistema moderno de gerenciamento de aprendizado com trilhas customizáveis, progresso em tempo real e interface intuitiva.

---

## 🔗 Links Relacionados

- **Demo ao Vivo**: [clever-path-learn.lovable.app](https://clever-path-learn.lovable.app)
- **Backend API**: Em desenvolvimento
- **Documentação**: Em breve

---

## 🎯 Sobre o Projeto

**Clever Path Learn** é uma plataforma educacional moderna que permite aos usuários criar e seguir trilhas de aprendizado personalizadas. Com foco em:

- ✅ Interface intuitiva e responsiva
- ✅ Trilhas de aprendizado customizáveis
- ✅ Acompanhamento de progresso em tempo real
- ✅ Sistema de autenticação seguro
- ✅ Gamificação e conquistas
- ✅ Dashboard analítico

Desenvolvida com as tecnologias mais modernas do ecossistema React, a plataforma oferece uma experiência fluida e engajante para estudantes e educadores.

---

## ✨ Funcionalidades

### 🎓 Sistema de Aprendizado

- ✅ Criação de trilhas personalizadas
- ✅ Módulos e lições organizadas
- ✅ Conteúdo multimídia (vídeos, textos, quizzes)
- ✅ Progresso por curso e módulo
- ✅ Certificados de conclusão
- ✅ Marcação de favoritos

### 📊 Acompanhamento e Analytics

- ✅ Dashboard de progresso
- ✅ Estatísticas de aprendizado
- ✅ Histórico de atividades
- ✅ Tempo de estudo
- ✅ Taxa de conclusão
- ✅ Relatórios detalhados

### 🏆 Gamificação

- ✅ Sistema de pontos (XP)
- ✅ Níveis e badges
- ✅ Conquistas desbloqueáveis
- ✅ Ranking de usuários
- ✅ Streak de estudos
- ✅ Desafios diários

### 👥 Gestão de Usuários

- ✅ Autenticação via Supabase
- ✅ Perfis personalizáveis
- ✅ Preferências de aprendizado
- ✅ Histórico completo
- ✅ Notificações personalizadas

### 🎨 Interface e UX

- ✅ Design moderno com Tailwind CSS
- ✅ Componentes reutilizáveis (shadcn/ui)
- ✅ Animações suaves
- ✅ Modo escuro/claro
- ✅ Totalmente responsivo
- ✅ Acessibilidade (WCAG)

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 18.3** - Biblioteca UI moderna
- **TypeScript 5.6** - Tipagem estática
- **Vite 6.0** - Build tool ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes acessíveis e customizáveis
- **React Router** - Navegação SPA
- **React Query** - Gerenciamento de estado do servidor

### Backend & Database

- **Supabase** - Backend as a Service
  - PostgreSQL - Banco de dados relacional
  - Row Level Security (RLS)
  - Realtime subscriptions
  - Storage para arquivos
  - Authentication

### Ferramentas de Desenvolvimento

- **Vitest** - Framework de testes
- **ESLint** - Linter JavaScript/TypeScript
- **PostCSS** - Processamento CSS
- **Bun** - Runtime JavaScript rápido

---

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ ou Bun 1.0+
- npm, yarn ou bun
- Conta no Supabase (gratuita)

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/DiegoRapichan/clever-path-learn.git
cd clever-path-learn
```

2. **Instale as dependências**

```bash
# Com npm
npm install

# Com yarn
yarn install

# Com bun (recomendado)
bun install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. **Configure o Supabase**

Execute as migrations SQL localizadas em `/supabase/migrations`:

```sql
-- Exemplo de estrutura (ajustar conforme necessário)
-- Criar tabelas de usuários, cursos, lições, progresso, etc.
```

5. **Inicie o servidor de desenvolvimento**

```bash
# Com npm
npm run dev

# Com yarn
yarn dev

# Com bun
bun dev
```

A aplicação estará rodando em `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
clever-path-learn/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes base (shadcn)
│   │   ├── layout/       # Layouts da aplicação
│   │   ├── features/     # Componentes por feature
│   │   └── shared/       # Componentes compartilhados
│   ├── pages/            # Páginas da aplicação
│   ├── hooks/            # Custom React Hooks
│   ├── lib/              # Utilitários e configurações
│   │   ├── supabase.ts  # Cliente Supabase
│   │   └── utils.ts     # Funções auxiliares
│   ├── types/            # Definições TypeScript
│   ├── styles/           # Estilos globais
│   ├── App.tsx           # Componente raiz
│   └── main.tsx          # Entry point
├── supabase/             # Configuração Supabase
│   ├── migrations/       # SQL migrations
│   └── config.toml       # Configuração local
├── .env                  # Variáveis de ambiente
├── .gitignore
├── components.json       # Config shadcn/ui
├── package.json
├── tailwind.config.ts    # Config Tailwind
├── tsconfig.json         # Config TypeScript
├── vite.config.ts        # Config Vite
└── README.md
```

---

## 🗄️ Estrutura do Banco de Dados (Supabase)

### Tabelas Principais

**users** (Gerenciado pelo Supabase Auth)
```sql
- id: uuid (PK)
- email: text
- created_at: timestamp
- metadata: jsonb
```

**profiles**
```sql
- id: uuid (PK, FK -> users.id)
- username: text
- avatar_url: text
- bio: text
- level: integer
- xp: integer
- created_at: timestamp
- updated_at: timestamp
```

**courses**
```sql
- id: uuid (PK)
- title: text
- description: text
- instructor_id: uuid (FK -> users.id)
- category: text
- difficulty: text
- thumbnail_url: text
- created_at: timestamp
- updated_at: timestamp
```

**lessons**
```sql
- id: uuid (PK)
- course_id: uuid (FK -> courses.id)
- title: text
- content: text
- order: integer
- duration: integer
- type: text (video, text, quiz)
- created_at: timestamp
```

**progress**
```sql
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- lesson_id: uuid (FK -> lessons.id)
- completed: boolean
- completed_at: timestamp
- time_spent: integer
```

**achievements**
```sql
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- badge_type: text
- earned_at: timestamp
```

---

## 🚀 Deploy

### Deploy no Lovable (Recomendado)

1. Acesse [lovable.dev](https://lovable.dev)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Clique em **Share → Publish**
5. Seu app estará no ar! 🎉

### Deploy Alternativo (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure as variáveis de ambiente no dashboard
```

### Deploy Alternativo (Netlify)

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Configure as variáveis de ambiente no dashboard
```

---

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 🎨 Customização

### Temas e Cores

Edite `tailwind.config.ts` para personalizar o tema:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
      },
    },
  },
}
```

### Componentes

Adicione novos componentes shadcn/ui:

```bash
npx shadcn-ui@latest add [component-name]
```

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature
   ```bash
   git checkout -b feature/MinhaNovaFeature
   ```
3. Commit suas mudanças
   ```bash
   git commit -m 'Adiciona MinhaNovaFeature'
   ```
4. Push para a branch
   ```bash
   git push origin feature/MinhaNovaFeature
   ```
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga o padrão de código existente
- Adicione testes para novas features
- Atualize a documentação quando necessário
- Mantenha commits semânticos

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Diego Rapichan**

- GitHub: [@DiegoRapichan](https://github.com/DiegoRapichan)
- LinkedIn: [Diego Rapichan](https://linkedin.com/in/diego-rapichan)
- Email: direrapichan@gmail.com

---

## 🙏 Agradecimentos

- Projeto desenvolvido como parte do portfólio de desenvolvimento Full Stack
- Inspirado nas melhores práticas de plataformas educacionais modernas
- Construído usando [Lovable](https://lovable.dev)

---

## 📚 Recursos Adicionais

- [Documentação React](https://react.dev)
- [Documentação TypeScript](https://www.typescriptlang.org/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

## 🗺️ Roadmap

- [ ] Integração com APIs de vídeo (YouTube, Vimeo)
- [ ] Sistema de chat em tempo real
- [ ] Suporte a múltiplos idiomas (i18n)
- [ ] App mobile (React Native)
- [ ] Modo offline
- [ ] Inteligência Artificial para recomendações
- [ ] Suporte a certificados personalizados
- [ ] Marketplace de cursos

---

⭐ **Se este projeto te ajudou, considere dar uma estrela no repositório!**

---

<div align="center">
  Desenvolvido por Diego Rapichan
</div>
