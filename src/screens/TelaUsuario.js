import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../style';
import { useAppState } from '../state/AppStateContext';

const ABAS = [
  { id: 'pub', label: 'Publicações' },
  { id: 'trophy', label: 'Troféus' },
  { id: 'liked', label: 'Curtidos' },
];

const API_URL = 'http://192.168.15.85:3000';





export default function TelaUsuario() {
  const navigation = useNavigation();
  const [aba, setAba] = useState('pub');
  const [cfgAberto, setCfgAberto] = useState(false);
  const { authUid } = useAppState();
  const [carregando, setCarregando] = useState(!!authUid);
  const [username, setUsername] = useState();

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
          
        } catch(error) {
          data = null;
          alert(error)
        }
        if (cancelado) return;
  
        if (!res.ok) {
          Alert.alert('Perfil', data?.messagem || data?.mensagem || 'Não foi possível carregar o perfil.');
          return;
        }
        
        if (data?.username != null){ 
          setUsername(data.username)
        };
        alert( 'teste');
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





  function irConfig(rota) {
    setCfgAberto(false);
    navigation.navigate(rota);
  }

  return (
    <SafeAreaView style={styles.usuarioScreen}>
      <ScrollView>
        <View style={styles.usuarioTopRow}>
          <TouchableOpacity style={styles.usuarioIconBtn} onPress={() => {}}>
            <Text style={styles.usuarioIconBtnTextPlus}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.usuarioIconBtn} onPress={() => setCfgAberto(true)}>
            <Text style={styles.usuarioIconBtnTextMenu}>☰</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.usuarioAvatarWrap}>
          <View>
            <View style={styles.usuarioAvatar}>
              <Text style={styles.usuarioAvatarEmoji}>👤</Text>
            </View>
            <TouchableOpacity style={styles.usuarioEditBadge} onPress={() => {}}>
              <Text style={styles.usuarioEditIcon}>✎</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.usuarioName}>{username}</Text>
        <View style={styles.usuarioLocationRow}>
          <Text style={styles.usuarioLocationText}>📍 São Paulo, Brasil</Text>
        </View>

        <View style={styles.usuarioTagsRow}>
          {['Skate', 'Basquete', 'Futebol'].map((t) => (
            <View key={t} style={styles.usuarioTagPill}>
              <Text style={styles.usuarioTagText}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.usuarioStatsRow}>
          <View style={styles.usuarioStatBlock}>
            <Text style={styles.usuarioStatValue}>122</Text>
            <Text style={styles.usuarioStatLabel}>Seguidores</Text>
          </View>
          <View style={styles.usuarioStatBlock}>
            <Text style={styles.usuarioStatValue}>91</Text>
            <Text style={styles.usuarioStatLabel}>Seguindo</Text>
          </View>
        </View>

        <View style={styles.usuarioTrophyBox}>
          <Text style={styles.usuarioTrophyEmoji}>🏆</Text>
          <Text style={styles.usuarioTrophyLabel}>Troféu</Text>
        </View>

        <View style={styles.usuarioTabBar}>
          {ABAS.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.usuarioTabBtn, aba === t.id && styles.usuarioTabBtnActive]}
              onPress={() => setAba(t.id)}
            >
              <Text style={[styles.usuarioTabText, aba === t.id && styles.usuarioTabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.usuarioFeedSection}>
          {aba === 'pub' ? (
            <>
              <View style={styles.usuarioFeedGrid}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <View key={i} style={styles.usuarioFeedCell}>
                    <Text style={styles.usuarioFeedCellX}>✕</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.usuarioFeedCaption}>Imagens do feed do usuário</Text>
            </>
          ) : (
            <View style={styles.usuarioEmptyTab}>
              <Text style={styles.usuarioEmptyTabText}>
                {aba === 'trophy' ? 'Troféus aparecerão aqui.' : 'Posts curtidos aparecerão aqui.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={cfgAberto} transparent animationType="fade" onRequestClose={() => setCfgAberto(false)}>
        <View style={styles.perfilModalRoot}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.perfilModalBackdrop}
            onPress={() => setCfgAberto(false)}
          />
          <View style={styles.perfilModalCard}>
            <Text style={styles.perfilModalTitle}>Configurações e preferências</Text>
            <Text style={styles.perfilModalSubtitle}>Escolha uma opção abaixo.</Text>

            <TouchableOpacity style={styles.perfilModalRow} onPress={() => irConfig('TelaConta')} activeOpacity={0.8}>
              <Text style={styles.perfilModalRowTitle}>Conta</Text>
              <Text style={styles.perfilModalRowHint}>Dados cadastrados, senha e exclusão</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.perfilModalRow}
              onPress={() => irConfig('TelaPreferencias')}
              activeOpacity={0.8}
            >
              <Text style={styles.perfilModalRowTitle}>Preferências</Text>
              <Text style={styles.perfilModalRowHint}>Notificações e tema</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.perfilModalRow}
              onPress={() => irConfig('TelaPrivacidade')}
              activeOpacity={0.8}
            >
              <Text style={styles.perfilModalRowTitle}>Privacidade</Text>
              <Text style={styles.perfilModalRowHint}>Política, termos e LGPD</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.perfilModalCloseBtn} onPress={() => setCfgAberto(false)}>
              <Text style={styles.perfilModalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
