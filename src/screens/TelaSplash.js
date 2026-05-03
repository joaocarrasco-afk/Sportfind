import { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { colors } from '../../style/tokens';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('../../assets/logo.png')}
        resizeMode="contain"
        style={{ width: 220, height: 220, marginBottom: 20 }}
      />
      <Text style={{ fontSize: 26, fontWeight: '800', color: '#1a1f3a', marginBottom: 8 }}>SportFind</Text>
      <Text style={{ fontSize: 14, color: '#757575', marginBottom: 32, paddingHorizontal: 24, textAlign: 'center' }}>
        SportFind te mostra o Caminho
      </Text>

      <View style={{ width: '70%', maxWidth: 280, height: 5, backgroundColor: '#000', borderRadius: 4, overflow: 'hidden' }}>
        <View
          style={{
            height: '100%',
            width: `${progress}%`,
            borderRadius: 4,
            backgroundColor: colors.purple,
          }}
        />
      </View>
    </SafeAreaView>
  );
}
