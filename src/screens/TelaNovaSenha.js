import { useState } from 'react';
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../style';

export default function TelaNovaSenha ({ navigation }) {

    const [newpassword, setNewPassword] = useState('');

return (
    <SafeAreaView style={styles.authScreen}>
      <View style={styles.authCenter}>
        <Image
          source={require('../../assets/logoesqueci.png')}
          resizeMode="contain"
          style={{ width: 200, height: 200, marginBottom: 14 }}
        />
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>Digite sua nova senha</Text>
          <TextInput
              style={styles.authInput}
              placeholder="Senha"
              value={newpassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />


          <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('TelaLogin')}>
            <Text style={styles.authButtonText}>Confirmar</Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}