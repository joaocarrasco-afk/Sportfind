import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import TelaFeed from '../screens/TelaFeed';
import TelaBusca from '../screens/TelaBusca';
import TelaCadastro from '../screens/TelaCadastro';
import TelaSenha from '../screens/TelaSenha';
import TelaNovaSenha from '../screens/TelaNovaSenha';
import TelaSplash from '../screens/TelaSplash';
import TelaLogin from '../screens/TelaLogin';
import TelaUsuario from '../screens/TelaUsuario';
import TelaConta from '../screens/TelaConta';
import TelaPreferencias from '../screens/TelaPreferencias';
import TelaPrivacidade from '../screens/TelaPrivacidade';
import TelaLocal from '../screens/TelaLocal';
import TelaMapa from '../screens/TelaMapa';
import TelaNotificacao from '../screens/TelaNotificacao';
import TelaCriar from '../screens/TelaCriar';
import { BOTTOM_TABS, TAB_IDS } from '../domain/places';
import { Text, View } from 'react-native';
import styles from '../../style';
import { colors } from '../../style/tokens';

const Tab = createBottomTabNavigator();
const MapStack = createNativeStackNavigator();
const PerfilStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

function AppTabBarLabel({ focused, label, iconName, iconFocused, isCreate }) {
  if (isCreate) {
    return (
      <View style={styles.tabBarItem}>
        <View style={styles.tabPillCreate}>
          <Ionicons name="add" size={28} color={colors.textOnPurple} />
        </View>
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
      </View>
    );
  }

  const name = focused ? iconFocused : iconName;
  const iconColor = focused ? colors.purple : colors.textSecondary;

  return (
    <View style={styles.tabBarItem}>
      <View style={[styles.tabPill, focused && styles.tabPillActive]}>
        <Ionicons name={name} size={22} color={iconColor} />
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

function MapStackScreen() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="TelaMapa" component={TelaMapa} />
      <MapStack.Screen name="TelaBusca" component={TelaBusca} />
      <MapStack.Screen name="TelaLocal" component={TelaLocal} />
    </MapStack.Navigator>
  );
}

function PerfilStackScreen() {
  return (
    <PerfilStack.Navigator
      screenOptions={{
        headerTintColor: colors.purple,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <PerfilStack.Screen name="PerfilPrincipal" component={TelaUsuario} options={{ headerShown: false }} />
      <PerfilStack.Screen name="TelaConta" component={TelaConta} options={{ title: 'Conta' }} />
      <PerfilStack.Screen name="TelaPreferencias" component={TelaPreferencias} options={{ title: 'Preferências' }} />
      <PerfilStack.Screen name="TelaPrivacidade" component={TelaPrivacidade} options={{ title: 'Privacidade' }} />
    </PerfilStack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = BOTTOM_TABS.find((item) => item.id === route.name);
        const isCreate = route.name === TAB_IDS.CREATE;
        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused }) => (
            <AppTabBarLabel
              focused={focused}
              label={tab?.label ?? ''}
              iconName={tab?.icon ?? 'ellipse'}
              iconFocused={tab?.iconFocused ?? tab?.icon ?? 'ellipse'}
              isCreate={isCreate}
            />
          ),
        };
      }}
    >
      <Tab.Screen
        name={TAB_IDS.MAP}
        component={MapStackScreen}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate(TAB_IDS.MAP, { screen: 'TelaMapa' });
          },
        })}
      />
      <Tab.Screen name={TAB_IDS.FEED} component={TelaFeed} />
      <Tab.Screen name={TAB_IDS.CREATE} component={TelaCriar} />
      <Tab.Screen name={TAB_IDS.NOTIFICATION} component={TelaNotificacao} />
      <Tab.Screen name={TAB_IDS.PROFILE} component={PerfilStackScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="AppTabs" screenOptions={{ headerShown: true }}>
        <RootStack.Screen name="TelaSplash" component={TelaSplash} />
        <RootStack.Screen name="TelaLogin" component={TelaLogin} />
        <RootStack.Screen name="TelaCadastro" component={TelaCadastro} />
        <RootStack.Screen name="TelaSenha" component={TelaSenha} />
        <RootStack.Screen name="TelaNovaSenha" component={TelaNovaSenha} />
        <RootStack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
