import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import AuthHero from '../components/AuthHero';
import AuthKeyboardScreen from '../components/AuthKeyboardScreen';
import styles from '../../style';

export default function TelaNovaSenha({ navigation }) {
  const [newpassword, setNewPassword] = useState('');

  return (
    <AuthKeyboardScreen
      header={
        <AuthHero
          logoSource={require('../../assets/logoesqueci.png')}
          subtitle="Defina uma nova senha segura"
        />
      }
    >
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Nova senha</Text>
        <Text style={styles.authSubtitle}>Digite sua nova senha abaixo</Text>

        <Text style={styles.createLocalFieldLabel}>Senha</Text>
        <TextInput
          style={styles.createLocalInput}
          placeholder="Nova senha"
          placeholderTextColor="#999"
          value={newpassword}
          onChangeText={setNewPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.authButton}
          onPress={() => navigation.navigate('TelaLogin')}
          activeOpacity={0.85}
        >
          <Text style={styles.authButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </AuthKeyboardScreen>
  );
}
