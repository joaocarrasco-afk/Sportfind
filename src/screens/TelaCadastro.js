import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AuthHero from '../components/AuthHero';
import AuthKeyboardScreen from '../components/AuthKeyboardScreen';
import { maskDataNascimento } from '../utils/masks';
import styles from '../../style';
import { useAppState } from '../state/AppStateContext';

export default function TelaCadastro({ navigation }) {
  const { setAuthUid } = useAppState();
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  async function GravarUsuario() {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuario/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: fullName,
          username: username,
          email: contact,
          senha: password,
          data_nascimento: birthDate,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const errorMessage = data?.resultado || '';
        Alert.alert('', errorMessage);
        return;
      }

      if (!data?.uid) {
        alert('Resposta de cadastro inválidosenah. Tente novamente.');
        return;
      }
      setAuthUid(data.uid);
      alert('Usuário gravado com sucesso');
      navigation.replace('AppTabs');
    } catch (error) {
      console.error('Erro ao gravar usuário:', error);
      alert('Erro ao gravar usuárioaaa');
    }
  }

  return (
    <AuthKeyboardScreen header={<AuthHero subtitle="Junte-se à comunidade esportiva" />}>
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Cadastrar</Text>
        <Text style={styles.authSubtitle}>Preencha seus dados para criar sua conta</Text>

        <Text style={styles.createLocalFieldLabel}>E-mail</Text>
        <TextInput
          style={styles.createLocalInput}
          placeholder="Número ou e-mail"
          placeholderTextColor="#999"
          value={contact}
          onChangeText={setContact}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <Text style={styles.createLocalFieldLabel}>Senha</Text>
        <TextInput
          style={styles.createLocalInput}
          placeholder="Crie uma senha"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />

        <Text style={styles.createLocalFieldLabel}>Data de nascimento</Text>
        <TextInput
          style={styles.createLocalInput}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#999"
          value={birthDate}
          onChangeText={(texto) => setBirthDate(maskDataNascimento(texto))}
          keyboardType="number-pad"
          maxLength={10}
        />

        <Text style={styles.createLocalFieldLabel}>Nome completo</Text>
        <TextInput
          style={styles.createLocalInput}
          placeholder="Seu nome completo"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <Text style={styles.createLocalFieldLabel}>Nome de usuário</Text>
        <TextInput
          style={styles.createLocalInput}
          placeholder="Como você quer ser chamado"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.authButton} onPress={GravarUsuario} activeOpacity={0.85}>
          <Text style={styles.authButtonText}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={styles.authLinks}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.authLink}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthKeyboardScreen>
  );
}
