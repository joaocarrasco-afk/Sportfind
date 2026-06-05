import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { createPickerMapHtml } from '../features/map/createPickerMapHtml';
import { PICKER_MAP_APP_MESSAGE_TYPE, parsePickerMapMessage } from '../features/map/pickerMapBridge';

export default function MapaPinPicker({ lat, lng, onPinMove, style }) {
  const webViewRef = useRef(null);
  const iframeRef = useRef(null);
  const ignorarProximoComando = useRef(false);

  const mapHtml = useMemo(() => createPickerMapHtml(lat, lng), []);

  const enviarComando = useCallback(
    (payload) => {
      const message = JSON.stringify(payload);
      if (Platform.OS === 'web') {
        try {
          iframeRef.current?.contentWindow?.postMessage(message, '*');
        } catch {
          // ignore
        }
        return;
      }
      const script = `try { window.postMessage(${JSON.stringify(message)}, '*'); } catch (e) {} true;`;
      webViewRef.current?.injectJavaScript?.(script);
    },
    [],
  );

  useEffect(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (ignorarProximoComando.current) {
      ignorarProximoComando.current = false;
      return;
    }
    enviarComando({
      type: PICKER_MAP_APP_MESSAGE_TYPE,
      action: 'setPin',
      lat,
      lng,
      zoom: 17,
    });
  }, [enviarComando, lat, lng]);

  const handleMapMessage = useCallback(
    (raw) => {
      const coords = parsePickerMapMessage(raw);
      if (!coords) return;
      ignorarProximoComando.current = true;
      onPinMove?.(coords.lat, coords.lng);
    },
    [onPinMove],
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;

    const handler = (event) => {
      if (event?.data == null) return;
      const raw =
        typeof event.data === 'string'
          ? event.data
          : typeof event.data === 'object'
            ? JSON.stringify(event.data)
            : String(event.data);
      handleMapMessage(raw);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [handleMapMessage]);

  return (
    <View style={style} collapsable={false}>
      {Platform.OS === 'web' ? (
        <iframe
          title="Mapa de localização"
          style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
          srcDoc={mapHtml}
          ref={iframeRef}
        />
      ) : (
        <WebView
          ref={webViewRef}
          style={{ flex: 1, opacity: 0.99 }}
          source={{ html: mapHtml }}
          onMessage={(event) => handleMapMessage(event.nativeEvent.data)}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={['*']}
          scrollEnabled={false}
          bounces={false}
        />
      )}
    </View>
  );
}
