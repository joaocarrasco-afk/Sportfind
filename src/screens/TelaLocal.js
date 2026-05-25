import { useMemo } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import styles from '../../style';
import { spacing } from '../../style/tokens';
import InfraestruturaChips from '../components/InfraestruturaChips';
import { useAppState } from '../state/AppStateContext';

function rotuloAcesso(acesso) {
  if (acesso === 'Publico') return 'Público';
  if (acesso === 'Temporario') return 'Temporário';
  return acesso;
}

export default function TelaLocal({ navigation }) {
  const route = useRoute();
  const { places, setSelectedPlaceId } = useAppState();
  const placeIdParam = route.params?.placeId;

  const selectedPlace = useMemo(() => {
    const id = Number(placeIdParam);
    if (!Number.isInteger(id) || id <= 0) return null;
    return places.find((place) => place.id === id) ?? null;
  }, [places, placeIdParam]);

  function voltar() {
    setSelectedPlaceId(null);
    navigation.goBack();
  }

  if (!selectedPlace) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
        <TouchableOpacity onPress={voltar} style={{ alignSelf: 'center', padding: 16 }}>
          <Text style={{ color: '#9756CA', fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <View style={styles.detailImage}>
          <Image source={{ uri: selectedPlace.image }} style={styles.detailImage} />
          <TouchableOpacity style={styles.backButtonOnDetail} onPress={voltar}>
            <Text style={{ fontSize: 30, bottom: 7 }}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 32 }}>{selectedPlace.emoji}</Text>
            <Text style={styles.detailTitle}>{selectedPlace.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <View
              style={[
                styles.tag,
                { backgroundColor: `${selectedPlace.color}22`, borderColor: selectedPlace.color },
              ]}
            >
              <Text style={[styles.tagText, { color: selectedPlace.color }]}>{selectedPlace.type}</Text>
            </View>
            <View
              style={[
                styles.tag,
                {
                  backgroundColor: selectedPlace.access === 'Publico' ? '#e8f5e9' : '#fce4ec',
                  borderColor: selectedPlace.access === 'Publico' ? '#4CAF50' : '#e91e63',
                },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  { color: selectedPlace.access === 'Publico' ? '#2e7d32' : '#c62828' },
                ]}
              >
                {rotuloAcesso(selectedPlace.access)}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#f3f3f3', borderColor: '#ccc' }]}>
              <Text style={[styles.tagText, { color: '#555' }]}>📍 {selectedPlace.distance}</Text>
            </View>
          </View>

          {selectedPlace.address ? (
            <Text style={[styles.detailDescription, { marginBottom: spacing.sm }]}>
              📍 {selectedPlace.address}
            </Text>
          ) : null}

          <Text style={styles.detailInfraTitle}>Infraestrutura</Text>
          <InfraestruturaChips ids={selectedPlace.infraestrutura} />

          <Text style={[styles.detailInfraTitle, { marginTop: spacing.lg }]}>Sobre o local</Text>
          <Text style={styles.detailDescription}>{selectedPlace.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
