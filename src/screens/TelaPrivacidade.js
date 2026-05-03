import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import styles from '../../style';

/** Textos informativos de exemplo — substituir pela versão jurídica final e por links oficiais. */
export default function TelaPrivacidade() {
  return (
    <SafeAreaView style={styles.usuarioScreen}>
      <ScrollView contentContainerStyle={styles.perfilScreenScroll}>
        <View style={styles.perfilLegalBlock}>
          <Text style={styles.perfilLegalHeading}>Política de privacidade</Text>
          <Text style={styles.perfilLegalParagraph}>
            O Sportfind compromete-se a tratar dados pessoais com transparência e finalidade legítima. Coletamos apenas o
            necessário para prestar o serviço (conta, localização quando autorizada, preferências e uso do app). Não
            vendemos seus dados. Você pode solicitar acesso, correção ou exclusão conforme a LGPD. Esta versão é resumida
            para o app; a política completa deve ser publicada no site oficial e atualizada quando houver mudanças
            relevantes.
          </Text>
        </View>

        <View style={styles.perfilLegalBlock}>
          <Text style={styles.perfilLegalHeading}>Termos de uso</Text>
          <Text style={styles.perfilLegalParagraph}>
            Ao usar o Sportfind, você concorda em fornecer informações verdadeiras, respeitar outros usuários e não
            utilizar a plataforma para conteúdo ilegal ou que viole direitos de terceiros. O serviço é oferecido no
            estado em que se encontra; podemos suspender contas em caso de abuso. Mapas, marcas e conteúdos de terceiros
            permanecem de seus respectivos titulares. Os termos completos devem ser revisados por assessoria jurídica
            antes da publicação em produção.
          </Text>
        </View>

        <View style={styles.perfilLegalBlock}>
          <Text style={styles.perfilLegalHeading}>Adequação à LGPD (Lei nº 13.709/2018)</Text>
          <Text style={styles.perfilLegalParagraph}>
            Buscamos alinhar o tratamento de dados aos princípios da LGPD: finalidade, adequação, necessidade, livre
            acesso, segurança e prevenção. O titular dos dados pode exercer direitos como confirmação de tratamento,
            acesso, correção e eliminação, mediante solicitação pelos canais indicados pela empresa. Mantenha registros
            de consentimento onde aplicável e designe Encarregado (DPO) quando exigido. Este texto não substitui
            avaliação legal nem Relatório de Impacto quando necessário (RIPD).
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
