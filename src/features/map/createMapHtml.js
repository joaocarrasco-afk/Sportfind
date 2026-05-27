import { MAP_WEB_MESSAGE_TYPE } from './mapBridge';

const BRAND_PURPLE = '#9756CA';
const MAP_APP_MESSAGE_TYPE = 'sportfind:map:command';
const USER_BLUE = '#4285F4';

export const createMapHtml = (places, userLocation = null) => {
  const placesJson = JSON.stringify(
    places.map((place) => ({
      id: place.id,
      lat: place.lat,
      lng: place.lng,
      emoji: place.emoji ?? '📍',
    })),
  );

  const userLocJson = JSON.stringify(
    userLocation?.lat != null && userLocation?.lng != null
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : null,
  );

  const messageType = JSON.stringify(MAP_WEB_MESSAGE_TYPE);
  const appMessageType = JSON.stringify(MAP_APP_MESSAGE_TYPE);

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body, #mapa { width: 100%; height: 100%; }
      .leaflet-control-attribution { display: none !important; }
      .leaflet-marker-icon { pointer-events: auto !important; }
      .sportfind-marker {
        background: ${BRAND_PURPLE};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        line-height: 40px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(151, 86, 202, 0.5);
        cursor: pointer;
        pointer-events: auto;
      }
      .sportfind-user-pin { background: transparent; border: none; }
      .sportfind-user-marker {
        width: 22px;
        height: 22px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sportfind-user-dot {
        width: 16px;
        height: 16px;
        background: ${USER_BLUE};
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 0 6px rgba(66, 133, 244, 0.35);
      }
      .sportfind-user-pulse {
        position: absolute;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgba(66, 133, 244, 0.2);
        animation: sportfind-pulse 2s ease-out infinite;
      }
      @keyframes sportfind-pulse {
        0% { transform: scale(0.6); opacity: 0.9; }
        100% { transform: scale(1.8); opacity: 0; }
      }
    </style>
  </head>
  <body>
    <div id="mapa"></div>
    <script>
      const MESSAGE_TYPE = ${messageType};
      const APP_MESSAGE_TYPE = ${appMessageType};
      const PLACES = ${placesJson};
      const INITIAL_USER = ${userLocJson};

      const mapa = L.map('mapa', {
        zoomControl: false,
        tap: true,
      }).setView([-23.5445, -46.3106], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapa);

      let userMarker = null;

      function sendToApp(placeId) {
        const payload = JSON.stringify({ type: MESSAGE_TYPE, placeId: placeId });
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(payload);
          return;
        }
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(payload, '*');
        }
      }

      function isFiniteNumber(x) {
        return typeof x === 'number' && Number.isFinite(x);
      }

      function userLocationIcon() {
        return L.divIcon({
          html: '<div class="sportfind-user-marker"><div class="sportfind-user-pulse"></div><div class="sportfind-user-dot"></div></div>',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          className: 'sportfind-user-pin',
        });
      }

      function setUserLocation(lat, lng) {
        if (!isFiniteNumber(lat) || !isFiniteNumber(lng)) {
          if (userMarker) {
            mapa.removeLayer(userMarker);
            userMarker = null;
          }
          return;
        }
        const latlng = [lat, lng];
        if (userMarker) {
          userMarker.setLatLng(latlng);
        } else {
          userMarker = L.marker(latlng, {
            icon: userLocationIcon(),
            interactive: false,
            zIndexOffset: 2000,
          }).addTo(mapa);
        }
      }

      function centerMap(lat, lng, zoom) {
        if (!isFiniteNumber(lat) || !isFiniteNumber(lng)) return;
        const nextZoom = isFiniteNumber(zoom) ? zoom : Math.max(mapa.getZoom(), 16);
        mapa.flyTo([lat, lng], nextZoom, { animate: true, duration: 0.6 });
      }

      window.__sportfind_center = function(lat, lng, zoom) {
        centerMap(Number(lat), Number(lng), zoom == null ? undefined : Number(zoom));
      };

      window.__sportfind_setUserLocation = function(lat, lng) {
        setUserLocation(Number(lat), Number(lng));
      };

      function handleAppCommand(raw) {
        if (!raw) return;
        let data = raw;
        if (typeof raw === 'string') {
          try { data = JSON.parse(raw); } catch { return; }
        }
        if (!data || data.type !== APP_MESSAGE_TYPE) return;
        if (data.action === 'center') {
          centerMap(Number(data.lat), Number(data.lng), data.zoom == null ? undefined : Number(data.zoom));
        }
        if (data.action === 'setUserLocation') {
          setUserLocation(Number(data.lat), Number(data.lng));
        }
      }

      window.addEventListener('message', function(event) {
        if (!event) return;
        handleAppCommand(event.data);
      });

      PLACES.forEach(function (place) {
        const icon = L.divIcon({
          html: '<div class="sportfind-marker">' + place.emoji + '</div>',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          className: 'sportfind-pin',
        });

        const marker = L.marker([place.lat, place.lng], { icon: icon, interactive: true });
        marker.on('click', function (e) {
          if (e && e.originalEvent) {
            L.DomEvent.stopPropagation(e);
          }
          sendToApp(place.id);
        });
        marker.addTo(mapa);
      });

      if (INITIAL_USER && isFiniteNumber(INITIAL_USER.lat) && isFiniteNumber(INITIAL_USER.lng)) {
        setUserLocation(INITIAL_USER.lat, INITIAL_USER.lng);
      }

      if (PLACES.length === 1) {
        mapa.setView([PLACES[0].lat, PLACES[0].lng], 16);
      } else if (PLACES.length > 1) {
        const group = L.featureGroup(
          PLACES.map(function (p) {
            return L.marker([p.lat, p.lng]);
          }),
        );
        if (userMarker) group.addLayer(userMarker);
        mapa.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 15 });
      } else if (INITIAL_USER) {
        centerMap(INITIAL_USER.lat, INITIAL_USER.lng, 15);
      }
    </script>
  </body>
</html>`;
};
