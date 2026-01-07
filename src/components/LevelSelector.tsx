interface LevelSelectorProps {
  onSelectLevel: (level: number) => void;
}

const LEVEL_INFO = [
  { obstacles: 3, food: 5 },
  { obstacles: 5, food: 7 },
  { obstacles: 8, food: 8 },
  { obstacles: 12, food: 10 },
  { obstacles: 16, food: 12 },
  { obstacles: 20, food: 14 },
  { obstacles: 25, food: 16 },
  { obstacles: 30, food: 18 },
  { obstacles: 36, food: 20 },
  { obstacles: 45, food: 25 },
];

const LevelSelector = ({ onSelectLevel }: LevelSelectorProps) => {
  return (
    <div className="grid grid-cols-5 gap-3 w-full max-w-[600px]">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
        <button
          key={level}
          onClick={() => onSelectLevel(level)}
          className="group relative aspect-square rounded-lg bg-muted/50 border-2 border-green-500/30 hover:border-green-400 hover:bg-green-500/10 transition-all duration-200 flex flex-col items-center justify-center gap-1"
          style={{
            boxShadow: '0 0 10px hsl(120 100% 50% / 0.1)',
          }}
        >
          <span className="text-xl font-bold arcade-text text-green-400 group-hover:text-green-300">
            {level}
          </span>
          <span className="text-[8px] text-orange-400/80">
            {LEVEL_INFO[level - 1].obstacles} obs
          </span>
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
