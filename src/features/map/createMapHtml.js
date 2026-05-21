import { MAP_WEB_MESSAGE_TYPE } from './mapBridge';

const BRAND_PURPLE = '#9756CA';

export const createMapHtml = (places) => {
  const placesJson = JSON.stringify(
    places.map((place) => ({
      id: place.id,
      lat: place.lat,
      lng: place.lng,
      emoji: place.emoji ?? '📍',
    })),
  );

  const messageType = JSON.stringify(MAP_WEB_MESSAGE_TYPE);

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
    </style>
  </head>
  <body>
    <div id="mapa"></div>
    <script>
      const MESSAGE_TYPE = ${messageType};
      const PLACES = ${placesJson};

      const mapa = L.map('mapa', {
        zoomControl: true,
        tap: true,
      }).setView([-23.5445, -46.3106], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapa);

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

      if (PLACES.length === 1) {
        mapa.setView([PLACES[0].lat, PLACES[0].lng], 16);
      } else if (PLACES.length > 1) {
        const group = L.featureGroup(
          PLACES.map(function (p) {
            return L.marker([p.lat, p.lng]);
          }),
        );
        mapa.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 15 });
      }
    </script>
  </body>
</html>`;
};
