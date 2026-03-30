import { Modal, Text, TouchableOpacity, View } from 'react-native';
import estilos from '../../styles';
import { FILTROS_ACESSO, FILTROS_TIPO } from '../data/locais';

export default function ModalFiltros({
  visivel,
  fechar,
  filtroTipo,
  filtroAcesso,
  setFiltroTipo,
  setFiltroAcesso,
}) {
  return (
    <Modal visible={visivel} transparent animationType="slide">
      <TouchableOpacity style={estilos.fundo} onPress={fechar}>
        <View style={estilos.painel}>
          <View style={estilos.painelCabecalho}>
            <TouchableOpacity style={estilos.botaoX} onPress={fechar}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>X</Text>
            </TouchableOpacity>
            <Text style={estilos.tituloPainel}>Filtros</Text>
            <TouchableOpacity
              onPress={() => {
                setFiltroTipo('Todos');
                setFiltroAcesso('Todos');
              }}
            >
              <Text style={{ fontSize: 13, color: '#6393F2', fontWeight: '500' }}>Limpar</Text>
            </TouchableOpacity>
          </View>

          <Text style={estilos.labelFiltro}>Esporte</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {FILTROS_TIPO.map((f) => (
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
            {FILTROS_ACESSO.map((f) => (
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
  );
}
