export type WordLevel = {
  id: string;
  word: string;
  emoji: string;
  hint: string;
  difficulty: 'Básico' | 'Medio';
  letters: string[];
};

export const wordLevels: WordLevel[] = [
  {
    id: 'oso',
    word: 'OSO',
    emoji: '🐻',
    hint: 'El oso vive en el bosque.',
    difficulty: 'Básico',
    letters: ['O', 'S', 'O'],
  },
  {
    id: 'sol',
    word: 'SOL',
    emoji: '☀️',
    hint: 'Nos ilumina durante el día.',
    difficulty: 'Básico',
    letters: ['S', 'O', 'L'],
  },
  {
    id: 'gato',
    word: 'GATO',
    emoji: '🐱',
    hint: 'Dice miau.',
    difficulty: 'Medio',
    letters: ['G', 'A', 'T', 'O', 'E'],
  },
  {
    id: 'luna',
    word: 'LUNA',
    emoji: '🌙',
    hint: 'La vemos de noche.',
    difficulty: 'Medio',
    letters: ['L', 'U', 'N', 'A', 'I'],
  },
];
