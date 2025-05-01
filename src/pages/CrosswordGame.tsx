
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";

// Словарь для генерации кроссвордов
const wordDictionary = {
  normal: ["кот", "дом", "сад", "мир", "луч", "пар", "мак", "рот", "кит", "лес"],
  regular: ["книга", "ручка", "окно", "стол", "лампа", "время", "место", "рыба", "кофе", "город"],
  hard: ["история", "музыка", "природа", "культура", "космос", "физика", "химия", "техника", "политика", "медицина"],
  pro: ["архитектура", "астрономия", "философия", "лингвистика", "математика", "психология", "социология", "экономика", "литература", "искусство"],
};

// Определения для слов
const wordDefinitions = {
  "кот": "Домашнее животное, которое мяукает",
  "дом": "Здание для жилья",
  "сад": "Участок земли с растениями",
  "мир": "Вселенная, земной шар",
  "луч": "Полоса света",
  "пар": "Газообразное состояние воды",
  "мак": "Растение с яркими цветами",
  "рот": "Часть лица, которой едят",
  "кит": "Крупное морское млекопитающее",
  "лес": "Экосистема с множеством деревьев",
  
  "книга": "Печатное издание с текстом",
  "ручка": "Инструмент для письма",
  "окно": "Проем в стене для света и воздуха",
  "стол": "Предмет мебели с плоской поверхностью",
  "лампа": "Источник искусственного света",
  "время": "Непрерывная длительность существования",
  "место": "Пространство, которое может быть занято",
  "рыба": "Водное позвоночное животное с жабрами",
  "кофе": "Напиток из обжаренных зерен",
  "город": "Крупный населенный пункт",
  
  "история": "Наука о прошлом человечества",
  "музыка": "Искусство звуков, организованных в времени",
  "природа": "Материальный мир вселенной",
  "культура": "Совокупность достижений человечества",
  "космос": "Пространство за пределами Земли",
  "физика": "Наука о материи и энергии",
  "химия": "Наука о веществах и их превращениях",
  "техника": "Совокупность средств деятельности",
  "политика": "Деятельность по управлению обществом",
  "медицина": "Наука о здоровье и болезнях",
  
  "архитектура": "Искусство проектирования зданий",
  "астрономия": "Наука о небесных телах",
  "философия": "Наука о наиболее общих законах бытия",
  "лингвистика": "Наука о языке",
  "математика": "Наука о количествах и пространствах",
  "психология": "Наука о психике и поведении",
  "социология": "Наука об обществе и социальных группах",
  "экономика": "Наука о хозяйственной деятельности",
  "литература": "Совокупность письменных произведений",
  "искусство": "Творческое отражение действительности",
};

// Типы для кроссворда
type Cell = {
  letter: string;
  revealed: boolean;
  rowIndex: number;
  colIndex: number;
  wordIndex?: number;
};

type CrosswordWord = {
  word: string;
  definition: string;
  startRow: number;
  startCol: number;
  direction: 'across' | 'down';
};

type Crossword = {
  grid: Cell[][];
  words: CrosswordWord[];
  size: number;
};

