import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  verificationLink: string;
}

const containerStyle = {
  padding: "16px",
};

const headerStyle = {
  textAlign: "center" as const,
  marginBottom: "16px",
};

const titleStyle = {
  fontSize: "24px",
  fontWeight: "bold" as const,
  color: "#16a34a",
  marginTop: "10px",
};

const textStyle = {
  fontSize: "16px",
  color: "#4B5563",
  marginBottom: "8px",
};

const buttonStyle = {
  fontSize: "14px",
  backgroundColor: "#16a34a",
  color: "#ffffff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
  textDecoration: "none",
  display: "inline-block",
};

const linkStyle = {
  fontSize: "14px",
  color: "#16a34a",
  wordBreak: "break-word" as const,
};

const footerStyle = {
  fontSize: "12px",
  color: "#6B7280",
  borderTop: "1px solid #E5E7EB",
  paddingTop: "8px",
  marginTop: "16px",
  textAlign: "center" as const,
};

export const VerificationEmail = ({
  verificationLink,
}: VerificationEmailProps) => (
  <Html lang="es">
    <Head />
    <Preview>Verifica tu cuenta en Yebaam</Preview>
    <Body
      style={{
        backgroundColor: "#f2f2f3",
        fontFamily: "sans-serif",
        color: "#4B5563",
      }}
    >
      <Container style={containerStyle}>
        <Section style={headerStyle}>
          <h2 style={titleStyle}>Yebaam</h2>
        </Section>
        <Section style={{ marginBottom: "16px" }}>
          <Text style={textStyle}>Hola,</Text>
          <Text style={textStyle}>
            Gracias por registrarte en Yebaam. Para completar tu registro y
            comenzar a disfrutar de todas nuestras funcionalidades, por favor
            verifica tu cuenta haciendo clic en el botón a continuación.
          </Text>
        </Section>
        <Section style={{ textAlign: "center", marginBottom: "16px" }}>
          <a href={verificationLink} style={buttonStyle}>
            Verificar Cuenta
          </a>
        </Section>
        <Section style={{ marginBottom: "16px" }}>
          <Text style={textStyle}>
            Si el botón anterior no funciona, copia y pega este enlace en tu
            navegador:
          </Text>
          <Text style={linkStyle}>{verificationLink}</Text>
        </Section>
        <Section style={footerStyle}>
          <Text>Si no solicitaste esta verificación, ignora este correo.</Text>
          <Text>
            © {new Date().getFullYear()} Yebaam. Todos los derechos reservados.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;
