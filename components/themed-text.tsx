import { StyleSheet, Text, type TextProps } from 'react-native';

import { useColorScheme } from '../hooks/use-color-scheme';

type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? darkColor ?? '#ECEDEE' : lightColor ?? '#11181C';

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  link: {
    color: '#0a7ea4',
    fontSize: 16,
    lineHeight: 30,
  },
});
