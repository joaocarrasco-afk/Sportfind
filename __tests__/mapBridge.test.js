import {
  buildMapMessagePayload,
  MAP_WEB_MESSAGE_TYPE,
  parseMapMessage,
} from '../src/features/map/mapBridge';

describe('mapBridge', () => {
  it('ignores plain numeric payload (only typed JSON)', () => {
    expect(parseMapMessage('4')).toBeNull();
  });

  it('parses json payload', () => {
    const payload = JSON.stringify({ type: MAP_WEB_MESSAGE_TYPE, placeId: 2 });
    expect(parseMapMessage(payload)).toBe(2);
  });

  it('returns null for unsupported payload', () => {
    expect(parseMapMessage('invalid')).toBeNull();
  });

  it('builds typed payload', () => {
    const payload = JSON.parse(buildMapMessagePayload(9));
    expect(payload.type).toBe(MAP_WEB_MESSAGE_TYPE);
    expect(payload.placeId).toBe(9);
  });
});
