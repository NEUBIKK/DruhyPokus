"use client";

import { useState } from "react";
import {
  Stack, TextInput, Textarea,
  Title, Text, Card, Box, Divider,
} from "@mantine/core";
import { HoverButton } from "@/components/ui/HoverButton";
import { IconSend, IconArrowLeft, IconCircleCheck, IconMail } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface KontaktFormProps {
  itemId: string;
  inzeratTitle: string;
  predvyplnenyEmail: string;
  locale: string;
}

export function KontaktForm({
  itemId,
  inzeratTitle,
  predvyplnenyEmail,
  locale,
}: KontaktFormProps) {
  const [email, setEmail] = useState(predvyplnenyEmail);
  const [zprava, setZprava] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !zprava) {
      setError("Vyplňte prosím email i zprávu.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zprava, odesilatelEmail: email, itemId }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Nepodařilo se odeslat zprávu. Zkuste to znovu.");
      return;
    }

    setSent(true);
    setTimeout(() => router.push(`/${locale}/inzeraty/${itemId}`), 2500);
  };

  return (
    <Stack gap="md" p="md" maw={520} mx="auto">

      <Box>
        <HoverButton
          href={`/${locale}/inzeraty/${itemId}`}
          label="Zpět na inzerát"
          leftSection={<IconArrowLeft size={15} />}
          variant="subtle"
          color="orange.7"
          keepTransparentBg
          styles={{
            root: {
              paddingLeft: 6,
              paddingRight: 10,
            },
            label: {
              fontWeight: 500,
              fontSize: "0.85rem",
              letterSpacing: "0.01em",
            },
          }}
        />
      </Box>

      <Card
        radius="lg"
        withBorder
        p={0}
        style={{
          borderColor: "var(--mantine-color-green-4)",
          overflow: "hidden",
        }}
      >
        {/* Header stripe */}
        <Box
          px="lg"
          py="md"
          style={{
            borderBottom: "1px solid var(--mantine-color-green-4)",
          }}
        >
          <Box style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Box
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--mantine-color-green-5), var(--mantine-color-teal-5))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconMail size={16} color="white" />
            </Box>
            <Title order={3} style={{ fontSize: "1.1rem" }}>
              Kontaktovat prodávajícího
            </Title>
          </Box>
          <Text
            size="sm"
            fw={500}
            c="orange.7"
            style={{ fontStyle: "italic", letterSpacing: "0.01em", paddingLeft: 42 }}
          >
            {inzeratTitle}
          </Text>
        </Box>

        <Stack gap="md" p="lg">
          {sent ? (
            <Stack align="center" gap="xs" py="xl">
              <IconCircleCheck size={48} color="green" />
              <Text fw={600} c="green">Zpráva byla odeslána!</Text>
              <Text size="sm" c="dimmed">Přesměrování zpět na inzerát...</Text>
            </Stack>
          ) : (
            <>
              <TextInput
                label="Váš email"
                placeholder="vas@email.cz"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
              />

              <Textarea
                label="Zpráva"
                placeholder="Dobrý den, mám zájem o váš inzerát..."
                minRows={4}
                autosize
                value={zprava}
                onChange={(e) => setZprava(e.currentTarget.value)}
                required
              />

              {error && (
                <Text c="red" size="sm">{error}</Text>
              )}

              <HoverButton
                label={loading ? "Odesílám..." : "Odeslat zprávu"}
                variant="gradient"
                gradient={{ from: "rgba(0, 255, 42, 1)", to: "green", deg: 275 }}
                styles={{ label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } }}
                leftSection={<IconSend size={16} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }} />}
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
              />
            </>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
