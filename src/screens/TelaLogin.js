import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import AuthHero from '../components/AuthHero';
import AuthKeyboardScreen from '../components/AuthKeyboardScreen';
import styles from '../../style';
import { useAppState } from '../state/AppStateContext';

export default function TelaLogin({ navigation }) {
  const { setAuthUid, setUsername } = useAppState();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  async function Entrar() {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuario/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: identifier,
          senha: password,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const errorMessage = data?.mensagem || 'Email ou senha inválidos';
        alert(errorMessage);
        return;
      }

      if (!data?.uid) {
        alert('Resposta de login inválida. Tente novamente.');
        return;
      }

      setAuthUid(data.uid);
      if (data.username) setUsername(data.username);
      navigation.replace('AppTabs');
    } catch (error) {
      console.log('Erro ao entrar na conta:', error);
      alert('Erro ao entrar na conta');
    }
  }

  return (
    <AuthKeyboardScreen
      header={<AuthHero subtitle="SportFind te mostra o caminho" />}
    >
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Bem-vindo</Text>
        <Text style={styles.authSubtitle}>Entre com sua conta para continuar</Text>

        <Text style={styles.createLocalFieldLabel}>Login</Text>
        <TextInput
          style={styles.createLocalInput}
          placeholder="E-mail, usuário ou telefone"
          placeholderTextColor="#999"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          textContentType="username"
        />

        <Text style={styles.createLocalFieldLabel}>Senha</Text>
        <TextInput
          style={styles.createLocalInput}
          placeholder="Sua senha"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        />

        <TouchableOpacity style={styles.authButton} onPress={Entrar} activeOpacity={0.85}>
          <Text style={styles.authButtonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.authLinks}>
          <TouchableOpacity onPress={() => navigation.navigate('TelaSenha')}>
            <Text style={styles.authLink}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('TelaCadastro')}>
            <Text style={styles.authLink}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthKeyboardScreen>
  );
}
