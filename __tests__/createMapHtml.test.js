import { createMapHtml } from '../src/features/map/createMapHtml';
import { MAP_WEB_MESSAGE_TYPE } from '../src/features/map/mapBridge';

describe('createMapHtml', () => {
  const places = [
    { id: 1, lat: -23.5445, lng: -46.3106, emoji: '🏀' },
    { id: 2, lat: -23.5452, lng: -46.3091, emoji: '🛹' },
  ];

  it('hides leaflet attribution control', () => {
    const html = createMapHtml(places);
    expect(html).toContain('.leaflet-control-attribution { display: none !important; }');
  });

  it('renders user location marker support', () => {
    const html = createMapHtml(places, { lat: -23.54, lng: -46.31 });
    expect(html).toContain('sportfind-user-dot');
    expect(html).toContain('setUserLocation');
    expect(html).toContain('INITIAL_USER');
  });

  it('embeds places and message type for bridge', () => {
    const html = createMapHtml(places);
    expect(html).toContain(MAP_WEB_MESSAGE_TYPE);
    expect(html).toContain('"id":1');
    expect(html).toContain('sendToApp');
  });
});
