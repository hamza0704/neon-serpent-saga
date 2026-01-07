import SnakeGame from '@/components/SnakeGame';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 crt-effect">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl arcade-text text-primary mb-2">
          ARCADE SNAKE
        </h1>
        <p className="text-sm text-muted-foreground">
          A CLASSIC REIMAGINED
        </p>
      </header>
      
      <main>
        <SnakeGame />
      </main>
      
      <footer className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 NEON ARCADE
        </p>
      </footer>
    </div>
  );
};

export default Index;
