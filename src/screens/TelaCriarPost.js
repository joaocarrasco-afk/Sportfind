import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
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
import { colors } from '../../style/tokens';
import { useAppState } from '../state/AppStateContext';


export default function TelaCriarPost() {
  const navigation = useNavigation();
  const { authUid, addPostPerfil } = useAppState();
  const [imagemUri, setImagemUri] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [publicando, setPublicando] = useState(false);

  async function selecionarImagem() {
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
      setImagemUri(resultado.assets[0].uri);
    }
  }

  async function publicar() {
    if (!imagemUri) {
      Alert.alert('Foto obrigatória', 'Selecione uma imagem para publicar no feed.');
      return;
    }

    if (!authUid) {
      Alert.alert('Login necessário', 'Faça login para publicar no feed.');
      return;
    }
    const userId = authUid;
    setPublicando(true);

    try {
      const formData = new FormData();
      formData.append('descricao', descricao.trim());
      formData.append('image', {
        uri: imagemUri,
        type: 'image/jpeg',
        name: 'post.jpg',
      });

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/feed/post/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Falha ao publicar');
      }

      addPostPerfil({ tipo: 'imagem', url: imagemUri, descricao: descricao.trim() });
      Alert.alert('Publicado!', 'Sua publicação foi compartilhada no feed e no seu perfil.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      addPostPerfil({ tipo: 'imagem', url: imagemUri, descricao: descricao.trim() });
      Alert.alert(
        'Salvo localmente',
        'Não foi possível enviar ao servidor. A publicação foi salva no seu perfil.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } finally {
      setPublicando(false);
    }
  }

  const podePublicar = Boolean(imagemUri) && !publicando;

  return (
    <SafeAreaView style={styles.createPostScreen}>
      <KeyboardAvoidingView
        style={styles.createPostFlex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.createPostHeader}>
          <TouchableOpacity
            style={styles.createPostBackBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={22} color={colors.purple} />
          </TouchableOpacity>
          <Text style={styles.createPostHeaderTitle}>Nova publicação</Text>
          <View style={styles.createPostHeaderSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.createPostScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.createPostImageBox}
            onPress={selecionarImagem}
            activeOpacity={0.85}
          >
            {imagemUri ? (
              <Image source={{ uri: imagemUri }} style={styles.createPostImagePreview} resizeMode="cover" />
            ) : (
              <View style={styles.createPostImagePlaceholder}>
                <Ionicons name="image-outline" size={40} color={colors.purpleLight} />
                <Text style={styles.createPostImageHint}>Toque para escolher uma foto</Text>
              </View>
            )}
            {imagemUri ? (
              <View style={styles.createPostImageEditBadge}>
                <Ionicons name="camera" size={16} color={colors.textOnPurple} />
              </View>
            ) : null}
          </TouchableOpacity>

          <Text style={styles.createPostFieldLabel}>Legenda</Text>
          <TextInput
            style={styles.createPostInput}
            placeholder="Conte sobre o momento esportivo..."
            placeholderTextColor={colors.textSecondary}
            value={descricao}
            onChangeText={setDescricao}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.createPostCharCount}>{descricao.length}/500</Text>
        </ScrollView>

        <View style={styles.createPostFooter}>
          <TouchableOpacity
            style={[styles.createPostPublishBtn, !podePublicar && styles.createPostPublishBtnDisabled]}
            onPress={publicar}
            disabled={!podePublicar}
            activeOpacity={0.9}
          >
            {publicando ? (
              <ActivityIndicator color={colors.textOnPurple} />
            ) : (
              <>
                <Ionicons name="send" size={18} color={colors.textOnPurple} />
                <Text style={styles.createPostPublishText}>Publicar no feed</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
