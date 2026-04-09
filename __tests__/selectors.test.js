import { filterPlaces, PLACES } from '../src/domain/places';

describe('filterPlaces', () => {
  it('returns all places with default filters', () => {
    const result = filterPlaces({ places: PLACES });
    expect(result).toHaveLength(PLACES.length);
  });

  it('filters by place type', () => {
    const result = filterPlaces({
      places: PLACES,
      typeFilter: 'Skate',
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Suzano Skatepark');
  });

  it('filters by search text', () => {
    const result = filterPlaces({
      places: PLACES,
      search: 'quadra',
    });
    expect(result.map((place) => place.id)).toEqual([5]);
  });
});
