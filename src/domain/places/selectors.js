import { FILTER_ALL } from './filters';

const normalize = (value) => value.trim().toLowerCase();

export const filterPlaces = ({
  places,
  typeFilter = FILTER_ALL,
  accessFilter = FILTER_ALL,
  search = '',
}) =>
  places.filter(
    (place) =>
      (typeFilter === FILTER_ALL || place.type === typeFilter) &&
      (accessFilter === FILTER_ALL || place.access === accessFilter) &&
      normalize(place.name).includes(normalize(search)),
  );
