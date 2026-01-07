import { useState } from 'react';
import SnakeGame from '@/components/SnakeGame';
import LevelSnakeGame from '@/components/LevelSnakeGame';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [activeMode, setActiveMode] = useState<string>('classic');

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 crt-effect">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl arcade-text text-primary mb-2">
          ARCADE SNAKE
        </h1>
        <p className="text-sm text-muted-foreground">
          A CLASSIC REIMAGINED
        </p>
      </header>

      <Tabs value={activeMode} onValueChange={setActiveMode} className="w-full max-w-[650px]">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/30 border border-border">
          <TabsTrigger
            value="classic"
            className="arcade-text text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_hsl(180_100%_50%/0.5)]"
          >
            CLASSIC
          </TabsTrigger>
          <TabsTrigger
            value="levels"
            className="arcade-text text-sm data-[state=active]:bg-green-500 data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_hsl(120_100%_50%/0.5)]"
          >
            LEVELS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classic" className="mt-0">
          <div className="text-center mb-4">
            <p className="text-xs text-muted-foreground">
              Endless mode • Eat to grow • Beat your high score
            </p>
          </div>
          <SnakeGame />
        </TabsContent>

        <TabsContent value="levels" className="mt-0">
          <div className="text-center mb-4">
            <p className="text-xs text-muted-foreground">
              10 levels • Avoid obstacles • Increasing difficulty
            </p>
          </div>
          <LevelSnakeGame />
        </TabsContent>
      </Tabs>

      <footer className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 NEON ARCADE
        </p>
      </footer>
    </div>
  );
};

export default Index;
