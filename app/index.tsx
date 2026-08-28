import { Link } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { useAlphabet } from '../src/features/alphabet/hooks/useAphabet';

export default function HomeScreen() {
  const { currentIndex, currentLetter, goToLetter, isFirst, isLast, letters, nextLetter, previousLetter } = useAlphabet();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>ABC LEARNING</Text>
        <Text style={styles.title}>Aprendemos letras</Text>
        <Text style={styles.subtitle}>Elige una letra y descubre palabras divertidas.</Text>

        <View accessibilityLabel={`Letra ${currentLetter.letter}`} style={[styles.featuredCard, { backgroundColor: currentLetter.color }]}>
          <View>
            <Text style={styles.letter}>{currentLetter.uppercase}</Text>
            <Text style={styles.lowercase}>{currentLetter.lowercase}</Text>
          </View>
          <View style={styles.featuredText}>
            <Text style={styles.pronunciation}>Se llama “{currentLetter.pronunciation}”</Text>
            <View style={styles.exampleRow}>
              {currentLetter.examples.map((example) => (
                <View key={example.word} style={styles.example}>
                  <Text style={styles.exampleEmoji}>{example.emoji}</Text>
                  <Text style={styles.exampleWord}>{example.word}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.navigationRow}>
          <Pressable accessibilityRole="button" disabled={isFirst} onPress={previousLetter} style={[styles.navigationButton, isFirst && styles.disabledButton]}>
            <Text style={styles.navigationText}>← Anterior</Text>
          </Pressable>
          <Text style={styles.counter}>{currentIndex + 1} de 27</Text>
          <Pressable accessibilityRole="button" disabled={isLast} onPress={nextLetter} style={[styles.navigationButton, isLast && styles.disabledButton]}>
            <Text style={styles.navigationText}>Siguiente →</Text>
          </Pressable>
        </View>

        <Link accessibilityRole="button" href="/game" style={styles.gameLink}>
          <Text style={styles.gameLinkText}>Jugar a formar palabras ✨</Text>
        </Link>

        <Text style={styles.gridTitle}>Todas las letras</Text>
        <View style={styles.letterGrid}>
          {letters.map((letter, index) => {
            return (
              <Pressable
                accessibilityLabel={`Ver letra ${letter.letter}`}
                accessibilityRole="button"
                key={index}
                onPress={() => goToLetter(index)}
                style={[styles.letterCard, index === currentIndex && { backgroundColor: letter.color, borderColor: '#2F223B' }]}>
                <Text style={styles.letterCardText}>{letter.letter}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFCF7' },
  content: { padding: 20, paddingBottom: 36 },
  eyebrow: { color: '#7A4CC2', fontSize: 13, fontWeight: '900', letterSpacing: 1.3, marginBottom: 6 },
  title: { color: '#2F223B', fontSize: 32, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { color: '#655B73', fontSize: 16, lineHeight: 22, marginBottom: 20, marginTop: 6 },
  featuredCard: { alignItems: 'center', borderRadius: 28, flexDirection: 'row', gap: 18, padding: 20 },
  letter: { color: '#2F223B', fontSize: 76, fontWeight: '900', lineHeight: 78 },
  lowercase: { color: '#2F223B', fontSize: 30, fontWeight: '800', textAlign: 'center' },
  featuredText: { flex: 1 },
  pronunciation: { color: '#2F223B', fontSize: 17, fontWeight: '800', marginBottom: 12 },
  exampleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  example: { alignItems: 'center', backgroundColor: '#FFFFFF99', borderRadius: 12, flexDirection: 'row', gap: 4, paddingHorizontal: 8, paddingVertical: 6 },
  exampleEmoji: { fontSize: 20 },
  exampleWord: { color: '#2F223B', fontSize: 12, fontWeight: '700' },
  navigationRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  navigationButton: { backgroundColor: '#E8DDFF', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  disabledButton: { opacity: 0.4 },
  navigationText: { color: '#522B8E', fontSize: 13, fontWeight: '800' },
  counter: { color: '#655B73', fontSize: 14, fontWeight: '800' },
  gameLink: { backgroundColor: '#2FA866', borderBottomColor: '#167A43', borderBottomWidth: 4, borderRadius: 18, marginTop: 24, padding: 16, textAlign: 'center' },
  gameLinkText: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  gridTitle: { color: '#2F223B', fontSize: 21, fontWeight: '900', marginBottom: 12, marginTop: 28 },
  letterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  letterCard: { alignItems: 'center', backgroundColor: '#F4F0F8', borderColor: '#E2D9E8', borderRadius: 16, borderWidth: 2, height: 54, justifyContent: 'center', width: 54 },
  letterCardText: { color: '#2F223B', fontSize: 25, fontWeight: '900' },
});
