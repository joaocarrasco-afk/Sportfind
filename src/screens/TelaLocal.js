import { useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../style';
import { useAppState } from '../state/AppStateContext';

export default function TelaLocal({ navigation }) {
  const { selectedPlace } = useAppState();

  useEffect(() => {
    if (!selectedPlace) {
      navigation.goBack();
    }
  }, [navigation, selectedPlace]);

  if (!selectedPlace) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <View style={styles.detailImage}>
          <Image source={{ uri: selectedPlace.image }} style={styles.detailImage} />
          <TouchableOpacity style={styles.backButtonOnDetail} onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 30, bottom: 7 }}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 32 }}>{selectedPlace.emoji}</Text>
            <Text style={styles.detailTitle}>{selectedPlace.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
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
                {selectedPlace.access}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#f3f3f3', borderColor: '#ccc' }]}>
              <Text style={[styles.tagText, { color: '#555' }]}>📍 {selectedPlace.distance}</Text>
            </View>
          </View>
          <Text style={styles.detailDescription}>{selectedPlace.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
