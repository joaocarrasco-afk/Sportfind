import { use, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import styles from '../../style';
import { useAppState } from '../state/AppStateContext';

export default function TelaCadastro({ navigation }) {
  const { setAuthUid } = useAppState();
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [phone,setPhone] = useState('');




 
  async function GravarUsuario() {
    try {
      // Envia a requisição usando o método POST
      const res = await fetch(`${process.env.API_URL}/usuario/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({          
          nome: fullName,
          username: username,
          email: contact,
          senha: password,
          data_nascimento: birthDate 
          
         }),
      });
      //Arguarda a resposta em json para pode proseguir
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      // Verifica a resposta do JSON
      if (!res.ok) {
        const errorMessage = data?.resultado || '';
        Alert.alert("", errorMessage);
        return;
      }
      // Verifica se o cadastro retornou um identificador válido
      if (!data?.uid) {
        alert('Resposta de cadastro inválidosenah. Tente novamente.');
        return;
      }
      setAuthUid(data.uid);
      alert('Usuário gravado com sucesso');
      navigation.replace('AppTabs');
      // Se ocorrer erro ao gravar o usuário
    } catch (error) {
      console.error('Erro ao gravar usuário:', error);
      alert('Erro ao gravar usuárioaaa');
  }
}

  return (
    <SafeAreaView style={styles.authScreen}>
      <View style={styles.authCenter}>
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>Cadastrar</Text>
          <Text style={styles.authSubtitle}>Crie sua conta</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.authInput}
              placeholder="Número / e-mail"
              value={contact}
              onChangeText={setContact}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.authInput}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />

            <TextInput
              style={styles.authInput}
              placeholder="Data de nascimento (DD/MM/AAAA)"
              value={birthDate}
              onChangeText={setBirthDate}
              keyboardType="number-pad"
            />

            <TextInput
              style={styles.authInput}
              placeholder="Nome completo"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
            />

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
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
// navigation.goBack()

