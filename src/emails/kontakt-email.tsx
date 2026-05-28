import {
  Html,
  Body,
  Container,
  Heading,
  Section,
  Text,
} from "@react-email/components";

interface KontaktEmailProps {
  zprava: string;
  odesilatelEmail: string;
  inzeratTitle: string;
}

export function KontaktEmail({
  zprava,
  odesilatelEmail,
  inzeratTitle,
}: KontaktEmailProps) {
  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9", padding: "20px" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "32px", maxWidth: "500px" }}>
          <Heading style={{ fontSize: "20px", marginBottom: "8px" }}>
            Nová zpráva k inzerátu
          </Heading>
          <Text style={{ color: "#666", marginBottom: "24px" }}>
            {inzeratTitle}
          </Text>
          <Section style={{ borderLeft: "3px solid #22c55e", paddingLeft: "16px", marginBottom: "24px" }}>
            <Text style={{ margin: 0 }}>{zprava}</Text>
          </Section>
          <Text style={{ color: "#888", fontSize: "13px" }}>
            Odesláno od: {odesilatelEmail}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
