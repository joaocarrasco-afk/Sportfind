import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import AuthHero from '../components/AuthHero';
import AuthKeyboardScreen from '../components/AuthKeyboardScreen';
import styles from '../../style';

export default function TelaSenha({ navigation }) {
  const [email, setEmail] = useState('');

  async function linkRedefinirSenha() {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuario/redefinirsenha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      alert('E-mail enviado com sucesso! Verifique o seu e-mail');
    } catch (error) {
      console.log('Erro ao enviar o link', error);
      alert('Erro ao enviar o link');
    }
  }

  return (
    <AuthKeyboardScreen
      header={
        <AuthHero
          logoSource={require('../../assets/logoesqueci.png')}
          subtitle="Recupere o acesso à sua conta"
        />
      }
    >
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>Encontre sua conta</Text>
        <Text style={styles.authSubtitle}>
          Insira seu e-mail ou número de celular cadastrado
        </Text>

        <Text style={styles.createLocalFieldLabel}>E-mail ou telefone</Text>
        <TextInput
          style={styles.createLocalInput}
          placeholder="E-mail ou telefone"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          textContentType="username"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.authHint}>
          Enviaremos um código para seu e-mail ou número de celular.
        </Text>

        <TouchableOpacity style={styles.authButton} onPress={linkRedefinirSenha} activeOpacity={0.85}>
          <Text style={styles.authButtonText}>Continuar</Text>
        </TouchableOpacity>

        <View style={styles.authLinks}>
          <TouchableOpacity onPress={() => navigation.navigate('TelaLogin')}>
            <Text style={styles.authLink}>Voltar para login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthKeyboardScreen>
  );
}
