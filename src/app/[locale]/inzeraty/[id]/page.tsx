// src/app/[locale]/inzeraty/[id]/page.tsx

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { items } from "@/db/schemas";
import {
  Card, Group, Title, Text, Badge, Button,
  Stack, Alert, AspectRatio, Center, ThemeIcon, Box,
} from "@mantine/core";
import Image from "next/image";
import { IconPhoto, IconInfoCircle, IconArrowLeft, IconPencil } from "@tabler/icons-react";
import Link from "next/link";

export default async function InzeratDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations();

  const item = await db
    .select()
    .from(items)
    .where(eq(items.id, Number(id)))
    .get();

  if (!item) notFound();

  const isFree = item.price === 0 || item.price === null;

  return (
    <Stack gap="md" p="md">

      {/* Horní lišta — Zpět + Upravit */}
      <Group justify="space-between">
        <Link
          href={`/${locale}/inzeraty`}
          style={{
            color: "var(--mantine-color-red-6)",
            fontSize: "var(--mantine-font-size-sm)",
            display: "flex",
            alignItems: "center",
            gap: 4,
            textDecoration: "none",
          }}
        >
          <IconArrowLeft size={16} />
          {t("page.inzeratDetail.backToList")}
        </Link>
        <Link href={`/${locale}/inzeraty/${id}/upravit`}>
          <Button variant="light" color="violet" leftSection={<IconPencil size={16} />}>
            {t("page.inzeratDetail.editButton")}
          </Button>
        </Link>
      </Group>

      {/* Hlavní obsah — flex row */}
      <Box
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Levý sloupec — obrázek */}
        <Box style={{ flex: "1 1 300px", minWidth: 0 }}>
          <Card radius="md" withBorder p="md" h="100%">
            {item.image ? (
              <AspectRatio ratio={4 / 3}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={600}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "var(--mantine-radius-md)",
                  }}
                />
              </AspectRatio>
            ) : (
              <AspectRatio ratio={4 / 3}>
                <Center style={{ flexDirection: "column", gap: 8 }}>
                  <ThemeIcon variant="light" color="gray" size={48} radius="md">
                    <IconPhoto size={28} />
                  </ThemeIcon>
                  <Text c="dimmed" size="sm">
                    {t("page.inzeratDetail.noImage")}
                  </Text>
                </Center>
              </AspectRatio>
            )}
          </Card>
        </Box>

        {/* Pravý sloupec — detail */}
        <Box style={{ flex: "2 1 400px", minWidth: 0 }}>
          <Card radius="md" withBorder p="lg">
            <Stack gap="md">

              {/* Název + stav */}
              <Group justify="space-between" align="flex-start">
                <Title order={2} style={{ flex: 1 }}>
                  {item.title}
                </Title>
                <Badge color="green" variant="filled" style={{ flexShrink: 0 }}>
                  {item.status}
                </Badge>
              </Group>

              {/* Kategorie + cena */}
              <Group gap="xs">
                <Badge color="blue" variant="light">
                  {item.category}
                </Badge>
                {isFree ? (
                  <Badge color="green" variant="light">
                    {t("common.free")}
                  </Badge>
                ) : (
                  <Badge color="orange" variant="light">
                    {t("common.currency.prefix")}
                    {item.price}
                    {t("common.currency.suffix")}
                  </Badge>
                )}
              </Group>

              {/* Popis */}
              <Text size="sm">{item.description}</Text>

              {/* Kontakt */}
              <Stack gap={2}>
                <Text fw={600} size="sm">
                  {t("page.inzeratDetail.contact")}
                </Text>
                <Text size="sm">{item.contactName}</Text>
                {item.email && (
                  <Text size="sm" c="dimmed">
                    {item.email}
                  </Text>
                )}
              </Stack>

              {/* Info alert */}
              <Alert
                icon={<IconInfoCircle size={16} />}
                color="violet"
                variant="light"
                title={t("page.inzeratDetail.paymentTitle")}
              >
                <Text size="sm">{t("page.inzeratDetail.paymentInfo")}</Text>
              </Alert>

              {/* Akční tlačítka */}
              <Group>
                <Button color="orange" variant="filled">
                  {t("page.inzeratDetail.reserveButton")}
                </Button>
                <Button color="gray" variant="outline">
                  {t("page.inzeratDetail.markAsSoldButton")}
                </Button>
              </Group>

            </Stack>
          </Card>
        </Box>
      </Box>
    </Stack>
  );
}
