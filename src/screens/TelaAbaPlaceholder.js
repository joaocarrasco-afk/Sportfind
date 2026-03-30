import { SafeAreaView, Text } from 'react-native';
import estilos from '../../styles';
import BarraDeNavegacao from '../components/BarraDeNavegacao';

export default function TelaAbaPlaceholder({ abaAtiva, mudarAba, conteudo }) {
  const { icone, titulo, sub } = conteudo;

  return (
    <SafeAreaView style={estilos.telaCentral}>
      <Text style={{ fontSize: 48 }}>{icone}</Text>
      <Text style={estilos.tituloTela}>{titulo}</Text>
      {sub ? <Text style={estilos.subTituloTela}>{sub}</Text> : null}
      <BarraDeNavegacao abaAtiva={abaAtiva} mudarAba={mudarAba} />
    </SafeAreaView>
  );
}
