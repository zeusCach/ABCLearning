import { View, type ViewProps } from 'react-native';

import { useColorScheme } from '../hooks/use-color-scheme';

type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...rest }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor =
    colorScheme === 'dark' ? darkColor ?? '#151718' : lightColor ?? '#fff';

  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
