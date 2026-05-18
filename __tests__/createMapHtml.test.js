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

  it('renders clickable markers without cluster plugin', () => {
    const html = createMapHtml(places);
    expect(html).not.toContain('markercluster');
    expect(html).toContain('sportfind-marker');
    expect(html).toContain('marker.on(\'click\'');
  });

  it('embeds places and message type for bridge', () => {
    const html = createMapHtml(places);
    expect(html).toContain(MAP_WEB_MESSAGE_TYPE);
    expect(html).toContain('"id":1');
    expect(html).toContain('sendToApp');
  });
});
