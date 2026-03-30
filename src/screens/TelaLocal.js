import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import estilos from '../../styles';

export default function TelaLocal({ localSelecionado, onVoltar }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <View style={estilos.localImagem}>
          <Image source={{ uri: localSelecionado.imagem }} style={estilos.localImagem} />
          <TouchableOpacity style={estilos.botaoVoltar} onPress={onVoltar}>
            <Text style={{ fontSize: 30, bottom: 7 }}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.localConteudo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 32 }}>{localSelecionado.emoji}</Text>
            <Text style={estilos.localNome}>{localSelecionado.nome}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <View style={[estilos.tag, { backgroundColor: `${localSelecionado.cor}22`, borderColor: localSelecionado.cor }]}>
              <Text style={[estilos.tagTexto, { color: localSelecionado.cor }]}>{localSelecionado.tipo}</Text>
            </View>
            <View
              style={[
                estilos.tag,
                {
                  backgroundColor: localSelecionado.acesso === 'Público' ? '#e8f5e9' : '#fce4ec',
                  borderColor: localSelecionado.acesso === 'Público' ? '#4CAF50' : '#e91e63',
                },
              ]}
            >
              <Text
                style={[
                  estilos.tagTexto,
                  { color: localSelecionado.acesso === 'Público' ? '#2e7d32' : '#c62828' },
                ]}
              >
                {localSelecionado.acesso}
              </Text>
            </View>
            <View style={[estilos.tag, { backgroundColor: '#f3f3f3', borderColor: '#ccc' }]}>
              <Text style={[estilos.tagTexto, { color: '#555' }]}>📍 {localSelecionado.distancia}</Text>
            </View>
          </View>
          <Text style={estilos.localDescricao}>{localSelecionado.descricao}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
