import { Image, Text, View } from 'react-native';
import styles from '../../style';

export default function AuthHero({
  logoSource = require('../../assets/logo.png'),
  subtitle = null,
  showBrand = true,
}) {
  return (
    <View style={styles.authHero}>
      <View style={styles.authLogoCircle}>
        <Image source={logoSource} resizeMode="contain" style={styles.authLogo} />
      </View>
      {showBrand ? (
        <>
          <Text style={styles.authBrandTitle}>SportFind</Text>
          {subtitle ? <Text style={styles.authBrandSubtitle}>{subtitle}</Text> : null}
        </>
      ) : null}
    </View>
  );
}
