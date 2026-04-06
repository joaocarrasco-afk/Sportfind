export const TAB_IDS = {
  MAP: 'mapa',
  FEED: 'feed',
  CREATE: 'criar',
  NOTIFICATION: 'notificacao',
  PROFILE: 'perfil',
};

export const BOTTOM_TABS = [
  { id: TAB_IDS.MAP, label: 'Mapa', icon: '🗺️' },
  { id: TAB_IDS.FEED, label: 'Feed', icon: '⭐' },
  { id: TAB_IDS.CREATE, label: 'Criar', icon: '➕' },
  { id: TAB_IDS.NOTIFICATION, label: 'Notificacao', icon: '🔔' },
  { id: TAB_IDS.PROFILE, label: 'Perfil', icon: '👤' },
];

export const TAB_CONTENT = {
  [TAB_IDS.FEED]: { icon: '⭐', title: 'Feed', subtitle: 'Nenhum feed ainda' },
  [TAB_IDS.PROFILE]: { icon: '👤', title: 'Meu Perfil', subtitle: '' },
  [TAB_IDS.CREATE]: { icon: '➕', title: 'Criar', subtitle: 'Em construcao' },
  [TAB_IDS.NOTIFICATION]: { icon: '🔔', title: 'Notificacao', subtitle: 'Sem notificacoes' },
};
