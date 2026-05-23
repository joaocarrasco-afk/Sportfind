import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
import {
  ACCESS_FILTERS,
  CREATABLE_SPORTS,
  FILTER_ALL,
  resolvePlaceSportMeta,
  TAB_IDS,
} from '../domain/places';
import { useAppState } from '../state/AppStateContext';

const OPCOES_ACESSO = ACCESS_FILTERS.filter((a) => a !== FILTER_ALL);

function rotuloAcesso(acesso) {
  if (acesso === 'Publico') return 'Público';
  if (acesso === 'Temporario') return 'Temporário';
  return acesso;
}



export default function TelaCriarLocal() {

  

  const navigation = useNavigation();
  const { addPlace } = useAppState();

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [esportes, setEsportes] = useState([]);
  const [acesso, setAcesso] = useState('Publico');
  const [fotoUri, setFotoUri] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const previewMeta = useMemo(() => resolvePlaceSportMeta(esportes), [esportes]);

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

  //backend

  async function criarLocal() {
    const formData = new FormData();
    formData.append('name', nome);
    formData.append('rua', "rua");
    formData.append('bairro', "bairro");
    formData.append('cidade', "cidade");
    formData.append('estado', "estado");
    formData.append('cep', "cep");
    formData.append('numero', "numero" || 0);
    formData.append('lat', -23.55052); // Exemplo de latitude
    formData.append('lng', -46.633308); // Exemplo de longitude
    formData.append('color', "color");
    formData.append('infraestrutura', "infraestrutura");
    formData.append('emoji', previewMeta.emoji);
    formData.append('description', descricao);
    formData.append('type', JSON.stringify(esportes));
    formData.append('access', acesso);
    formData.append('image', {
      uri: fotoUri,
      type: 'image/jpeg',
      name: 'post.jpg',
    });

      try {
        const response = await fetch(`${API_URL}/localizacao`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
  }


  function salvar() {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'Informe o nome do local.');
      return;
    }
    if (!endereco.trim()) {
      Alert.alert('Endereço obrigatório', 'Informe o endereço do local.');
      return;
    }
    if (esportes.length === 0) {
      Alert.alert('Esporte obrigatório', 'Selecione pelo menos um esporte praticado no local.');
      return;
    }

    setSalvando(true);
    try {
      addPlace({
        name: nome,
        address: endereco,
        description: descricao,
        sports: esportes,
        access: acesso,
        image: fotoUri ?? undefined,
      });

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

  const podeSalvar = nome.trim() && endereco.trim() && esportes.length > 0 && !salvando;

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
            <TextInput
              style={styles.createLocalInput}
              placeholder="Rua, número, bairro, cidade"
              placeholderTextColor={colors.textSecondary}
              value={endereco}
              onChangeText={setEndereco}
            />
          </View>

          <View>
            <Text style={styles.createLocalFieldLabel}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.createLocalInput, styles.createLocalInputMultiline]}
              placeholder="Horários, estrutura, observações..."
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
            onPress={criarLocal}
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
