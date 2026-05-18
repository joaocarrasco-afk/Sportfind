import { useState, useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../../style';
import { useAppState } from '../state/AppStateContext';

/** Dados de demonstração até integrar API */
const inicial = {
  nome: 'João da Silva',
  email: 'joao@email.com',
  username: 'joaosp',
  telefone: '',
};

const API_URL = 'http://10.100.1.177:3000';

export default function TelaConta() {
  const { authUid } = useAppState();
  const [carregando, setCarregando] = useState(!!authUid);
  const [salvando, setSalvando] = useState(false)
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [senhaConfirmar, setSenhaConfirmar] = useState('');

  useEffect(() => {
    let cancelado = false;

    async function carregarPerfil() {
      if (!authUid) {
        setCarregando(false);
        return;
      }

      setCarregando(true);
      try {
        const res = await fetch(
          `${API_URL}/usuario/perfil/${encodeURIComponent(authUid)}`,
          { method: 'GET' },
        );
        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }
        if (cancelado) return;

        if (!res.ok) {
          Alert.alert('Perfil', data?.messagem || data?.mensagem || 'Não foi possível carregar o perfil.');
          return;
        }

        if (data?.username != null){ 
          setUsername(data.username)
        };
        if (data?.nome != null){ 
          setNome(data.nome)
        };
        if (data?.email != null){ 
          setEmail(data.email)
        };

        
      } catch {
        if (!cancelado) {
          Alert.alert('Perfil', 'Erro de rede ao carregar o perfil.');
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarPerfil();
    return () => {
      cancelado = true;
    };
  }, [authUid]);

  async function salvarDados() {
    
    
    setSalvando(true);
    try {
      const res = await fetch(`${API_URL}/usuario/conta/${encodeURIComponent(authUid)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          username: username.trim(),
       
          telefone: telefone.trim(),
         
        }),
      });
      let data = null;
      try {
        data = await res.json();
        alert(data);
      } catch {
        data = null;
      }
      if (!res.ok) {
        Alert.alert('Erro', data?.mensagem || data?.messagem || 'Não foi possível salvar.');
        return;
      }
      if (data?.nome != null){
         setNome(data.nome)
        };
      if (data?.username != null){
         setUsername(data.username)
        };
      if (data?.telefone != null){
         setTelefone(data.telefone)

      };
      Alert.alert('Conta', 'Dados atualizados com sucesso.');
    } catch {
      Alert.alert('Conta', 'Erro de rede ao salvar.');
    } finally {
      setSalvando(false);
    }
  }

  function atualizarSenha() {
    if (!senhaAtual.trim() || !senhaNova.trim()) {
      Alert.alert('Campos incompletos', 'Preencha a senha atual e a nova senha.');
      return;
    }
    if (senhaNova !== senhaConfirmar) {
      Alert.alert('Senhas diferentes', 'A confirmação não coincide com a nova senha.');
      return;
    }
    Alert.alert('Senha', 'Fluxo apenas de interface — nenhuma requisição foi enviada.');
    setSenhaAtual('');
    setSenhaNova('');
    setSenhaConfirmar('');
  }

  function excluirConta() {
    Alert.alert(
      'Excluir conta',
      'Esta ação é permanente. Tem certeza? (Somente demo: nada será apagado no servidor.)',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => Alert.alert('Conta', 'Exclusão simulada. Conecte a API depois.'),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.usuarioScreen}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.perfilScreenScroll}>
        <Text style={styles.perfilSectionTitle}>Seus dados</Text>
        <Text style={styles.perfilFieldLabel}>Nome completo</Text>
        <TextInput style={styles.authInput} value={nome} onChangeText={setNome} placeholder="Nome" />

        <Text style={styles.perfilFieldLabel}>E-mail</Text>
        <TextInput
          style={styles.authInput}
          value={email}
          onChangeText={setEmail}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.perfilFieldLabel}>Nome de usuário</Text>
        <TextInput style={styles.authInput} value={username} onChangeText={setUsername} autoCapitalize="none" />

        <Text style={styles.perfilFieldLabel}>Telefone</Text>
        <TextInput
          style={styles.authInput}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="DDD + número"
          keyboardType="phone-pad"
        />

        <Text style={styles.perfilHint}>
          Complete ou atualize suas informações. Os dados ficam apenas neste aparelho até você ligar o backend.
        </Text>

        <TouchableOpacity style={styles.perfilPrimaryBtn} onPress={salvarDados}>
          <Text style={styles.perfilPrimaryBtnText}>Salvar alterações</Text>
        </TouchableOpacity>

        <View style={styles.perfilDivider} />

        <Text style={styles.perfilSectionTitle}>Senha</Text>
        <Text style={styles.perfilFieldLabel}>Senha atual</Text>
        <TextInput style={styles.authInput} secureTextEntry value={senhaAtual} onChangeText={setSenhaAtual} />

        <Text style={styles.perfilFieldLabel}>Nova senha</Text>
        <TextInput style={styles.authInput} secureTextEntry value={senhaNova} onChangeText={setSenhaNova} />

        <Text style={styles.perfilFieldLabel}>Confirmar nova senha</Text>
        <TextInput style={styles.authInput} secureTextEntry value={senhaConfirmar} onChangeText={setSenhaConfirmar} />

        <TouchableOpacity style={styles.perfilPrimaryBtn} onPress={atualizarSenha}>
          <Text style={styles.perfilPrimaryBtnText}>Alterar senha</Text>
        </TouchableOpacity>

        <View style={styles.perfilDivider} />

        <Text style={styles.perfilSectionTitle}>Zona de risco</Text>
        <Text style={styles.perfilHint}>Remover conta e dados associados. Irreversível após confirmar na API.</Text>
        <TouchableOpacity style={styles.perfilDangerBtn} onPress={excluirConta}>
          <Text style={styles.perfilDangerBtnText}>Excluir minha conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