const CrosswordGame = () => {
  const { difficulty } = useParams<{ difficulty: string }>();
  const navigate = useNavigate();
  const [crossword, setCrossword] = useState<Crossword | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [completedWords, setCompletedWords] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>("");

  // Генерация кроссворда при загрузке страницы
  useEffect(() => {
    if (!difficulty || !wordDictionary[difficulty as keyof typeof wordDictionary]) {
      navigate('/crosswords');
      return;
    }
    
    generateCrossword(difficulty as keyof typeof wordDictionary);
  }, [difficulty, navigate]);

  // Функция для создания случайного кроссворда
  const generateCrossword = (level: keyof typeof wordDictionary) => {
    const words = wordDictionary[level];
    const size = level === 'normal' ? 8 : level === 'regular' ? 10 : level === 'hard' ? 12 : 15;
    
    // Инициализация пустой сетки
    const grid: Cell[][] = Array(size).fill(null).map((_, rowIndex) => 
      Array(size).fill(null).map((_, colIndex) => ({
        letter: '',
        revealed: false,
        rowIndex,
        colIndex
      }))
    );
    
    const crosswordWords: CrosswordWord[] = [];
    
    // Случайно выбираем 5 слов для кроссворда
    const selectedWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    // Размещаем первое слово в центре
    const firstWord = selectedWords[0];
    const startRow = Math.floor(size / 2);
    const startCol = Math.floor((size - firstWord.length) / 2);
    
    // Добавляем первое слово по горизонтали
    crosswordWords.push({
      word: firstWord,
      definition: wordDefinitions[firstWord] || "Определение отсутствует",
      startRow,
      startCol,
      direction: 'across'
    });
    
    // Помещаем буквы в сетку
    for (let i = 0; i < firstWord.length; i++) {
      grid[startRow][startCol + i].letter = firstWord[i];
    }
    
    // Пытаемся разместить остальные слова
    for (let i = 1; i < selectedWords.length; i++) {
      const word = selectedWords[i];
      let placed = false;
      
      // Пробуем найти общую букву с уже размещенными словами
      for (let attempt = 0; attempt < 100 && !placed; attempt++) {
        for (let r = 0; r < size && !placed; r++) {
          for (let c = 0; c < size && !placed; c++) {
            if (grid[r][c].letter !== '' && word.includes(grid[r][c].letter)) {
              const letterIndex = word.indexOf(grid[r][c].letter);
              
              // Пробуем разместить по вертикали
              if (r - letterIndex >= 0 && r + (word.length - letterIndex) <= size) {
                let canPlace = true;
                
                // Проверяем, что слово можно разместить
                for (let j = 0; j < word.length; j++) {
                  const newRow = r - letterIndex + j;
                  if (newRow !== r && grid[newRow][c].letter !== '' && grid[newRow][c].letter !== word[j]) {
                    canPlace = false;
                    break;
                  }
                }
                
                if (canPlace) {
                  crosswordWords.push({
                    word,
                    definition: wordDefinitions[word] || "Определение отсутствует",
                    startRow: r - letterIndex,
                    startCol: c,
                    direction: 'down'
                  });
                  
                  for (let j = 0; j < word.length; j++) {
                    grid[r - letterIndex + j][c].letter = word[j];
                  }
                  
                  placed = true;
                  break;
                }
              }
              
              // Если не получилось по вертикали, пробуем по горизонтали
              if (!placed && c - letterIndex >= 0 && c + (word.length - letterIndex) <= size) {
                let canPlace = true;
                
                for (let j = 0; j < word.length; j++) {
                  const newCol = c - letterIndex + j;
                  if (newCol !== c && grid[r][newCol].letter !== '' && grid[r][newCol].letter !== word[j]) {
                    canPlace = false;
                    break;
                  }
                }
                
                if (canPlace) {
                  crosswordWords.push({
                    word,
                    definition: wordDefinitions[word] || "Определение отсутствует",
                    startRow: r,
                    startCol: c - letterIndex,
                    direction: 'across'
                  });
                  
                  for (let j = 0; j < word.length; j++) {
                    grid[r][c - letterIndex + j].letter = word[j];
                  }
                  
                  placed = true;
                  break;
                }
              }
            }
          }
        }
      }
      
      // Если не удалось разместить слово, пропускаем его
      if (!placed) {
        continue;
      }
    }
    
    // Устанавливаем кроссворд
    setCrossword({
      grid,
      words: crosswordWords,
      size
    });
  };

  // Обработка клика по ячейке
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell([rowIndex, colIndex]);
    
    // Находим слово, которому принадлежит ячейка
    if (crossword) {
      for (let i = 0; i < crossword.words.length; i++) {
        const word = crossword.words[i];
        
        if (word.direction === 'across') {
          if (rowIndex === word.startRow && colIndex >= word.startCol && colIndex < word.startCol + word.word.length) {
            setCurrentHint(word.definition);
            break;
          }
        } else {
          if (colIndex === word.startCol && rowIndex >= word.startRow && rowIndex < word.startRow + word.word.length) {
            setCurrentHint(word.definition);
            break;
          }
        }
      }
    }
  };

  // Открытие буквы (подсказка)
  const revealLetter = () => {
    if (!selectedCell || !crossword) return;
    
    const [rowIndex, colIndex] = selectedCell;
    const newGrid = [...crossword.grid];
    newGrid[rowIndex][colIndex].revealed = true;
    setCrossword({
      ...crossword,
      grid: newGrid
    });
    
    // Проверяем, завершены ли какие-то слова
    checkCompletedWords(newGrid);
  };

  // Проверка завершенных слов
  const checkCompletedWords = (grid: Cell[][]) => {
    if (!crossword) return;
    
    const newCompletedWords: number[] = [];
    
    crossword.words.forEach((word, index) => {
      let isComplete = true;
      
      if (word.direction === 'across') {
        for (let i = 0; i < word.word.length; i++) {
          if (!grid[word.startRow][word.startCol + i].revealed) {
            isComplete = false;
            break;
          }
        }
      } else {
        for (let i = 0; i < word.word.length; i++) {
          if (!grid[word.startRow + i][word.startCol].revealed) {
            isComplete = false;
            break;
          }
        }
      }
      
      if (isComplete) {
        newCompletedWords.push(index);
      }
    });
    
    setCompletedWords(newCompletedWords);
  };

  // Генерация нового кроссворда
  const generateNewCrossword = () => {
    if (difficulty) {
      generateCrossword(difficulty as keyof typeof wordDictionary);
      setSelectedCell(null);
      setCompletedWords([]);
    }
  };

  if (!crossword) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full inline-block mb-4"></div>
          <p className="text-amber-800">Генерация кроссворда...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col bg-[url('https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
      <div className="max-w-5xl mx-auto w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            className="bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800"
            onClick={() => navigate('/crosswords')}
          >
            <Icon name="ArrowLeft" size={18} />
            <span>Назад к выбору</span>
          </Button>
          
          <h1 className="text-3xl font-serif text-center text-amber-900">
            Кроссворд ({difficulty === 'normal' ? 'Нормальный' : 
                       difficulty === 'regular' ? 'Обычный' : 
                       difficulty === 'hard' ? 'Сложный' : 'Профи'})
          </h1>
          
          <Button 
            variant="outline" 
            className="bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800"
            onClick={generateNewCrossword}
          >
            <Icon name="RefreshCw" size={18} />
            <span>Новый кроссворд</span>
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="flex-1">
            <div className="border-4 border-amber-800 rounded-md bg-amber-50 overflow-hidden shadow-md">
              <div className="grid" style={{ 
                gridTemplateColumns: `repeat(${crossword.size}, minmax(30px, 1fr))`,
                gridTemplateRows: `repeat(${crossword.size}, minmax(30px, 1fr))`
              }}>
                {crossword.grid.map((row, rowIndex) => 
                  row.map((cell, colIndex) => (
                    <div 
                      key={`${rowIndex}-${colIndex}`}
                      className={cn(
                        "border border-amber-300 flex items-center justify-center text-lg font-bold select-none cursor-pointer transition-all",
                        cell.letter === '' ? 'bg-amber-900/20' : 'bg-amber-50 hover:bg-amber-100',
                        selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex ? 'bg-amber-300' : ''
                      )}
                      style={{ aspectRatio: '1/1' }}
                      onClick={() => cell.letter && handleCellClick(rowIndex, colIndex)}
                    >
                      {cell.letter && (cell.revealed ? cell.letter.toUpperCase() : '')}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="bg-amber-100/70 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-serif mb-2 text-amber-900">Подсказки:</h3>
              
              <div className="flex flex-col gap-2 mb-4">
                {crossword.words.map((word, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-2 rounded transition-all",
                      completedWords.includes(index) ? "bg-green-100 text-green-800" : "bg-amber-50 text-amber-800"
                    )}
                  >
                    <span className="font-bold mr-2">{index + 1}.</span>
                    <span className="italic">{word.definition}</span>
                    {completedWords.includes(index) && (
                      <span className="ml-2 font-bold">✓ {word.word.toUpperCase()}</span>
                    )}
                  </div>
                ))}
              </div>
              
              {selectedCell && (
                <div className="bg-amber-200 p-3 rounded-lg mb-4">
                  <p className="text-amber-800">
                    <span className="font-bold">Выбранная ячейка:</span> {currentHint}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  disabled={!selectedCell}
                  onClick={revealLetter}
                >
                  <Icon name="Lightbulb" size={18} />
                  <span>Открыть букву</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-amber-500 text-amber-800 hover:bg-amber-100"
                  onClick={() => setShowHint(!showHint)}
                >
                  <Icon name={showHint ? "EyeOff" : "Eye"} size={18} />
                  <span>{showHint ? "Скрыть подсказки" : "Показать подсказки"}</span>
                </Button>
              </div>
              
              {showHint && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-300">
                  <h4 className="font-serif text-lg text-amber-900 mb-2">Слова для разгадывания:</h4>
                  <div className="flex flex-wrap gap-2">
                    {crossword.words.map((word, index) => (
                      <span 
                        key={index}
                        className={cn(
                          "px-2 py-1 rounded text-sm",
                          completedWords.includes(index) ? "bg-green-100 text-green-700" : "bg-amber-200 text-amber-800"
                        )}
                      >
                        {word.word.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-auto">
              <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-200">
                <p className="text-amber-700 text-sm">
                  {completedWords.length === crossword.words.length ? (
                    <span className="font-bold text-green-600">Поздравляем! Вы решили весь кроссворд!</span>
                  ) : (
                    `Разгадано слов: ${completedWords.length} из ${crossword.words.length}`
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrosswordGame;
