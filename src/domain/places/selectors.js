import { FILTER_ALL } from './filters';

const normalize = (value) => value.trim().toLowerCase();

export const filterPlaces = ({
  places,
  sportFilters = [],
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

  return places.filter(
    (place) =>
      (sports.length === 0 || sports.includes(place.type)) &&
      (accessFilter === FILTER_ALL || place.access === accessFilter) &&
      normalize(place.name).includes(normalize(search)),
  );
};
