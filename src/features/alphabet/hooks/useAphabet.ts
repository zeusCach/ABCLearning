import { useState } from 'react';
import { alphabetData } from '../data/alphabetData';
import { Letter } from '../types/alphabet.types';

export const useAlphabet = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [letters] = useState<Letter[]>(alphabetData);

    const currentLetter = letters[currentIndex];

    const nextLetter = () => {
        if (currentIndex < letters.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const previousLetter = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goToLetter = (index: number) => {
        if (index >= 0 && index < letters.length) {
            setCurrentIndex(index);
        }
    };

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === letters.length - 1;

    return {
        letters,
        currentLetter,
        currentIndex,
        nextLetter,
        previousLetter,
        goToLetter,
        isFirst,
        isLast,
    };
};