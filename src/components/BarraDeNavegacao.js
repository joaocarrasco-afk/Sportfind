import { Text, TouchableOpacity, View } from 'react-native';
import estilos from '../../styles';
import { ABAS } from '../data/locais';

export default function BarraDeNavegacao({ abaAtiva, mudarAba }) {
  return (
    <View style={estilos.navBar}>
      {ABAS.map((aba) => (
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
