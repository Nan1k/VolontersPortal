import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { boundingExtent } from 'ol/extent';
import 'ol/ol.css';
import customMarkerImage from './marker.png';

const DEFAULT_CENTER = [37.6173, 55.7558];
const DEFAULT_ZOOM = 10;

/** [lon, lat] WGS84 — имена как в фильтре / `city_name` из API. */
const CITY_CENTER_LON_LAT = {
  Москва: [37.6173, 55.7558],
  'Санкт-Петербург': [30.3351, 59.9343],
  Новосибирск: [82.9346, 55.0415],
  Екатеринбург: [60.5972, 56.8389],
  Иркутск: [104.2806, 52.2864],
  Казань: [49.1064, 55.7963],
};

function markerStyle() {
  return new Style({
    image: new Icon({
      src: customMarkerImage,
      scale: 0.1,
    }),
  });
}

function resolveFocusCenters(focusCityNames) {
  if (!Array.isArray(focusCityNames) || focusCityNames.length === 0) return [];
  return focusCityNames
    .map((name) => (name && CITY_CENTER_LON_LAT[name] ? fromLonLat(CITY_CENTER_LON_LAT[name]) : null))
    .filter(Boolean);
}

/**
 * @param {object[]} events
 * @param {string[]} [focusCityNames] — выбранные города в фильтре (как в API)
 */
function EventMap({ events, focusCityNames = [] }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const vectorSourceRef = useRef(null);

  useEffect(() => {
    const el = mapDivRef.current;
    if (!el) return undefined;

    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;

    const map = new Map({
      target: el,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: vectorSource }),
      ],
      view: new View({
        center: fromLonLat(DEFAULT_CENTER),
        zoom: DEFAULT_ZOOM,
      }),
    });
    mapRef.current = map;

    return () => {
      vectorSourceRef.current = null;
      mapRef.current = null;
      map.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const vectorSource = vectorSourceRef.current;
    if (!map || !vectorSource) return;

    const list = Array.isArray(events) ? events : [];
    const withCoords = list.filter(
      (e) =>
        e != null &&
        e.longitude != null &&
        e.latitude != null &&
        Number.isFinite(Number(e.longitude)) &&
        Number.isFinite(Number(e.latitude))
    );

    vectorSource.clear();
    for (const event of withCoords) {
      const feature = new Feature({
        geometry: new Point(fromLonLat([Number(event.longitude), Number(event.latitude)])),
        name: event.name,
        description: event.description,
      });
      feature.setStyle(markerStyle());
      feature.setId(String(event.id));
      vectorSource.addFeature(feature);
    }

    const view = map.getView();
    view.cancelAnimations();

    const markerPoints = withCoords.map((e) => fromLonLat([Number(e.longitude), Number(e.latitude)]));
    const selected = Array.isArray(focusCityNames) ? focusCityNames : [];
    const cityCenters = resolveFocusCenters(selected);

    const fitPadding = [48, 48, 48, 48];

    // Один город в фильтре и известен центр — всегда перелёт на город (даже без меток / «чужие» координаты у событий)
    if (selected.length === 1 && cityCenters.length === 1) {
      view.animate({
        center: cityCenters[0],
        zoom: 11,
        duration: 380,
      });
      return;
    }

    // Несколько городов — кадр по их центрам и меткам
    if (selected.length >= 2 && cityCenters.length >= 1) {
      const pts = [...cityCenters, ...markerPoints];
      view.fit(boundingExtent(pts), {
        padding: fitPadding,
        maxZoom: 6,
        minZoom: 3,
        duration: 380,
      });
      return;
    }

    // Фильтр по городу, но название не в справочнике — хотя бы по меткам
    if (selected.length >= 1 && cityCenters.length === 0 && markerPoints.length > 0) {
      view.fit(boundingExtent(markerPoints), {
        padding: fitPadding,
        maxZoom: 14,
        duration: 280,
      });
      return;
    }

    if (markerPoints.length > 0) {
      view.fit(boundingExtent(markerPoints), {
        padding: fitPadding,
        maxZoom: 14,
        duration: 280,
      });
      return;
    }

    if (cityCenters.length > 0) {
      view.fit(boundingExtent(cityCenters), {
        padding: fitPadding,
        maxZoom: cityCenters.length > 1 ? 6 : 11,
        minZoom: 3,
        duration: 380,
      });
      return;
    }

    view.setCenter(fromLonLat(DEFAULT_CENTER));
    view.setZoom(DEFAULT_ZOOM);
  }, [events, focusCityNames]);

  return (
    <div
      ref={mapDivRef}
      style={{ height: '400px', width: '100%', borderRadius: '16px', overflow: 'hidden' }}
    />
  );
}

export default EventMap;
