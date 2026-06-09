import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    <AuthKeyboardScreen>
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Cadastrar</Text>
        <Text style={styles.authSubtitle}>Crie sua conta</Text>

        <Text style={styles.createLocalFieldLabel}>Email: </Text>
        <TextInput
          style={styles.authInput}
          placeholder="Número / e-mail"
          value={contact}
          onChangeText={setContact}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.createLocalFieldLabel}>Senha: </Text>
        <TextInput
          style={styles.authInput}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        <Text style={styles.createLocalFieldLabel}>Data de nascimento: </Text>
        <TextInput
          style={styles.authInput}
          placeholder="Data de nascimento (DD/MM/AAAA)"
          value={birthDate}
          onChangeText={(texto) => setBirthDate(maskDataNascimento(texto))}
          keyboardType="number-pad"
          maxLength={10}
        />
        <Text style={styles.createLocalFieldLabel}>Nome completo: </Text>
        <TextInput
          style={styles.authInput}
          placeholder="Nome completo"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <Text style={styles.createLocalFieldLabel}>Nome de usuário: </Text>
        <TextInput
          style={styles.authInput}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.authButton} onPress={GravarUsuario}>
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
