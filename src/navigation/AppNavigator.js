import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import TelaFeed from '../screens/TelaFeed';
import TelaCriarPost from '../screens/TelaCriarPost';
import TelaMensagens from '../screens/TelaMensagens';
import TelaChatConversa from '../screens/TelaChatConversa';
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
import TelaCriarLocal from '../screens/TelaCriarLocal';
import TelaCriarPartida from '../screens/TelaCriarPartida';
import TelaPartidas from '../screens/TelaPartidas';
import TelaPartidaDetalhes from '../screens/TelaPartidaDetalhes';
import TelaBuscaFeed from '../screens/TelaBuscaFeed';
import TelaPerfilUsuario from '../screens/TelaPerfilUsuario';
import TelaListaConexoes from '../screens/TelaListaConexoes';
import { BOTTOM_TABS, TAB_IDS } from '../domain/places';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../style';
import { colors, spacing } from '../../style/tokens';
/** Área útil dos ícones dentro da tab bar (sem home indicator) */
const TAB_BAR_CONTENT_HEIGHT = 56;

const Tab = createBottomTabNavigator();
const MapStack = createNativeStackNavigator();
const FeedStack = createNativeStackNavigator();
const CreateStack = createNativeStackNavigator();
const PerfilStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

function AppTabBarLabel({ focused, label, iconName, iconFocused, isCreate }) {
  if (isCreate) {
    return (
      <View style={[styles.tabBarItem, styles.tabBarItemCreate]}>
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
        <Ionicons name={name} size={20} color={iconColor} />
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]} numberOfLines={1}>
        {label}
      </Text>
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

function FeedStackScreen() {
  return (
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name="TelaFeed" component={TelaFeed} />
      <FeedStack.Screen name="TelaBusca" component={TelaBusca} />
      <FeedStack.Screen name="TelaMensagens" component={TelaMensagens} />
      <FeedStack.Screen name="TelaChatConversa" component={TelaChatConversa} />
      <FeedStack.Screen name="TelaBuscaFeed" component={TelaBuscaFeed} />
      <FeedStack.Screen name="TelaLocal" component={TelaLocal} />
      <FeedStack.Screen name="TelaPerfilUsuario" component={TelaPerfilUsuario} />
      <FeedStack.Screen name="TelaListaConexoes" component={TelaListaConexoes} />
    </FeedStack.Navigator>
  );
}

function CreateStackScreen() {
  return (
    <CreateStack.Navigator screenOptions={{ headerShown: false }}>
      <CreateStack.Screen name="TelaCriar" component={TelaCriar} />
      <CreateStack.Screen name="TelaCriarLocal" component={TelaCriarLocal} />
      <CreateStack.Screen name="TelaCriarPartida" component={TelaCriarPartida} />
      <CreateStack.Screen name="TelaCriarPost" component={TelaCriarPost} />
    </CreateStack.Navigator>
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
      <PerfilStack.Screen name="TelaPerfilUsuario" component={TelaPerfilUsuario} options={{ headerShown: false }} />
      <PerfilStack.Screen name="TelaListaConexoes" component={TelaListaConexoes} options={{ headerShown: false }} />
    </PerfilStack.Navigator>
  );
}

function AppTabs() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = BOTTOM_TABS.find((item) => item.id === route.name);
        const isCreate = route.name === TAB_IDS.CREATE;
        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            ...styles.tabBar,
            height: tabBarHeight,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom,
          },
          tabBarItemStyle: {
            marginVertical: 0,
            paddingVertical: 0,
          },
          tabBarIconStyle: {
            marginTop: 0,
            marginBottom: 0,
          },
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
      <Tab.Screen
        name={TAB_IDS.FEED}
        component={FeedStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(TAB_IDS.FEED, { screen: 'TelaFeed' });
          },
        })}
      />
      <Tab.Screen name={TAB_IDS.CREATE} component={CreateStackScreen} />
      <Tab.Screen name={TAB_IDS.NOTIFICATION} component={TelaNotificacao} />
      <Tab.Screen name={TAB_IDS.PROFILE} component={PerfilStackScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="TelaSplash" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="TelaSplash" component={TelaSplash} />
        <RootStack.Screen name="TelaLogin" component={TelaLogin} options={{ headerShown: false }} />
        <RootStack.Screen name="TelaCadastro" component={TelaCadastro} />
        <RootStack.Screen name="TelaSenha" component={TelaSenha} />
        <RootStack.Screen name="TelaNovaSenha" component={TelaNovaSenha} />
        <RootStack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
        <RootStack.Screen name="TelaPartidas" component={TelaPartidas} />
        <RootStack.Screen name="TelaPartidaDetalhes" component={TelaPartidaDetalhes} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
