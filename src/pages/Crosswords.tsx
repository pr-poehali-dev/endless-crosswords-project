
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const difficultyLevels = [
  { id: "normal", name: "Нормальный", icon: "BookOpen" },
  { id: "regular", name: "Обычный", icon: "BookCopy" },
  { id: "hard", name: "Сложный", icon: "BookMarked" },
  { id: "pro", name: "Профи", icon: "BookX" },
];

const CrosswordsPage = () => {
  const navigate = useNavigate();
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);

  const handleDifficultySelect = (difficulty: string) => {
    navigate(`/crosswords/${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1516562309708-4b5b2821b60b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-amber-200">
        <h1 className="text-4xl font-serif text-center mb-6 text-amber-900">Кроссворды</h1>
        <p className="text-center text-amber-800 mb-10">Выберите уровень сложности, чтобы начать решать кроссворды</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {difficultyLevels.map((level) => (
            <Button
              key={level.id}
              variant="outline"
              className={cn(
                "h-40 flex flex-col items-center justify-center gap-4 text-lg transition-all duration-300 bg-amber-50/80 border-amber-200 hover:bg-amber-100",
                hoveredLevel && hoveredLevel !== level.id && "opacity-70 scale-95",
                level.id === "hard" && "border-amber-300",
                level.id === "pro" && "border-amber-400"
              )}
              onMouseEnter={() => setHoveredLevel(level.id)}
              onMouseLeave={() => setHoveredLevel(null)}
              onClick={() => handleDifficultySelect(level.id)}
            >
              <Icon 
                name={level.icon} 
                size={36} 
                className={cn(
                  "text-amber-700",
                  level.id === "hard" && "text-amber-800",
                  level.id === "pro" && "text-amber-900"
                )} 
              />
              <span className={cn(
                "font-serif",
                level.id === "hard" && "font-semibold",
                level.id === "pro" && "font-bold"
              )}>
                {level.name}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="text-center text-amber-700 italic">
          <p>Выберите сложность и погрузитесь в мир слов и загадок!</p>
        </div>
      </div>
    </div>
  );
};

export default CrosswordsPage;
