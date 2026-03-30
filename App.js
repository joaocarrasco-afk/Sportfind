import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { CONTEUDO_ABAS, LOCAIS } from './src/data/locais';
import TelaAbaPlaceholder from './src/screens/TelaAbaPlaceholder';
import TelaBusca from './src/screens/TelaBusca';
import TelaLocal from './src/screens/TelaLocal';
import TelaMapa from './src/screens/TelaMapa';

// ─── App Principal ────────────────────────────────────────────────────────────
export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('mapa');
  const [tela, setTela] = useState('mapa');
  const [localSelecionado, setLocal] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroAcesso, setFiltroAcesso] = useState('Todos');
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [busca, setBusca] = useState('');

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

  const abrirLocal = (local) => {
    setLocal(local);
    setTela('local');
  };

  const voltarMapa = () => {
    setTela('mapa');
    setBusca('');
  };

  if (tela === 'local' && localSelecionado) {
    return <TelaLocal localSelecionado={localSelecionado} onVoltar={voltarMapa} />;
  }

  if (tela === 'busca') {
    return (
      <TelaBusca
        busca={busca}
        setBusca={setBusca}
        locaisFiltrados={locaisFiltrados}
        abrirLocal={abrirLocal}
        onVoltar={voltarMapa}
        mostrarFiltro={mostrarFiltro}
        setMostrarFiltro={setMostrarFiltro}
        filtroTipo={filtroTipo}
        filtroAcesso={filtroAcesso}
        setFiltroTipo={setFiltroTipo}
        setFiltroAcesso={setFiltroAcesso}
      />
    );
  }

  if (abaAtiva !== 'mapa') {
    return <TelaAbaPlaceholder abaAtiva={abaAtiva} mudarAba={setAbaAtiva} conteudo={CONTEUDO_ABAS[abaAtiva]} />;
  }

  return (
    <TelaMapa
      abaAtiva={abaAtiva}
      setAbaAtiva={setAbaAtiva}
      locaisFiltrados={locaisFiltrados}
      setTela={setTela}
      mostrarFiltro={mostrarFiltro}
      setMostrarFiltro={setMostrarFiltro}
      filtroTipo={filtroTipo}
      filtroAcesso={filtroAcesso}
      setFiltroTipo={setFiltroTipo}
      setFiltroAcesso={setFiltroAcesso}
      localSelecionado={localSelecionado}
      setLocal={setLocal}
      abrirLocal={abrirLocal}
    />
  );
}