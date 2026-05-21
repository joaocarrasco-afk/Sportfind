import { Ionicons } from '@expo/vector-icons';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../style';
import { colors } from '../../style/tokens';

const OPCOES = [
  {
    id: 'local',
    icon: 'location',
    title: 'Cadastrar local',
    hint: 'Adicione parques, quadras ou arenas à comunidade.',
  },
  {
    id: 'partida',
    icon: 'football',
    title: 'Abrir partida',
    hint: 'Organize peladas e campeonatos abertos.',
  },
];

export default function TelaCriar() {
  const navigation = useNavigation();

  function aoEscolher(opcao) {
    if (opcao.id === 'local') {
      navigation.navigate('TelaCriarLocal');
      return;
    }
    if (opcao.id === 'partida') {
      navigation.navigate('TelaCriarPartida');
      return;
    }
    Alert.alert('Em breve', `${opcao.title} estará disponível na próxima versão.`);
  }

  return (
    <SafeAreaView style={styles.createScreen}>
      <ScrollView contentContainerStyle={styles.createScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.createHero}>
          <View style={styles.createMascotCircle}>
            <Ionicons name="paw" size={48} color={colors.purple} />
          </View>
          <Text style={styles.createTitle}>O que você quer criar?</Text>
          <Text style={styles.createSubtitle}>
            Explore, cadastre e conecte a comunidade esportiva do Sportfind.
          </Text>
        </View>

        {OPCOES.map((opcao) => (
          <TouchableOpacity
            key={opcao.id}
            style={styles.createOptionCard}
            activeOpacity={0.85}
            onPress={() => aoEscolher(opcao)}
          >
            <View style={styles.createOptionIconWrap}>
              <Ionicons name={opcao.icon} size={24} color={colors.purple} />
            </View>
            <View style={styles.createOptionTextBlock}>
              <Text style={styles.createOptionTitle}>{opcao.title}</Text>
              <Text style={styles.createOptionHint}>{opcao.hint}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.purple} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.createPrimaryBtn}
          activeOpacity={0.9}
          onPress={() => aoEscolher(OPCOES[0])}
        >
          <Text style={styles.createPrimaryBtnText}>Começar agora</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
