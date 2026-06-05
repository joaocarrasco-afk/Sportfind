import {
  PICKER_MAP_APP_MESSAGE_TYPE,
  PICKER_MAP_MESSAGE_TYPE,
} from './pickerMapBridge';

const BRAND_PURPLE = '#9756CA';
const DEFAULT_LAT = -23.5445;
const DEFAULT_LNG = -46.3106;

export const createPickerMapHtml = (initialLat = DEFAULT_LAT, initialLng = DEFAULT_LNG) => {
  const messageType = JSON.stringify(PICKER_MAP_MESSAGE_TYPE);
  const appMessageType = JSON.stringify(PICKER_MAP_APP_MESSAGE_TYPE);
  const startLat = Number.isFinite(Number(initialLat)) ? Number(initialLat) : DEFAULT_LAT;
  const startLng = Number.isFinite(Number(initialLng)) ? Number(initialLng) : DEFAULT_LNG;

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
      .sportfind-picker-pin {
        background: ${BRAND_PURPLE};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #fff;
        box-shadow: 0 3px 10px rgba(151, 86, 202, 0.55);
        cursor: grab;
      }
      .sportfind-picker-pin:active { cursor: grabbing; }
      .sportfind-picker-pin-inner {
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <div id="mapa"></div>
    <script>
      const MESSAGE_TYPE = ${messageType};
      const APP_MESSAGE_TYPE = ${appMessageType};
      const START = { lat: ${startLat}, lng: ${startLng} };

      const mapa = L.map('mapa', { zoomControl: false }).setView([START.lat, START.lng], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapa);

      function pickerIcon() {
        return L.divIcon({
          html: '<div class="sportfind-picker-pin"><div class="sportfind-picker-pin-inner"></div></div>',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          className: '',
        });
      }

      let pinMarker = L.marker([START.lat, START.lng], {
        icon: pickerIcon(),
        draggable: true,
        autoPan: true,
      }).addTo(mapa);

      function sendPinMoved(lat, lng) {
        const payload = JSON.stringify({ type: MESSAGE_TYPE, lat: lat, lng: lng });
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

      function setPin(lat, lng, zoom) {
        if (!isFiniteNumber(lat) || !isFiniteNumber(lng)) return;
        pinMarker.setLatLng([lat, lng]);
        const nextZoom = isFiniteNumber(zoom) ? zoom : Math.max(mapa.getZoom(), 17);
        mapa.flyTo([lat, lng], nextZoom, { animate: true, duration: 0.6 });
      }

      pinMarker.on('dragend', function () {
        const pos = pinMarker.getLatLng();
        sendPinMoved(pos.lat, pos.lng);
      });

      mapa.on('click', function (e) {
        if (!e || !e.latlng) return;
        setPin(e.latlng.lat, e.latlng.lng, mapa.getZoom());
        sendPinMoved(e.latlng.lat, e.latlng.lng);
      });

      function handleAppCommand(raw) {
        if (!raw) return;
        let data = raw;
        if (typeof raw === 'string') {
          try { data = JSON.parse(raw); } catch { return; }
        }
        if (!data || data.type !== APP_MESSAGE_TYPE) return;
        if (data.action === 'setPin') {
          setPin(Number(data.lat), Number(data.lng), data.zoom == null ? undefined : Number(data.zoom));
        }
      }

      window.addEventListener('message', function (event) {
        if (!event) return;
        handleAppCommand(event.data);
      });
    </script>
  </body>
</html>`;
};
