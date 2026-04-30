import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../style';

export default function TelaCadastro({ navigation }) {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

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

            <TouchableOpacity style={styles.authButton} onPress={() => navigation.replace('AppTabs')}>
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

