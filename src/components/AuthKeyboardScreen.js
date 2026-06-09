import { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../style';

function resetScroll(ref) {
  if (!ref) return;
  if (typeof ref.scrollTo === 'function') {
    ref.scrollTo({ x: 0, y: 0, animated: true });
    return;
  }
  if (typeof ref.scrollToPosition === 'function') {
    ref.scrollToPosition(0, 0, true);
  }
}

export default function AuthKeyboardScreen({ header = null, children }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  function fecharTeclado() {
    Keyboard.dismiss();
    resetScroll(scrollRef.current);
  }

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const onHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      resetScroll(scrollRef.current);
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  return (
    <View
      style={[
        styles.authScreen,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <KeyboardAwareScrollView
        innerRef={(ref) => {
          scrollRef.current = ref;
        }}
        enableOnAndroid
        enableAutomaticScroll
        enableResetScrollToCoords={false}
        extraScrollHeight={Platform.OS === 'android' ? 72 : 32}
        extraHeight={Platform.OS === 'android' ? 100 : 64}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.authScrollContent}
      >
        <Pressable
          style={[
            styles.authPressableArea,
            keyboardVisible && styles.authPressableAreaKeyboard,
          ]}
          onPress={fecharTeclado}
          accessible={false}
        >
          {header}
          {children}
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  );
}
