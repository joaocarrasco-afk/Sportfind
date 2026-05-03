import { useState } from 'react';
import { SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../style';

export default function TelaPreferencias() {
  const [pushLocais, setPushLocais] = useState(true);
  const [pushSocial, setPushSocial] = useState(true);
  const [pushMarketing, setPushMarketing] = useState(false);
  const [emailResumo, setEmailResumo] = useState(false);
  const [tema, setTema] = useState('claro'); // apenas estado local até tema global existir

  return (
    <SafeAreaView style={styles.usuarioScreen}>
      <ScrollView contentContainerStyle={styles.perfilScreenScroll}>
        <Text style={styles.perfilSectionTitle}>Notificações</Text>

        <View style={styles.perfilPrefRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.perfilPrefRowText}>Novos locais perto de você</Text>
            <Text style={styles.perfilPrefSub}>Alertas quando houver lugares próximos</Text>
          </View>
          <Switch value={pushLocais} onValueChange={setPushLocais} trackColor={{ false: '#ccc', true: '#c4a3e0' }} />
        </View>

        <View style={styles.perfilPrefRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.perfilPrefRowText}>Seguidores e curtidas</Text>
            <Text style={styles.perfilPrefSub}>Atividade na sua conta</Text>
          </View>
          <Switch value={pushSocial} onValueChange={setPushSocial} trackColor={{ false: '#ccc', true: '#c4a3e0' }} />
        </View>

        <View style={styles.perfilPrefRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.perfilPrefRowText}>Recomendações e novidades Sportfind</Text>
            <Text style={styles.perfilPrefSub}>Lançamentos e dicas ocasionais</Text>
          </View>
          <Switch
            value={pushMarketing}
            onValueChange={setPushMarketing}
            trackColor={{ false: '#ccc', true: '#c4a3e0' }}
          />
        </View>

        <View style={styles.perfilPrefRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.perfilPrefRowText}>Resumo por e-mail</Text>
            <Text style={styles.perfilPrefSub}>Semanal, se houver novidades</Text>
          </View>
          <Switch value={emailResumo} onValueChange={setEmailResumo} trackColor={{ false: '#ccc', true: '#c4a3e0' }} />
        </View>

        <View style={styles.perfilDivider} />

        <Text style={styles.perfilSectionTitle}>Tema do aplicativo</Text>
        <Text style={styles.perfilHint}>Escolha o esquema de cores preferido (aplica quando o tema global existir).</Text>
        <View style={styles.perfilThemeRow}>
          <TouchableOpacity
            style={[styles.perfilThemeChip, tema === 'claro' && styles.perfilThemeChipActive]}
            onPress={() => setTema('claro')}
          >
            <Text style={[styles.perfilThemeChipText, tema === 'claro' && styles.perfilThemeChipTextActive]}>
              Claro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.perfilThemeChip, tema === 'escuro' && styles.perfilThemeChipActive]}
            onPress={() => setTema('escuro')}
          >
            <Text style={[styles.perfilThemeChipText, tema === 'escuro' && styles.perfilThemeChipTextActive]}>
              Escuro
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.perfilDivider} />

        <Text style={styles.perfilHint}>
          Preferências ficam apenas neste dispositivo. Para sincronizar contas futuras, será preciso gravar na API ou na
          nuvem.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
