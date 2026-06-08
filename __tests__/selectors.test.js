import { filterPlaces } from '../src/domain/places';

const PLACES_FIXTURE = [
  {
    id: 1,
    name: 'Basquete Max Feffer',
    type: 'Basquete',
    sports: ['Basquete'],
    access: 'Publico',
    infraestrutura: ['iluminacao'],
    description: 'Quadra de basquete',
  },
  {
    id: 2,
    name: 'Suzano Skatepark',
    type: 'Skate',
    sports: ['Skate'],
    access: 'Publico',
    infraestrutura: ['iluminacao'],
    description: 'Pista de skate',
  },
  {
    id: 3,
    name: 'Campo Society',
    type: 'Futebol',
    sports: ['Futebol'],
    access: 'Privado',
    infraestrutura: ['vestiario'],
    description: 'Campo society',
  },
  {
    id: 4,
    name: 'Arena Tenis Clube',
    type: 'Tenis',
    sports: ['Tenis'],
    access: 'Privado',
    infraestrutura: ['vestiario'],
    description: 'Quadras de tenis',
  },
  {
    id: 5,
    name: 'Quadra Municipal',
    type: 'Poliesportivo',
    sports: ['Basquete', 'Futebol', 'Tenis'],
    access: 'Publico',
    infraestrutura: ['iluminacao'],
    description: 'Quadra poliesportiva municipal',
  },
];

describe('filterPlaces', () => {
  it('returns all places with default filters', () => {
    const result = filterPlaces({ places: PLACES_FIXTURE });
    expect(result).toHaveLength(PLACES_FIXTURE.length);
  });

  it('filters by single sport via sportFilters', () => {
    const result = filterPlaces({
      places: PLACES_FIXTURE,
      sportFilters: ['Skate'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Suzano Skatepark');
  });

  it('filters by multiple sports (stackable)', () => {
    const result = filterPlaces({
      places: PLACES_FIXTURE,
      sportFilters: ['Futebol', 'Basquete'],
    });
    expect(result.map((p) => p.type).sort()).toEqual(['Basquete', 'Futebol', 'Poliesportivo']);
  });

  it('filters by search text', () => {
    const result = filterPlaces({
      places: PLACES_FIXTURE,
      search: 'quadra',
    });
    expect(result.map((place) => place.id)).toEqual([5]);
  });
});
