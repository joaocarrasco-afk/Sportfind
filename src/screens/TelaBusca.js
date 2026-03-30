import { FlatList, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import estilos from '../../styles';
import ModalFiltros from '../components/ModalFiltros';

export default function TelaBusca({
  busca,
  setBusca,
  locaisFiltrados,
  abrirLocal,
  onVoltar,
  mostrarFiltro,
  setMostrarFiltro,
  filtroTipo,
  filtroAcesso,
  setFiltroTipo,
  setFiltroAcesso,
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={estilos.barraDeBusca}>
        <TouchableOpacity style={estilos.botaoVoltarBusca} onPress={onVoltar}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={estilos.campoDeBusca}
          placeholder="Buscar local esportivo..."
          value={busca}
          onChangeText={setBusca}
          autoFocus
        />
        <TouchableOpacity style={estilos.botaoFiltroBusca} onPress={() => setMostrarFiltro(true)}>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <Text style={estilos.rotuloSecao}>{busca === '' ? 'Recente' : `${locaisFiltrados.length} resultado(s)`}</Text>

      <FlatList
        data={locaisFiltrados}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={estilos.card} onPress={() => abrirLocal(item)}>
            <Image source={{ uri: item.imagem }} style={estilos.imagemDoCard} />
            <View style={estilos.textoDoCard}>
              <Text style={estilos.nomeDoLocal}>{item.nome}</Text>
              <Text style={estilos.infoDoLocal}>
                {item.distancia}  •  {item.acesso}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <ModalFiltros
        visivel={mostrarFiltro}
        fechar={() => setMostrarFiltro(false)}
        filtroTipo={filtroTipo}
        filtroAcesso={filtroAcesso}
        setFiltroTipo={setFiltroTipo}
        setFiltroAcesso={setFiltroAcesso}
      />
    </SafeAreaView>
  );
}
