import { FILTER_ALL } from './filters';

const normalize = (value) => value.trim().toLowerCase();

export const filterPlaces = ({
  places,
  sportFilters = [],
  infraFilters = [],
  typeFilter,
  accessFilter = FILTER_ALL,
  search = '',
}) => {
  const sports =
    sportFilters?.length > 0
      ? sportFilters
      : typeFilter && typeFilter !== FILTER_ALL
        ? [typeFilter]
        : [];

  function combinaEsporte(place) {
    if (sports.length === 0) return true;
    if (sports.includes(place.type)) return true;
    if (Array.isArray(place.sports) && place.sports.some((s) => sports.includes(s))) return true;
    return false;
  }

  function combinaInfra(place) {
    if (infraFilters.length === 0) return true;
    const lista = Array.isArray(place.infraestrutura) ? place.infraestrutura : [];
    return infraFilters.every((id) => lista.includes(id));
  }

  return places.filter(
    (place) =>
      combinaEsporte(place) &&
      combinaInfra(place) &&
      (accessFilter === FILTER_ALL || place.access === accessFilter) &&
      (normalize(place.name).includes(normalize(search)) ||
        normalize(place.address ?? '').includes(normalize(search))),
  );
};
