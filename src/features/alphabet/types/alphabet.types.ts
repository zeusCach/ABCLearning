export interface Letter {
    id: string;
    letter: string;
    uppercase: string;
    lowercase: string;
    pronunciation: string;
    examples: Example[];
    color: string;
    soundFile?: string;
}

export interface Example {
    word: string;
    image?: string;
    emoji: string;
}

export type AlphabetData = Letter[];