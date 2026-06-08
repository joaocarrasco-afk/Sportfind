import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  ACCESS_FILTERS,
  CREATABLE_SPORTS,
  FILTER_ALL,
  INFRASTRUCTURE_OPTIONS,
  resolvePlaceSportMeta,
  rotulosInfraestrutura,
  TAB_IDS,
} from '../domain/places';
import MapaPinPicker from '../components/MapaPinPicker';
import { useAppState } from '../state/AppStateContext';
import { buscarCepEGeocodificar } from '../utils/geocodeEndereco';

const MAP_CENTER = { lat: -23.5445, lng: -46.3106 };

const OPCOES_ACESSO = ACCESS_FILTERS.filter((a) => a !== FILTER_ALL);

function rotuloAcesso(acesso) {
  if (acesso === 'Publico') return 'Público';
  if (acesso === 'Temporario') return 'Temporário';
  return acesso;
}

export default function TelaCriarLocal() {
  const navigation = useNavigation();
  const { addPlace, removePlaceById, refreshPlaces } = useAppState();

  const [nome, setNome] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [descricao, setDescricao] = useState('');
  const [infraestrutura, setInfraestrutura] = useState([]);
  const [esportes, setEsportes] = useState([]);
  const [acesso, setAcesso] = useState('Publico');
  const [fotoUri, setFotoUri] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [lat, setLat] = useState(MAP_CENTER.lat);
  const [lng, setLng] = useState(MAP_CENTER.lng);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const ultimoCepProcessado = useRef('');


  const previewMeta = useMemo(() => resolvePlaceSportMeta(esportes), [esportes]);
  const enderecoResumo = useMemo(() => {
    const partes = [
      [rua, numero].filter(Boolean).join(', '),
      bairro,
      [cidade, estado].filter(Boolean).join(' - '),
      cep,
    ].filter(Boolean);
    return partes.join(' • ');
  }, [rua, numero, bairro, cidade, estado, cep]);

  useEffect(() => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8 || digits === ultimoCepProcessado.current) return undefined;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      (async () => {
        setBuscandoCep(true);
        try {
          const resultado = await buscarCepEGeocodificar(digits, {
            signal: controller.signal,
            onEndereco: (endereco) => {
              if (controller.signal.aborted) return;
              if (endereco.rua) setRua(endereco.rua);
              if (endereco.bairro) setBairro(endereco.bairro);
              if (endereco.cidade) setCidade(endereco.cidade);
              if (endereco.estado) setEstado(endereco.estado);
            },
          });
          if (controller.signal.aborted || !resultado) return;

          ultimoCepProcessado.current = digits;
          if (resultado.lat != null && resultado.lng != null) {
            setLat(resultado.lat);
            setLng(resultado.lng);
          }
        } catch {
          /* requisição cancelada ou falha de rede */
        } finally {
          if (!controller.signal.aborted) setBuscandoCep(false);
        }
      })();
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [cep]);

  async function selecionarFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para escolher uma foto.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!resultado.canceled && resultado.assets?.[0]?.uri) {
      setFotoUri(resultado.assets[0].uri);
    }
  }

  function alternarEsporte(id) {
    setEsportes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function alternarInfra(id) {
    setInfraestrutura((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function limparFormulario() {
    setNome('');
    setRua('');
    setNumero('');
    setBairro('');
    setCidade('');
    setEstado('');
    setCep('');
    setDescricao('');
    setInfraestrutura([]);
    setEsportes([]);
    setAcesso('Publico');
    setFotoUri(null);
    setLat(MAP_CENTER.lat);
    setLng(MAP_CENTER.lng);
    ultimoCepProcessado.current = '';
  }

  async function enviarParaApi(endereco) {
    const formData = new FormData();
    formData.append('name', nome.trim());
    formData.append('rua', endereco.rua);
    formData.append('bairro', endereco.bairro);
    formData.append('cidade', endereco.cidade);
    formData.append('estado', endereco.estado);
    formData.append('cep', endereco.cep);
    formData.append('numero', endereco.numero || '0');
    formData.append('lat', lat);
    formData.append('lng', lng);
    formData.append('color', '#9756CA');
    formData.append('infraestrutura', JSON.stringify(infraestrutura));
    formData.append('emoji', previewMeta.emoji);
    formData.append('description', descricao.trim());
    formData.append('type', JSON.stringify(esportes));
    formData.append('access', acesso);
    formData.append('image', { uri: fotoUri, type: 'image/jpeg', name: 'local.jpg' });

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/localizacao`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.localizacaoId ?? null;
    } catch {
      /* mapa local segue funcionando mesmo se a API falhar */
      return null;
    }
  }

  async function salvar() {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'Informe o nome do local.');
      return;
    }
    if (!rua.trim() || !cidade.trim()) {
      Alert.alert('Endereço obrigatório', 'Informe pelo menos rua e cidade.');
      return;
    }
    if (esportes.length === 0) {
      Alert.alert('Esporte obrigatório', 'Selecione pelo menos um esporte praticado no local.');
      return;
    }

    const endereco = {
      rua: rua.trim(),
      numero: numero.trim() || 'S/N',
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      estado: estado.trim(),
      cep: cep.trim(),
    };

    setSalvando(true);
    try {
      const novo = addPlace({
        name: nome,
        address: enderecoResumo,
        endereco,
        description: descricao,
        sports: esportes,
        access: acesso,
        image: fotoUri ?? undefined,
        infraestrutura,
        lat,
        lng,
      });

      if (fotoUri) {
        const apiId = await enviarParaApi(endereco);
        if (apiId) {
          removePlaceById(novo.id);
          await refreshPlaces?.();
        }
      }

      limparFormulario();

      Alert.alert('Local cadastrado!', 'O local já aparece no mapa com o ícone correspondente.', [
        {
          text: 'Ver no mapa',
          onPress: () => navigation.getParent()?.navigate(TAB_IDS.MAP, { screen: 'TelaMapa' }),
        },
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setSalvando(false);
    }
  }

  const podeSalvar =
    nome.trim() && rua.trim() && cidade.trim() && esportes.length > 0 && !salvando;

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
          <Text style={styles.createLocalHeaderTitle}>Cadastrar local</Text>
          <View style={styles.createLocalHeaderSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.createLocalScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text style={styles.createLocalFieldLabel}>Foto do local</Text>
            <TouchableOpacity
              style={styles.createPostImageBox}
              onPress={selecionarFoto}
              activeOpacity={0.85}
            >
              {fotoUri ? (
                <Image
                  source={{ uri: fotoUri }}
                  style={styles.createPostImagePreview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.createPostImagePlaceholder}>
                  <Ionicons name="camera-outline" size={40} color={colors.purpleLight} />
                  <Text style={styles.createPostImageHint}>Toque para adicionar foto do local</Text>
                </View>
              )}
              {fotoUri ? (
                <View style={styles.createPostImageEditBadge}>
                  <Ionicons name="camera" size={16} color={colors.textOnPurple} />
                </View>
              ) : null}
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.createLocalFieldLabel}>Nome do local</Text>
            <TextInput
              style={styles.createLocalInput}
              placeholder="Ex.: Quadra do Parque Central"
              placeholderTextColor={colors.textSecondary}
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View>
            <Text style={styles.createLocalFieldLabel}>Endereço</Text>
            <Text style={styles.createLocalMapHint}>
              Arraste o pin ou toque no mapa para marcar o local. Ao informar o CEP, o pin vai
              para a rua automaticamente.
            </Text>
            <View style={styles.createLocalMapBox}>
              <MapaPinPicker
                lat={lat}
                lng={lng}
                onPinMove={(novaLat, novaLng) => {
                  setLat(novaLat);
                  setLng(novaLng);
                }}
                style={{ flex: 1 }}
              />
            </View>
            {buscandoCep ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm }}>
                <ActivityIndicator size="small" color={colors.purple} />
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Buscando endereço pelo CEP...</Text>
              </View>
            ) : null}
            <TextInput
              style={styles.createLocalInput}
              placeholder="Rua / Avenida"
              placeholderTextColor={colors.textSecondary}
              value={rua}
              onChangeText={setRua}
            />
            <View style={[styles.createLocalAddressGrid, { marginTop: spacing.sm }]}>
              <View style={styles.createLocalAddressHalf}>
                <TextInput
                  style={styles.createLocalInput}
                  placeholder="Número"
                  placeholderTextColor={colors.textSecondary}
                  value={numero}
                  onChangeText={setNumero}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.createLocalAddressHalf}>
                <TextInput
                  style={styles.createLocalInput}
                  placeholder="CEP"
                  placeholderTextColor={colors.textSecondary}
                  value={cep}
                  onChangeText={setCep}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <TextInput
              style={[styles.createLocalInput, { marginTop: spacing.sm }]}
              placeholder="Bairro"
              placeholderTextColor={colors.textSecondary}
              value={bairro}
              onChangeText={setBairro}
            />
            <View style={[styles.createLocalAddressGrid, { marginTop: spacing.sm }]}>
              <View style={styles.createLocalAddressHalf}>
                <TextInput
                  style={styles.createLocalInput}
                  placeholder="Cidade"
                  placeholderTextColor={colors.textSecondary}
                  value={cidade}
                  onChangeText={setCidade}
                />
              </View>
              <View style={styles.createLocalAddressHalf}>
                <TextInput
                  style={styles.createLocalInput}
                  placeholder="Estado (UF)"
                  placeholderTextColor={colors.textSecondary}
                  value={estado}
                  onChangeText={setEstado}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>

          <View>
            <Text style={styles.createLocalFieldLabel}>Infraestrutura</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: spacing.sm }}>
              Selecione o que o local oferece (iluminação, bebedouros, etc.).
            </Text>
            <View style={styles.createLocalChipRow}>
              {INFRASTRUCTURE_OPTIONS.map((item) => {
                const ativo = infraestrutura.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.createLocalChip, ativo && styles.createLocalChipActive]}
                    onPress={() => alternarInfra(item.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
                    <Text
                      style={[
                        styles.createLocalChipLabel,
                        ativo && styles.createLocalChipLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {infraestrutura.length > 0 ? (
              <Text style={{ fontSize: 12, color: colors.purple, marginTop: spacing.xs }}>
                {rotulosInfraestrutura(infraestrutura).join(' • ')}
              </Text>
            ) : null}
          </View>

          <View>
            <Text style={styles.createLocalFieldLabel}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.createLocalInput, styles.createLocalInputMultiline]}
              placeholder="Horários, regras de uso, observações..."
              placeholderTextColor={colors.textSecondary}
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />
          </View>

          <View>
            <Text style={styles.createLocalFieldLabel}>Esportes praticados</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: spacing.sm }}>
              Dois ou mais esportes tornam o local poliesportivo no mapa.
            </Text>
            <View style={styles.createLocalChipRow}>
              {CREATABLE_SPORTS.map((sport) => {
                const ativo = esportes.includes(sport.id);
                return (
                  <TouchableOpacity
                    key={sport.id}
                    style={[styles.createLocalChip, ativo && styles.createLocalChipActive]}
                    onPress={() => alternarEsporte(sport.id)}
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
            <Text style={styles.createLocalFieldLabel}>Privacidade do local</Text>
            <View style={styles.createLocalChipRow}>
              {OPCOES_ACESSO.map((opcao) => {
                const ativo = acesso === opcao;
                return (
                  <TouchableOpacity
                    key={opcao}
                    style={[styles.createLocalChip, ativo && styles.createLocalChipActive]}
                    onPress={() => setAcesso(opcao)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.createLocalChipLabel,
                        ativo && styles.createLocalChipLabelActive,
                      ]}
                    >
                      {rotuloAcesso(opcao)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {esportes.length > 0 ? (
            <View style={styles.createLocalPreview}>
              <Text style={styles.createLocalPreviewEmoji}>{previewMeta.emoji}</Text>
              <Text style={styles.createLocalPreviewText}>
                No mapa este local aparecerá como{' '}
                <Text style={{ fontWeight: '700', color: colors.purple }}>{previewMeta.type}</Text>
                {previewMeta.type === 'Poliesportivo'
                  ? ' — ícone poliesportivo para vários esportes.'
                  : ` — ícone de ${previewMeta.type.toLowerCase()}.`}
              </Text>
            </View>
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
              <Text style={styles.createPrimaryBtnText}>Salvar local</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
