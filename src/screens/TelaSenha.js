import { useState } from 'react';
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../style';

export default function TelaSenha ({ navigation }) {

return (
    <SafeAreaView style={styles.authScreen}>
      <View style={styles.authCenter}>
        <Image
          source={require('../../assets/logoesqueci.png')}
          resizeMode="contain"
          style={{ width: 200, height: 200, marginBottom: 14 }}
        />
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>Encontre sua conta</Text>
          <Text style={styles.authSubtitle}>Insira seu número de celular ou email. </Text>

          <TextInput
            style={styles.authInput}
            placeholder="Email / usuário / telefone"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            textContentType="username"
          />

          <Text style={styles.authSubtitle}>Enviaremos um código para seu email ou número de celular.</Text>
          <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('TelaNovaSenha')}>
            <Text style={styles.authButtonText}>Continuar</Text>
          </TouchableOpacity>

          <View style={styles.authLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('TelaLogin')}>
                <Text style={styles.authLink}>Voltar para login</Text>
            </TouchableOpacity>
        </View>
        </View>

      </View>
    </SafeAreaView>
  );
}