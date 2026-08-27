import { SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';

import { WordBuilderGame } from '../src/features/word-builder/components/WordBuilderGame';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.eyebrow}>ABC LEARNING</Text>
      <Text style={styles.title}>Construye palabras</Text>
      <Text style={styles.subtitle}>Toca o arrastra las letras para formar la palabra.</Text>
      <WordBuilderGame />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF7',
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  eyebrow: {
    color: '#7A4CC2',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: 6,
  },
  title: {
    color: '#2F223B',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: '#655B73',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 6,
  },
});
