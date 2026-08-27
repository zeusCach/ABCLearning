import { useCallback, useMemo, useRef, useState } from "react";
// @ts-expect-error React Native types are provided by the app's native build environment.
import * as Haptics from "expo-haptics";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";

import { wordLevels, type WordLevel } from "../data/wordLevels";

type DropZone = { x: number; y: number; width: number; height: number };

type LetterTileProps = {
  letter: string;
  index: number;
  used: boolean;
  onDrop: (index: number, pageX: number, pageY: number) => void;
  onSelect: (index: number) => void;
};

function speak(letter: string) {
  const speech = globalThis as typeof globalThis & {
    speechSynthesis?: {
      cancel: () => void;
      speak: (utterance: { text: string; lang: string }) => void;
    };
    SpeechSynthesisUtterance?: new (text: string) => {
      text: string;
      lang: string;
    };
  };

  if (speech.speechSynthesis && speech.SpeechSynthesisUtterance) {
    speech.speechSynthesis.cancel();
    const utterance = new speech.SpeechSynthesisUtterance(letter);
    utterance.lang = "es-ES";
    speech.speechSynthesis.speak(utterance);
  }
}

function LetterTile({
  letter,
  index,
  used,
  onDrop,
  onSelect,
}: LetterTileProps) {
  const position = useRef(new Animated.ValueXY()).current;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !used,
        onMoveShouldSetPanResponder: (_, gesture) =>
          !used && (Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4),
        onPanResponderMove: Animated.event(
          [null, { dx: position.x, dy: position.y }],
          { useNativeDriver: false },
        ),
        onPanResponderRelease: (_, gesture) => {
          position.flattenOffset();
          onDrop(index, gesture.moveX, gesture.moveY);
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () =>
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start(),
      }),
    [index, onDrop, position, used],
  );

  return (
    <Animated.View
      style={[
        styles.tileWrapper,
        {
          transform: position.getTranslateTransform(),
          opacity: used ? 0.35 : 1,
        },
      ]}
    >
      <Pressable
        accessibilityLabel={`Letra ${letter}`}
        accessibilityRole="button"
        disabled={used}
        onPress={() => onSelect(index)}
        style={styles.letterTile}
        {...panResponder.panHandlers}
      >
        <Text style={styles.tileText}>{letter}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function WordBuilderGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [placedLetters, setPlacedLetters] = useState<string[]>([]);
  const [usedTiles, setUsedTiles] = useState<number[]>([]);
  const [feedback, setFeedback] = useState(
    "Arrastra una letra al espacio brillante. También puedes tocarla.",
  );
  const targetZone = useRef<DropZone | undefined>(undefined);
  const level = wordLevels[levelIndex];
  const targetLetter = level.word[placedLetters.length];
  const isComplete = placedLetters.length === level.word.length;

  const resetLevel = useCallback((nextLevel: WordLevel) => {
    setPlacedLetters([]);
    setUsedTiles([]);
    setFeedback(`Forma la palabra de ${nextLevel.emoji}. ${nextLevel.hint}`);
  }, []);

  const advanceLevel = useCallback(() => {
    const nextIndex = (levelIndex + 1) % wordLevels.length;
    setLevelIndex(nextIndex);
    resetLevel(wordLevels[nextIndex]);
  }, [levelIndex, resetLevel]);

  const placeTile = useCallback(
    (tileIndex: number) => {
      if (isComplete || usedTiles.includes(tileIndex)) return;

      const selectedLetter = level.letters[tileIndex];
      speak(selectedLetter);

      if (selectedLetter !== targetLetter) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setFeedback(
          `Escuchaste ${selectedLetter}. Busca la letra ${targetLetter}.`,
        );
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const nextPlacedLetters = [...placedLetters, selectedLetter];
      setPlacedLetters(nextPlacedLetters);
      setUsedTiles((current) => [...current, tileIndex]);

      if (nextPlacedLetters.length === level.word.length) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        speak(level.word);
        setFeedback(
          `¡Excelente! Formaste ${level.word} con las letras ${level.word.split("").join(", ")}.`,
        );
      } else {
        setFeedback(`¡Muy bien! Colocaste la letra ${selectedLetter}.`);
      }
    },
    [isComplete, level, placedLetters, targetLetter, usedTiles],
  );

  const handleDrop = useCallback(
    (tileIndex: number, pageX: number, pageY: number) => {
      const zone = targetZone.current;
      const droppedOnTarget =
        zone &&
        pageX >= zone.x &&
        pageX <= zone.x + zone.width &&
        pageY >= zone.y &&
        pageY <= zone.y + zone.height;

      if (droppedOnTarget) {
        placeTile(tileIndex);
      } else {
        setFeedback("Suelta la letra en el espacio brillante.");
      }
    },
    [placeTile],
  );

  const measureTarget = (event: LayoutChangeEvent) => {
    event.currentTarget.measureInWindow((x, y, width, height) => {
      targetZone.current = { x, y, width, height };
    });
  };

  return (
    <View style={styles.game}>
      <View style={styles.progressRow}>
        <Text style={styles.levelPill}>{level.difficulty}</Text>
        <Text style={styles.progressText}>
          Palabra {levelIndex + 1} de {wordLevels.length}
        </Text>
      </View>

      <View style={styles.pictureCard}>
        <Text accessibilityLabel={level.word} style={styles.emoji}>
          {level.emoji}
        </Text>
        <Text style={styles.hint}>{level.hint}</Text>
      </View>

      <Text accessibilityLiveRegion="polite" style={styles.instruction}>
        {feedback}
      </Text>

      <View style={styles.wordSlots}>
        {level.word.split("").map((letter, index) => {
          const placedLetter = placedLetters[index];
          const isTarget = index === placedLetters.length && !isComplete;
          return (
            <View
              key={`${letter}-${index}`}
              onLayout={isTarget ? measureTarget : undefined}
              style={[
                styles.slot,
                isTarget && styles.targetSlot,
                placedLetter && styles.filledSlot,
              ]}
            >
              <Text style={styles.slotText}>{placedLetter ?? ""}</Text>
            </View>
          );
        })}
      </View>

      {isComplete ? (
        <Pressable
          accessibilityRole="button"
          onPress={advanceLevel}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>Siguiente palabra ✨</Text>
        </Pressable>
      ) : (
        <View style={styles.tileGrid}>
          {level.letters.map((letter, index) => (
            <LetterTile
              key={`${letter}-${index}`}
              index={index}
              letter={letter}
              used={usedTiles.includes(index)}
              onDrop={handleDrop}
              onSelect={placeTile}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  game: { width: "100%", gap: 18 },
  progressRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelPill: {
    backgroundColor: "#E8DDFF",
    borderRadius: 999,
    color: "#522B8E",
    fontSize: 14,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  progressText: { color: "#655B73", fontSize: 14, fontWeight: "700" },
  pictureCard: {
    alignItems: "center",
    backgroundColor: "#FFF7D9",
    borderRadius: 28,
    padding: 20,
  },
  emoji: { fontSize: 88 },
  hint: {
    color: "#473D51",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  instruction: {
    color: "#4E4260",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    minHeight: 44,
    textAlign: "center",
  },
  wordSlots: { flexDirection: "row", gap: 10, justifyContent: "center" },
  slot: {
    alignItems: "center",
    backgroundColor: "#F4F0F8",
    borderColor: "#D5CBDD",
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 2,
    height: 62,
    justifyContent: "center",
    width: 56,
  },
  targetSlot: {
    backgroundColor: "#FFF0A8",
    borderColor: "#F0A800",
    transform: [{ scale: 1.06 }],
  },
  filledSlot: {
    backgroundColor: "#DFF8E7",
    borderColor: "#3BAF68",
    borderStyle: "solid",
  },
  slotText: { color: "#32253F", fontSize: 34, fontWeight: "900" },
  tileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  tileWrapper: { zIndex: 2 },
  letterTile: {
    alignItems: "center",
    backgroundColor: "#7A4CC2",
    borderBottomColor: "#4D2789",
    borderBottomWidth: 5,
    borderRadius: 18,
    height: 64,
    justifyContent: "center",
    width: 62,
  },
  tileText: { color: "#FFFFFF", fontSize: 34, fontWeight: "900" },
  nextButton: {
    alignItems: "center",
    backgroundColor: "#2FA866",
    borderBottomColor: "#167A43",
    borderBottomWidth: 5,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  nextButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
});
