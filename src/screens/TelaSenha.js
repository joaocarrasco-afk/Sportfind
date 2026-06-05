import { useState } from 'react';
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../style';



export default function TelaSenha ({ navigation }) {

  const [email, setEmail] = useState('');

  //função para manda o link para redefinir a senha
  async function linkRedefinirSenha() {
    try{
      // Envia a requisição usando o método POST
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuario/redefinirsenha`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          
        }),
        
      });
      alert('E-mail enviado com sucesso! Verifique o seu e-mail');
      //Se ocorrer um erro ao enviar o email
    }catch(error){
      console.log('Erro ao enviar o link', error);
      alert('Erro ao enviar o link')

    }
  }




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
            placeholder="Email / telefone"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            textContentType="username"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.authSubtitle}>Enviaremos um código para seu email ou número de celular.</Text>
          <TouchableOpacity style={styles.authButton} onPress={linkRedefinirSenha}>
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