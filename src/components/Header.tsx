import { BookOpen, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="gradient-hero text-primary-foreground py-8 px-6">
      <div className="container mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-foreground/20 rounded-xl">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Apoio Inteligente
          </h1>
          <Sparkles className="h-6 w-6 animate-pulse-soft" />
        </div>
        <p className="text-primary-foreground/90 text-lg max-w-2xl">
          Sistema de reforço de aprendizado personalizado com IA. 
          Avalie seu entendimento e receba materiais de apoio adaptados às suas necessidades.
        </p>
      </div>
    </header>
  );
}
