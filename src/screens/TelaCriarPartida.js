import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../style';
import { colors, spacing } from '../../style/tokens';
import { CREATABLE_SPORTS, formatPartidaData, placeSupportsSport } from '../domain/places';
import { useAppState } from '../state/AppStateContext';

export default function TelaCriarPartida() {
  const navigation = useNavigation();
  const { places, addPartida, username } = useAppState();

  const [esporte, setEsporte] = useState('');
  const [nomePartida, setNomePartida] = useState('');
  const [dataPartida, setDataPartida] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2, 0, 0, 0);
    return d;
  });
  const [mostrarDataPicker, setMostrarDataPicker] = useState(false);
  /** Android: 'date' | 'time' — não usar mode datetime (não suportado e causa crash). */
  const [pickerAndroid, setPickerAndroid] = useState(null);
  const [buscaLocal, setBuscaLocal] = useState('');
  const [localSelecionadoId, setLocalSelecionadoId] = useState(null);
  const [maxParticipantes, setMaxParticipantes] = useState(10);
  const [limiteParticipantes, setLimiteParticipantes] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const dadosPreenchidos = Boolean(esporte && nomePartida.trim() && dataPartida);

  const locaisFiltrados = useMemo(() => {
    if (!esporte) return [];
    const termo = buscaLocal.trim().toLowerCase();
    return places.filter((place) => {
      if (!placeSupportsSport(place, esporte)) return false;
      if (!termo) return true;
      const nome = place.name?.toLowerCase() ?? '';
      const endereco = place.address?.toLowerCase() ?? '';
      return nome.includes(termo) || endereco.includes(termo);
    });
  }, [places, esporte, buscaLocal]);

  function abrirSeletorData() {
    if (Platform.OS === 'android') {
      setPickerAndroid('date');
      return;
    }
    setMostrarDataPicker(true);
  }

  function onMudarDataIos(event, selected) {
    if (event?.type === 'dismissed') return;
    if (selected instanceof Date && !Number.isNaN(selected.getTime())) {
      setDataPartida(selected);
    }
  }

  function onMudarDataAndroid(event, selected) {
    const modo = pickerAndroid;
    setPickerAndroid(null);

    if (!event || event.type === 'dismissed' || !selected) {
      return;
    }

    const next = new Date(dataPartida);
    if (modo === 'date') {
      next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      setDataPartida(next);
      setTimeout(() => setPickerAndroid('time'), 0);
      return;
    }
    if (modo === 'time') {
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setDataPartida(next);
    }
  }

  function onMudarDataWeb(texto) {
    const partes = texto.trim().split('T');
    if (partes.length < 2) return;
    const [ano, mes, dia] = partes[0].split('-').map(Number);
    const [hora, minuto] = partes[1].split(':').map(Number);
    const parsed = new Date(ano, mes - 1, dia, hora, minuto);
    if (!Number.isNaN(parsed.getTime())) {
      setDataPartida(parsed);
    }
  }

  function salvar() {
    if (!esporte) {
      Alert.alert('Esporte obrigatório', 'Selecione o esporte da partida.');
      return;
    }
    if (!nomePartida.trim()) {
      Alert.alert('Nome obrigatório', 'Informe o nome da partida.');
      return;
    }
    if (!localSelecionadoId) {
      Alert.alert('Local obrigatório', 'Escolha onde a partida vai acontecer.');
      return;
    }
    if (dataPartida.getTime() < Date.now()) {
      Alert.alert('Data inválida', 'A partida precisa ser em uma data futura.');
      return;
    }

    setSalvando(true);
    try {
      const criada = addPartida({
        nome: nomePartida,
        esporte,
        data: dataPartida,
        placeId: localSelecionadoId,
        maxParticipantes: limiteParticipantes ? maxParticipantes : null,
        autorUsername: username,
      });

      if (!criada) {
        Alert.alert('Erro', 'Não foi possível salvar a partida.');
        return;
      }

      Alert.alert(
        'Partida criada!',
        'A partida foi publicada no feed. Outros usuários podem participar pelo botão Participar.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } finally {
      setSalvando(false);
    }
  }

  const podeSalvar =
    dadosPreenchidos && localSelecionadoId != null && !salvando && dataPartida.getTime() >= Date.now();

  return (
    <SafeAreaView style={styles.createLocalScreen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.createLocalHeader}>
          <TouchableOpacity
            style={styles.createLocalBackBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={22} color={colors.purple} />
          </TouchableOpacity>
          <Text style={styles.createLocalHeaderTitle}>Abrir partida</Text>
          <View style={styles.createLocalHeaderSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.createLocalScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text style={styles.createLocalFieldLabel}>Esporte</Text>
            <View style={styles.createLocalChipRow}>
              {CREATABLE_SPORTS.map((sport) => {
                const ativo = esporte === sport.id;
                return (
                  <TouchableOpacity
                    key={sport.id}
                    style={[styles.createLocalChip, ativo && styles.createLocalChipActive]}
                    onPress={() => {
                      setEsporte(sport.id);
                      setLocalSelecionadoId(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 16 }}>{sport.emoji}</Text>
                    <Text
                      style={[
                        styles.createLocalChipLabel,
                        ativo && styles.createLocalChipLabelActive,
                      ]}
                    >
                      {sport.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={styles.createLocalFieldLabel}>Nome da partida</Text>
            <TextInput
              style={styles.createLocalInput}
              placeholder="Ex.: Pelada de sábado"
              placeholderTextColor={colors.textSecondary}
              value={nomePartida}
              onChangeText={setNomePartida}
            />
          </View>

          <View>
            <Text style={styles.createLocalFieldLabel}>Limite de participantes</Text>
            <TouchableOpacity
              style={styles.createLocalChip}
              onPress={() => setLimiteParticipantes((v) => !v)}
              activeOpacity={0.8}
            >
              <Text style={styles.createLocalChipLabel}>
                {limiteParticipantes ? 'Com limite de vagas' : 'Sem limite de vagas'}
              </Text>
            </TouchableOpacity>
            {limiteParticipantes ? (
              <View style={styles.createPartidaLimiteRow}>
                <TouchableOpacity
                  style={styles.createPartidaLimiteBtn}
                  onPress={() => setMaxParticipantes((n) => Math.max(2, n - 1))}
                >
                  <Ionicons name="remove" size={22} color={colors.purple} />
                </TouchableOpacity>
                <Text style={styles.createPartidaLimiteValor}>{maxParticipantes}</Text>
                <TouchableOpacity
                  style={styles.createPartidaLimiteBtn}
                  onPress={() => setMaxParticipantes((n) => Math.min(99, n + 1))}
                >
                  <Ionicons name="add" size={22} color={colors.purple} />
                </TouchableOpacity>
                <Text style={{ fontSize: 13, color: colors.textSecondary, flex: 1 }}>
                  pessoas no máximo
                </Text>
              </View>
            ) : null}
          </View>

          <View>
            <Text style={styles.createLocalFieldLabel}>Data e horário</Text>
            {Platform.OS === 'web' ? (
              <TextInput
                style={styles.createLocalInput}
                value={dataPartida.toISOString().slice(0, 16)}
                onChangeText={onMudarDataWeb}
                {...(Platform.OS === 'web' ? { type: 'datetime-local' } : {})}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.createPartidaDateBtn}
                  onPress={abrirSeletorData}
                  activeOpacity={0.85}
                >
                  <Ionicons name="calendar-outline" size={20} color={colors.purple} />
                  <Text style={styles.createPartidaDateText}>{formatPartidaData(dataPartida)}</Text>
                </TouchableOpacity>
                {Platform.OS === 'ios' && mostrarDataPicker ? (
                  <>
                    <DateTimePicker
                      value={dataPartida}
                      mode="datetime"
                      minimumDate={new Date()}
                      display="spinner"
                      onChange={onMudarDataIos}
                    />
                    <TouchableOpacity
                      style={styles.createPartidaDateConfirm}
                      onPress={() => setMostrarDataPicker(false)}
                    >
                      <Text style={styles.createPartidaDateConfirmText}>Confirmar data</Text>
                    </TouchableOpacity>
                  </>
                ) : null}
                {Platform.OS === 'android' && pickerAndroid ? (
                  <DateTimePicker
                    value={dataPartida}
                    mode={pickerAndroid}
                    minimumDate={pickerAndroid === 'date' ? new Date() : undefined}
                    display="default"
                    onChange={onMudarDataAndroid}
                  />
                ) : null}
              </>
            )}
            {Platform.OS === 'web' ? (
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs }}>
                {formatPartidaData(dataPartida)}
              </Text>
            ) : null}
          </View>

          {dadosPreenchidos ? (
            <>
              <View>
                <Text style={styles.createLocalFieldLabel}>Onde será a partida?</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: spacing.sm }}>
                  Locais de {esporte.toLowerCase()} ou poliesportivos.
                </Text>
                <TextInput
                  style={styles.createLocalInput}
                  placeholder="Buscar local pelo nome ou endereço..."
                  placeholderTextColor={colors.textSecondary}
                  value={buscaLocal}
                  onChangeText={setBuscaLocal}
                />
              </View>

              {locaisFiltrados.length === 0 ? (
                <Text style={styles.createPartidaEmpty}>
                  Nenhum local compatível com {esporte}. Cadastre um novo local primeiro.
                </Text>
              ) : (
                locaisFiltrados.map((item) => {
                  const selecionado = localSelecionadoId === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.createPartidaPlaceCard,
                        selecionado && styles.createPartidaPlaceCardActive,
                      ]}
                      onPress={() => setLocalSelecionadoId(item.id)}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.createPartidaPlaceImage}
                        resizeMode="cover"
                      />
                      <View style={styles.createPartidaPlaceBody}>
                        <Text style={styles.createPartidaPlaceName} numberOfLines={1}>
                          {item.emoji} {item.name}
                        </Text>
                        <Text style={styles.createPartidaPlaceMeta} numberOfLines={1}>
                          {item.type}
                          {item.address ? ` • ${item.address}` : ''}
                        </Text>
                      </View>
                      {selecionado ? (
                        <Ionicons name="checkmark-circle" size={24} color={colors.purple} />
                      ) : (
                        <Ionicons name="ellipse-outline" size={24} color={colors.border} />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </>
          ) : null}
        </ScrollView>

        <View style={styles.createLocalFooter}>
          <TouchableOpacity
            style={[styles.createPrimaryBtn, !podeSalvar && { opacity: 0.45 }]}
            onPress={salvar}
            disabled={!podeSalvar}
            activeOpacity={0.9}
          >
            {salvando ? (
              <ActivityIndicator color={colors.textOnPurple} />
            ) : (
              <Text style={styles.createPrimaryBtnText}>Salvar partida</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
