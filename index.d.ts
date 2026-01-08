export type GeoData = Record<string, unknown>;

export type GeoItem<TData extends GeoData = GeoData> = {
  id: string | number;
  latitude: number;
  longitude: number;
  data: TData;
};

export function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number;

export function addItem<TData extends GeoData>(
  items: GeoItem<TData>[],
  item: GeoItem<TData>
): GeoItem<TData>[];

export function removeItemById<TData extends GeoData>(
  items: GeoItem<TData>[],
  id: string | number
): GeoItem<TData>[];

export function findWithinRadius<TData extends GeoData>(
  items: GeoItem<TData>[],
  latitude: number,
  longitude: number,
  radiusMeters: number
): GeoItem<TData>[];
