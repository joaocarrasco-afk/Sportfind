import { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { colors, spacing } from '../../style/tokens';
import styles from '../../style';

const DURATION_MS = 2500;

export default function TelaSplash({ navigation }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / DURATION_MS) * 100));
      if (elapsed >= DURATION_MS) {
        clearInterval(id);
        navigation.replace('TelaLogin');
      }
    }, 32);

    return () => clearInterval(id);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.authScreen}>
      <View style={[styles.authCenter, { gap: spacing.sm }]}>
        <View style={styles.authLogoCircle}>
          <Image
            source={require('../../assets/logo.png')}
            resizeMode="contain"
            style={styles.authLogo}
          />
        </View>
        <Text style={styles.authBrandTitle}>SportFind</Text>
        <Text style={styles.authBrandSubtitle}>SportFind te mostra o caminho</Text>

        <View
          style={{
            width: '70%',
            maxWidth: 280,
            height: 5,
            backgroundColor: colors.border,
            borderRadius: 4,
            overflow: 'hidden',
            marginTop: spacing.xl,
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${progress}%`,
              borderRadius: 4,
              backgroundColor: colors.purple,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
