import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import TelaAbaPlaceholder from '../screens/TelaAbaPlaceholder';
import TelaBusca from '../screens/TelaBusca';
import TelaLocal from '../screens/TelaLocal';
import TelaMapa from '../screens/TelaMapa';
import { BOTTOM_TABS, TAB_CONTENT, TAB_IDS } from '../domain/places';
import { Platform, Text, View } from 'react-native';
import styles from '../../style';
import { useAppState } from '../state/AppStateContext';
import { parseMapMessage } from '../features/map/mapBridge';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppTabBarLabel({ focused, label, icon }) {
  return (
    <View style={styles.tabBarItem}>
      <View style={[styles.tabPill, focused && styles.tabPillActive]}>
        <Text style={styles.tabIcon}>{icon}</Text>
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

function TabPlaceholderScreen({ route }) {
  const content = TAB_CONTENT[route.name];
  return <TelaAbaPlaceholder conteudo={content} />;
}

function MapStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TelaMapa" component={TelaMapa} />
      <Stack.Screen name="TelaBusca" component={TelaBusca} />
      <Stack.Screen name="TelaLocal" component={TelaLocal} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = BOTTOM_TABS.find((item) => item.id === route.name);
        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          // React Navigation expects a render callback for tabBarIcon.
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <AppTabBarLabel focused={focused} label={tab?.label ?? ''} icon={tab?.icon ?? ''} />
          ),
        };
      }}
    >
      <Tab.Screen name={TAB_IDS.MAP} component={MapStackScreen} />
      <Tab.Screen name={TAB_IDS.FEED} component={TabPlaceholderScreen} />
      <Tab.Screen name={TAB_IDS.CREATE} component={TabPlaceholderScreen} />
      <Tab.Screen name={TAB_IDS.NOTIFICATION} component={TabPlaceholderScreen} />
      <Tab.Screen name={TAB_IDS.PROFILE} component={TabPlaceholderScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { setSelectedPlaceId } = useAppState();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return undefined;
    }

    const handler = (event) => {
      const placeId = parseMapMessage(event?.data);
      if (Number.isFinite(placeId)) {
        setSelectedPlaceId(placeId);
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [setSelectedPlaceId]);

  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}
