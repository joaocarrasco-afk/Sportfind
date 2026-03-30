// To do List
// Organizar páginas
// Adicionar páginas que estão no figma
// Tem um bug que o João falou mas eu não entendi, tem que estar vendo
// Adicionar cores, animações, dark mode, etc.
// Mudar animação de quando vc clica nas configurações e sobe uma tela preta esquisita
// Tirar todos os emojis

import { useEffect, useState } from 'react';
import { Platform, View, Text, TouchableOpacity, FlatList, TextInput, Modal, SafeAreaView, ScrollView, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import estilos from './styles';

// ─── Dados ────────────────────────────────────────────────────────────────────
const LOCAIS = [
  { id: 1, nome: 'Basquete Max Feffer', tipo: 'Basquete',      distancia: '0.3 km', acesso: 'Público',    emoji: '🏀', lat: -23.5445, lng: -46.3106, cor: '#FF6B35', imagem: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400', descricao: 'Quadra de basquete pública no Parque Max Feffer. Aberta todos os dias das 6h às 22h.' },
  { id: 2, nome: 'Suzano Skatepark',    tipo: 'Skate',         distancia: '1.4 km', acesso: 'Público',    emoji: '🛹', lat: -23.5452, lng: -46.3091, cor: '#6393F2', imagem: 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=400', descricao: 'Pista de skate pública com rampas e obstáculos variados.' },
  { id: 3, nome: 'Campo Society',       tipo: 'Futebol',       distancia: '2.1 km', acesso: 'Privado',    emoji: '⚽', lat: -23.5415, lng: -46.3135, cor: '#4CAF50', imagem: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400', descricao: 'Campo society coberto com aluguel por hora. Vestiário disponível.' },
  { id: 4, nome: 'Arena Tênis Clube',   tipo: 'Tênis',         distancia: '3.0 km', acesso: 'Privado',    emoji: '🎾', lat: -23.5468, lng: -46.3070, cor: '#FFC107', imagem: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400', descricao: 'Quadras de tênis em saibro e cimento. Aulas disponíveis.' },
  { id: 5, nome: 'Quadra Municipal',    tipo: 'Poliesportivo', distancia: '1.8 km', acesso: 'Público',    emoji: '🏟️', lat: -23.5430, lng: -46.3120, cor: '#9C27B0', imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', descricao: 'Quadra poliesportiva municipal com marcações para vários esportes.' },
];

const FILTROS_TIPO    = ['Todos', 'Basquete', 'Skate', 'Futebol', 'Tênis', 'Poliesportivo'];
const FILTROS_ACESSO  = ['Todos', 'Público', 'Privado', 'Temporário'];

const ABAS = [
  { id: 'mapa',      rotulo: 'Mapa',      icone: '🗺️' },
  { id: 'favoritos', rotulo: 'Favoritos', icone: '⭐' },
  { id: 'criar', rotulo: 'Criar', icone: '➕' },
  { id: 'notificacao',    rotulo: 'Noticação',    icone: '🔔' },
  { id: 'perfil',    rotulo: 'Perfil',    icone: '👤' },

];

const CONTEUDO_ABAS = {
  favoritos: { icone: '⭐', titulo: 'Favoritos',  sub: 'Nenhum favorito ainda' },
  perfil:    { icone: '👤', titulo: 'Meu Perfil', sub: '' },
  criar: { icone: '➕', titulo: 'Criar',  sub: 'Em construção' },
  notificacao: { icone: '🔔', titulo: 'Noticação',  sub: 'Sem Notificações' },
};

// ─── HTML do Mapa ─────────────────────────────────────────────────────────────
const htmlMapa = (locais) => `
  <!DOCTYPE html><html><head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>* {margin:0;padding:0} html,body,#mapa{width:100%;height:100%}</style>
  </head><body><div id="mapa"></div><script>
    const mapa = L.map('mapa',{zoomControl:false}).setView([-23.5445,-46.3106],15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);
    function sendToApp(payload) {
      try {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(String(payload));
          return;
        }
        if (window.parent && window.parent !== window && window.parent.postMessage) {
          window.parent.postMessage(String(payload), '*');
        }
      } catch (e) {}
    }
    ${locais.map(l => `
      L.marker([${l.lat},${l.lng}],{icon:L.divIcon({
        html:'<div style="background:${l.cor};width:36px;height:36px;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${l.emoji}</div>',
        iconSize:[36,36],iconAnchor:[18,18],className:''
      })}).addTo(mapa).on('click',()=>sendToApp('${l.id}'));
    `).join('')}
  </script></body></html>
`;

// ─── Barra de Navegação ───────────────────────────────────────────────────────
function BarraDeNavegacao({ abaAtiva, mudarAba }) {
  return (
    <View style={estilos.navBar}>
      {ABAS.map(aba => (
        <TouchableOpacity key={aba.id} style={estilos.itemNav} onPress={() => mudarAba(aba.id)}>
          <View style={[estilos.pastilhaNav, abaAtiva === aba.id && estilos.pastilhaNavAtiva]}>
            <Text style={{ fontSize: 22 }}>{aba.icone}</Text>
          </View>
          <Text style={[estilos.rotuloNav, { color: abaAtiva === aba.id ? '#625b71' : '#49454f' }]}>
            {aba.rotulo}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── App Principal ────────────────────────────────────────────────────────────
export default function App() {
  const [abaAtiva, setAbaAtiva]           = useState('mapa');
  const [tela, setTela]                   = useState('mapa'); // mapa | busca | local
  const [localSelecionado, setLocal]      = useState(null);
  const [filtroTipo, setFiltroTipo]       = useState('Todos');
  const [filtroAcesso, setFiltroAcesso]   = useState('Todos');
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [busca, setBusca]                 = useState('');

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (event) => {
      const id = Number(event?.data);
      if (!Number.isFinite(id)) return;
      setLocal(LOCAIS.find(l => l.id === id) ?? null);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const locaisFiltrados = LOCAIS.filter(l =>
    (filtroTipo   === 'Todos' || l.tipo   === filtroTipo) &&
    (filtroAcesso === 'Todos' || l.acesso === filtroAcesso) &&
    l.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirLocal = (local) => { setLocal(local); setTela('local'); };
  const voltarMapa = () => { setTela('mapa'); setBusca(''); };

  // ── Tela do Local ────────────────────────────────────────────────────────────
  if (tela === 'local' && localSelecionado) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        {/* Imagem */}
        <View style={estilos.localImagem}>
          <Image source={{ uri: localSelecionado.imagem }} style={estilos.localImagem} />
          <TouchableOpacity style={estilos.botaoVoltar} onPress={voltarMapa}>
            <Text style={{ fontSize: 30, bottom:7, }}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <View style={estilos.localConteudo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 32 }}>{localSelecionado.emoji}</Text>
            <Text style={estilos.localNome}>{localSelecionado.nome}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <View style={[estilos.tag, { backgroundColor: localSelecionado.cor + '22', borderColor: localSelecionado.cor }]}>
              <Text style={[estilos.tagTexto, { color: localSelecionado.cor }]}>{localSelecionado.tipo}</Text>
            </View>
            <View style={[estilos.tag, { backgroundColor: localSelecionado.acesso === 'Público' ? '#e8f5e9' : '#fce4ec', borderColor: localSelecionado.acesso === 'Público' ? '#4CAF50' : '#e91e63' }]}>
              <Text style={[estilos.tagTexto, { color: localSelecionado.acesso === 'Público' ? '#2e7d32' : '#c62828' }]}>{localSelecionado.acesso}</Text>
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

  // ── Tela de Busca ────────────────────────────────────────────────────────────
  if (tela === 'busca') return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={estilos.barraDeBusca}>
        <TouchableOpacity style={estilos.botaoVoltarBusca} onPress={voltarMapa}>
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

      <Text style={estilos.rotuloSecao}>
        {busca === '' ? 'Recente' : `${locaisFiltrados.length} resultado(s)`}
      </Text>

      <FlatList
        data={locaisFiltrados}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={estilos.card} onPress={() => abrirLocal(item)}>
            <Image source={{ uri: item.imagem }} style={estilos.imagemDoCard} />
            <View style={estilos.textoDoCard}>
              <Text style={estilos.nomeDoLocal}>{item.nome}</Text>
              <Text style={estilos.infoDoLocal}>{item.distancia}  •  {item.acesso}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal de Filtro */}
      <Modal visible={mostrarFiltro} transparent animationType="slide">
        <TouchableOpacity style={estilos.fundo} onPress={() => setMostrarFiltro(false)}>
          <View style={estilos.painel}>
            {/* Cabeçalho */}
            <View style={estilos.painelCabecalho}>
              <TouchableOpacity style={estilos.botaoX} onPress={() => setMostrarFiltro(false)}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>X</Text>
              </TouchableOpacity>
              <Text style={estilos.tituloPainel}>Filtros</Text>
              <TouchableOpacity onPress={() => { setFiltroTipo('Todos'); setFiltroAcesso('Todos'); }}>
                <Text style={{ fontSize: 13, color: '#6393F2', fontWeight: '500' }}>Limpar</Text>
              </TouchableOpacity>
            </View>

            {/* Filtro por Esporte */}
            <Text style={estilos.labelFiltro}>Esporte</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {FILTROS_TIPO.map(f => (
                <TouchableOpacity
                  key={f}
                  style={[estilos.opcao, filtroTipo === f && estilos.opcaoAtiva]}
                  onPress={() => setFiltroTipo(f)}
                >
                  <Text style={[estilos.textoOpcao, filtroTipo === f && { color: '#6393F2' }]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Filtro por Privacidade */}
            <Text style={estilos.labelFiltro}>Privacidade</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {FILTROS_ACESSO.map(f => (
                <TouchableOpacity
                  key={f}
                  style={[estilos.opcao, filtroAcesso === f && estilos.opcaoAtiva]}
                  onPress={() => setFiltroAcesso(f)}
                >
                  <Text style={[estilos.textoOpcao, filtroAcesso === f && { color: '#6393F2' }]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );

  // ── Telas de Favoritos / Perfil ──────────────────────────────────────────────
  if (abaAtiva !== 'mapa') {
    const { icone, titulo, sub } = CONTEUDO_ABAS[abaAtiva];
    return (
      <SafeAreaView style={estilos.telaCentral}>
        <Text style={{ fontSize: 48 }}>{icone}</Text>
        <Text style={estilos.tituloTela}>{titulo}</Text>
        {sub ? <Text style={estilos.subTituloTela}>{sub}</Text> : null}
        <BarraDeNavegacao abaAtiva={abaAtiva} mudarAba={setAbaAtiva} />
      </SafeAreaView>
    );
  }

  // ── Tela do Mapa ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1 }}>

      {/* Mapa */}
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
          onMessage={e => setLocal(LOCAIS.find(l => l.id === Number(e.nativeEvent.data)))}
          javaScriptEnabled
          originWhitelist={['*']}
        />
      )}

      {/* Botão Busca */}
      <TouchableOpacity style={estilos.botaoBusca} onPress={() => setTela('busca')}>
        <Text style={{ fontSize: 22 }}>🔍</Text>
      </TouchableOpacity>

      {/* Botão Filtro */}
      <TouchableOpacity style={estilos.botaoFiltro} onPress={() => setMostrarFiltro(true)}>
        <Text style={{ fontSize: 22 }}>⚙️</Text>
      </TouchableOpacity>

      {/* Etiqueta do Filtro Ativo */}
      {(filtroTipo !== 'Todos' || filtroAcesso !== 'Todos') && (
        <TouchableOpacity style={estilos.etiqueta} onPress={() => { setFiltroTipo('Todos'); setFiltroAcesso('Todos'); }}>
          <Text style={estilos.textoEtiqueta}>
            {[filtroTipo !== 'Todos' && filtroTipo, filtroAcesso !== 'Todos' && filtroAcesso].filter(Boolean).join(' · ')}  ×
          </Text>
        </TouchableOpacity>
      )}

      {/* Card do Local Selecionado */}
      {localSelecionado && (
        <TouchableOpacity style={estilos.cardLocal} onPress={() => abrirLocal(localSelecionado)}>
          <Image source={{ uri: localSelecionado.imagem }} style={estilos.imagemLocal} />
          <View style={{ flex: 1, padding: 12 }}>
            <Text style={estilos.nomeLocal}>{localSelecionado.nome}</Text>
            <Text style={estilos.infoLocal}>{localSelecionado.distancia}  •  {localSelecionado.acesso}</Text>
            <Text style={{ fontSize: 11, color: '#6393F2', marginTop: 4 }}>Toque para ver mais →</Text>
          </View>
          <TouchableOpacity onPress={() => setLocal(null)} style={{ padding: 12 }}>
            <Text style={{ fontSize: 20, color: '#555' }}>×</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Modal de Filtro do Mapa */}
      <Modal visible={mostrarFiltro} transparent animationType="slide">
        <TouchableOpacity style={estilos.fundo} onPress={() => setMostrarFiltro(false)}>
          <View style={estilos.painel}>
            <View style={estilos.painelCabecalho}>
              <TouchableOpacity style={estilos.botaoX} onPress={() => setMostrarFiltro(false)}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>X</Text>
              </TouchableOpacity>
              <Text style={estilos.tituloPainel}>Filtros</Text>
              <TouchableOpacity onPress={() => { setFiltroTipo('Todos'); setFiltroAcesso('Todos'); }}>
                <Text style={{ fontSize: 13, color: '#6393F2', fontWeight: '500' }}>Limpar</Text>
              </TouchableOpacity>
            </View>

            <Text style={estilos.labelFiltro}>Esporte</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {FILTROS_TIPO.map(f => (
                <TouchableOpacity
                  key={f}
                  style={[estilos.opcao, filtroTipo === f && estilos.opcaoAtiva]}
                  onPress={() => setFiltroTipo(f)}
                >
                  <Text style={[estilos.textoOpcao, filtroTipo === f && { color: '#6393F2' }]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={estilos.labelFiltro}>Privacidade</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {FILTROS_ACESSO.map(f => (
                <TouchableOpacity
                  key={f}
                  style={[estilos.opcao, filtroAcesso === f && estilos.opcaoAtiva]}
                  onPress={() => setFiltroAcesso(f)}
                >
                  <Text style={[estilos.textoOpcao, filtroAcesso === f && { color: '#6393F2' }]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <BarraDeNavegacao abaAtiva={abaAtiva} mudarAba={setAbaAtiva} />
    </SafeAreaView>
  );
}