import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">ABC Learning</ThemedText>
      <ThemedText>Bienvenido. Esta pantalla evita el error de ruta inicial faltante.</ThemedText>
      <Link href="/modal" style={styles.link}>
        <ThemedText type="link">Abrir modal</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  link: {
    marginTop: 12,
  },
});
