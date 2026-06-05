import { useState } from 'react';
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import styles from '../../style';
import { useAppState } from '../state/AppStateContext';

// Rota para acessar a API
//Para funcionar tem que colocar ip da maquina 


export default function TelaLogin({ navigation }) {
  const { setAuthUid, setUsername } = useAppState();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Função para autenticar o usuário
  async function Entrar() {
    //Tenta enviar os dados no formato JSON
    try{
      // Envia a requisição usando o método POST
      const res = await fetch(`${process.env.API_URL}/usuario/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: identifier,
          senha: password
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      // Verifica se a API retornou erro de autenticação
      if (!res.ok) {
        const errorMessage = data?.mensagem || 'Email ou senha inválidos';
        alert(errorMessage);
        return;
      }

      // Verifica se o login retornou um identificador válido
      if (!data?.uid) {
        alert('Resposta de login inválida. Tente novamente.');
        return;
      }

      setAuthUid(data.uid);
      if (data.username) setUsername(data.username);
      navigation.replace('AppTabs');
    }catch(error){
      // Trata erros de rede ou falhas inesperadas na requisição
      console.log('Erro ao entrar na conta:', error);
      alert('Erro ao entrar na conta');
    } 
  }

  return (
    <SafeAreaView style={styles.authScreen}>
      
      <View style={styles.authCenter}>
        <Image
          source={require('../../assets/logo.png')}
          resizeMode="contain"
          style={{ width: 200, height: 200, marginBottom: 14 }}
        />
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>Bem vindo</Text>
          <Text style={styles.authSubtitle}>Entre com sua conta</Text>

          <TextInput
            style={styles.authInput}
            placeholder="Email / usuário / telefone"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            textContentType="username"
          />

          <TextInput
            style={styles.authInput}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            textContentType="password"
          />

          <TouchableOpacity style={styles.authButton} onPress={Entrar}>
            <Text style={styles.authButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.authLinks}>
            <TouchableOpacity onPress={() => navigation.navigate ('TelaSenha')}>
              <Text style={styles.authLink}>Esqueceu a senha</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('TelaCadastro')}>
              <Text style={styles.authLink}>Cadastrar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

