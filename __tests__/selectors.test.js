import { filterPlaces, PLACES } from '../src/domain/places';

describe('filterPlaces', () => {
  it('returns all places with default filters', () => {
    const result = filterPlaces({ places: PLACES });
    expect(result).toHaveLength(PLACES.length);
  });

  it('filters by single sport via sportFilters', () => {
    const result = filterPlaces({
      places: PLACES,
      sportFilters: ['Skate'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Suzano Skatepark');
  });

  it('filters by multiple sports (stackable)', () => {
    const result = filterPlaces({
      places: PLACES,
      sportFilters: ['Futebol', 'Basquete'],
    });
    expect(result.map((p) => p.type).sort()).toEqual(['Basquete', 'Futebol']);
  });

  it('filters by search text', () => {
    const result = filterPlaces({
      places: PLACES,
      search: 'quadra',
    });
    expect(result.map((place) => place.id)).toEqual([5]);
  });
});
