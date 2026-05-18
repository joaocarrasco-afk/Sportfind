export const TAB_IDS = {
  MAP: 'mapa',
  FEED: 'feed',
  CREATE: 'criar',
  NOTIFICATION: 'notificacao',
  PROFILE: 'perfil',
};

export const BOTTOM_TABS = [
  { id: TAB_IDS.MAP, label: 'Mapa', icon: 'location', iconFocused: 'location' },
  { id: TAB_IDS.FEED, label: 'Feed', icon: 'newspaper-outline', iconFocused: 'newspaper' },
  { id: TAB_IDS.CREATE, label: 'Criar', icon: 'add', iconFocused: 'add' },
  {
    id: TAB_IDS.NOTIFICATION,
    label: 'Alertas',
    icon: 'notifications-outline',
    iconFocused: 'notifications',
  },
  { id: TAB_IDS.PROFILE, label: 'Perfil', icon: 'person-outline', iconFocused: 'person' },
];

export const TAB_CONTENT = {
  [TAB_IDS.FEED]: { icon: 'newspaper', title: 'Feed', subtitle: 'Nenhum feed ainda' },
  [TAB_IDS.PROFILE]: { icon: 'person', title: 'Meu Perfil', subtitle: '' },
  [TAB_IDS.CREATE]: { icon: 'add', title: 'Criar', subtitle: 'Em construcao' },
  [TAB_IDS.NOTIFICATION]: { icon: 'notifications', title: 'Notificacao', subtitle: 'Sem notificacoes' },
};
