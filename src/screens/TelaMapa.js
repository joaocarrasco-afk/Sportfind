import { Platform, Text, TouchableOpacity, View, Image, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import estilos from '../../styles';
import BarraDeNavegacao from '../components/BarraDeNavegacao';
import ModalFiltros from '../components/ModalFiltros';
import { LOCAIS } from '../data/locais';
import { htmlMapa } from '../utils/htmlMapa';

export default function TelaMapa({
  abaAtiva,
  setAbaAtiva,
  locaisFiltrados,
  setTela,
  mostrarFiltro,
  setMostrarFiltro,
  filtroTipo,
  filtroAcesso,
  setFiltroTipo,
  setFiltroAcesso,
  localSelecionado,
  setLocal,
  abrirLocal,
}) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Platform.OS === 'web' ? (
        <View style={{ flex: 1 }}>
          <iframe
            title="Mapa"
            style={{ border: 0, width: '100%', height: '100%' }}
            srcDoc={htmlMapa(locaisFiltrados)}
          />
        </View>
      ) : (
        <WebView
          style={{ flex: 1 }}
          source={{ html: htmlMapa(locaisFiltrados) }}
          onMessage={(e) => setLocal(LOCAIS.find((l) => l.id === Number(e.nativeEvent.data)) ?? null)}
          javaScriptEnabled
          originWhitelist={['*']}
        />
      )}

      <TouchableOpacity style={estilos.botaoBusca} onPress={() => setTela('busca')}>
        <Text style={{ fontSize: 22 }}>🔍</Text>
      </TouchableOpacity>

      <TouchableOpacity style={estilos.botaoFiltro} onPress={() => setMostrarFiltro(true)}>
        <Text style={{ fontSize: 22 }}>⚙️</Text>
      </TouchableOpacity>

      {(filtroTipo !== 'Todos' || filtroAcesso !== 'Todos') && (
        <TouchableOpacity
          style={estilos.etiqueta}
          onPress={() => {
            setFiltroTipo('Todos');
            setFiltroAcesso('Todos');
          }}
        >
          <Text style={estilos.textoEtiqueta}>
            {[filtroTipo !== 'Todos' && filtroTipo, filtroAcesso !== 'Todos' && filtroAcesso].filter(Boolean).join(' · ')}  ×
          </Text>
        </TouchableOpacity>
      )}

      {localSelecionado && (
        <TouchableOpacity style={estilos.cardLocal} onPress={() => abrirLocal(localSelecionado)}>
          <Image source={{ uri: localSelecionado.imagem }} style={estilos.imagemLocal} />
          <View style={{ flex: 1, padding: 12 }}>
            <Text style={estilos.nomeLocal}>{localSelecionado.nome}</Text>
            <Text style={estilos.infoLocal}>
              {localSelecionado.distancia}  •  {localSelecionado.acesso}
            </Text>
            <Text style={{ fontSize: 11, color: '#6393F2', marginTop: 4 }}>Toque para ver mais →</Text>
          </View>
          <TouchableOpacity onPress={() => setLocal(null)} style={{ padding: 12 }}>
            <Text style={{ fontSize: 20, color: '#555' }}>×</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      <ModalFiltros
        visivel={mostrarFiltro}
        fechar={() => setMostrarFiltro(false)}
        filtroTipo={filtroTipo}
        filtroAcesso={filtroAcesso}
        setFiltroTipo={setFiltroTipo}
        setFiltroAcesso={setFiltroAcesso}
      />

      <BarraDeNavegacao abaAtiva={abaAtiva} mudarAba={setAbaAtiva} />
    </SafeAreaView>
  );
}
