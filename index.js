const EARTH_RADIUS_M = 6371008.8;

function ensureArray(value, name) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${name} must be an array`);
  }
}

function ensureFiniteNumber(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`);
  }
}

function ensureLatLon(latitude, longitude) {
  ensureFiniteNumber(latitude, "latitude");
  ensureFiniteNumber(longitude, "longitude");
  if (latitude < -90 || latitude > 90) {
    throw new RangeError("latitude must be between -90 and 90");
  }
  if (longitude < -180 || longitude > 180) {
    throw new RangeError("longitude must be between -180 and 180");
  }
}

function normalizeIdValue(id) {
  if (typeof id === "string" && id.trim() !== "") {
    return id;
  }
  if (typeof id === "number" && Number.isFinite(id)) {
    return String(id);
  }
  throw new TypeError("id must be a non-empty string or a finite number");
}

function ensureDataObject(data) {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("data must be an object");
  }
}

function normalizeItem(item) {
  if (!item || typeof item !== "object") {
    throw new TypeError("item must be an object");
  }
  normalizeIdValue(item.id);
  ensureLatLon(item.latitude, item.longitude);
  ensureDataObject(item.data);
  return {
    id: item.id,
    latitude: item.latitude,
    longitude: item.longitude,
    data: item.data
  };
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function distanceMeters(lat1, lon1, lat2, lon2) {
  ensureLatLon(lat1, lon1);
  ensureLatLon(lat2, lon2);
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);
  const sinDeltaPhi = Math.sin(deltaPhi / 2);
  const sinDeltaLambda = Math.sin(deltaLambda / 2);
  const a =
    sinDeltaPhi * sinDeltaPhi +
    Math.cos(phi1) * Math.cos(phi2) * sinDeltaLambda * sinDeltaLambda;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

export function addItem(items, item) {
  ensureArray(items, "items");
  const normalized = normalizeItem(item);
  return [...items, normalized];
}

export function removeItemById(items, id) {
  ensureArray(items, "items");
  const target = normalizeIdValue(id);
  return items.filter((item) => normalizeIdValue(item.id) !== target);
}

export function findWithinRadius(items, latitude, longitude, radiusMeters) {
  ensureArray(items, "items");
  ensureLatLon(latitude, longitude);
  ensureFiniteNumber(radiusMeters, "radiusMeters");
  if (radiusMeters < 0) {
    throw new RangeError("radiusMeters must be >= 0");
  }
  return items.filter((item) => {
    ensureLatLon(item.latitude, item.longitude);
    const distance = distanceMeters(latitude, longitude, item.latitude, item.longitude);
    return distance <= radiusMeters;
  });
}
