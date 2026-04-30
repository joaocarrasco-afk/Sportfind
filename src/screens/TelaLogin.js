import { useState } from 'react';
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../style';

export default function TelaLogin({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

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

          <TouchableOpacity style={styles.authButton} onPress={() => navigation.replace('AppTabs')}>
            <Text style={styles.authButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.authLinks}>
            <TouchableOpacity onPress={() => {}}>
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

