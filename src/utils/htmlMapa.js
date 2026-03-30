export const htmlMapa = (locais) => `
  <!DOCTYPE html><html><head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>* {margin:0;padding:0} html,body,#mapa{width:100%;height:100%}</style>
  </head><body><div id="mapa"></div><script>
    const mapa = L.map('mapa',{zoomControl:false}).setView([-23.5445,-46.3106],15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);
    function sendToApp(payload) {
      try {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(String(payload));
          return;
        }
        if (window.parent && window.parent !== window && window.parent.postMessage) {
          window.parent.postMessage(String(payload), '*');
        }
      } catch (e) {}
    }
    ${locais
      .map(
        (l) => `
      L.marker([${l.lat},${l.lng}],{icon:L.divIcon({
        html:'<div style="background:${l.cor};width:36px;height:36px;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${l.emoji}</div>',
        iconSize:[36,36],iconAnchor:[18,18],className:''
      })}).addTo(mapa).on('click',()=>sendToApp('${l.id}'));
    `
      )
      .join('')}
  </script></body></html>
`;
