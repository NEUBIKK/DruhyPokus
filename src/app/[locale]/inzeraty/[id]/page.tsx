import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { items } from "@/db/schemas";
import {
  Card, Group, Title, Text, Badge, Button,
  Stack, Alert, Center, ThemeIcon, Box,
} from "@mantine/core";
import Image from "next/image";
import { IconPhoto, IconInfoCircle, IconArrowLeft, IconPencil, IconCalendarCheck, IconCircleCheck } from "@tabler/icons-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

const shadowLabel = { label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } };

function getStateBadgeProps(state?: string | null) {
  switch (state) {
    case "Rezervováno":
      return { gradient: { from: "violet", to: "rgba(212, 138, 255, 1)", deg: 275 } };
    case "Prodáno / Předáno":
      return { gradient: { from: "gray", to: "darkgray", deg: 275 } };
    case "Dostupné":
    default:
      return { gradient: { from: "green", to: "lime", deg: 275 } };
  }
}

function getButtonStates(status?: string | null) {
  switch (status) {
    case "Prodáno / Předáno":
      return { canReserve: false, canSell: false };
    case "Rezervováno":
      return { canReserve: false, canSell: true };
    case "Dostupné":
    default:
      return { canReserve: true, canSell: true };
  }
}

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
  const stateBadgeProps = getStateBadgeProps(item.status);
  const { canReserve, canSell } = getButtonStates(item.status);

  async function setRezervorano() {
    "use server";
    await db.update(items).set({ status: "Rezervováno" }).where(eq(items.id, Number(id)));
    revalidatePath("/", "layout");
  }

  async function setProdano() {
    "use server";
    await db.update(items).set({ status: "Prodáno / Předáno" }).where(eq(items.id, Number(id)));
    revalidatePath("/", "layout");
  }

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
          <Button
            styles={shadowLabel}
            variant="gradient"
            gradient={{ from: "rgb(0, 204, 255)", to: "blue", deg: 275 }}
            leftSection={<IconPencil size={16} />}
          >
            {t("page.inzeratDetail.editButton")}
          </Button>
        </Link>
      </Group>

      {/* Hlavní obsah — 50/50 */}
      <Box
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "stretch",
        }}
      >

        {/* Levý sloupec — obrázek 50% */}
        <Box style={{ flex: "1 1 0", minWidth: 0 }}>
          <Card radius="md" withBorder p={0} h="100%">
            {item.image ? (
              <Box style={{ position: "relative", width: "100%", height: "100%", minHeight: 300 }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{
                    objectFit: "cover",
                    borderRadius: "var(--mantine-radius-md)",
                  }}
                />
              </Box>
            ) : (
              <Center h="100%" style={{ minHeight: 300, flexDirection: "column", gap: 8 }}>
                <ThemeIcon variant="light" color="gray" size={48} radius="md">
                  <IconPhoto size={28} />
                </ThemeIcon>
                <Text c="dimmed" size="sm">
                  {t("page.inzeratDetail.noImage")}
                </Text>
              </Center>
            )}
          </Card>
        </Box>

        {/* Pravý sloupec — detail 50% */}
        <Box style={{ flex: "1 1 0", minWidth: 0 }}>
          <Card radius="md" withBorder p="lg" h="100%">
            <Stack gap="md" h="100%">

              {/* Název + stav */}
              <Group justify="space-between" align="flex-start">
                <Title order={2} style={{ flex: 1 }}>
                  {item.title}
                </Title>
                <Badge
                  styles={shadowLabel}
                  variant="gradient"
                  gradient={stateBadgeProps.gradient}
                  c="white"
                  style={{ flexShrink: 0 }}
                >
                  {item.status}
                </Badge>
              </Group>

              {/* Kategorie + cena */}
              <Group gap="xs">
                <Badge
                  styles={shadowLabel}
                  variant="gradient"
                  gradient={{ from: "rgb(0, 204, 255)", to: "blue", deg: 275 }}
                >
                  {item.category}
                </Badge>

                {isFree ? (
                  <Badge
                    styles={shadowLabel}
                    variant="gradient"
                    gradient={{ from: "rgba(0, 255, 42, 1)", to: "green", deg: 275 }}
                  >
                    {t("common.free")}
                  </Badge>
                ) : (
                  <Badge
                    styles={shadowLabel}
                    variant="gradient"
                    gradient={{ from: "rgba(255, 146, 43, 1)", to: "orange", deg: 275 }}
                  >
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
                w="100%"
              >
                <Text size="sm">{t("page.inzeratDetail.paymentInfo")}</Text>
              </Alert>

              {/* Akční tlačítka */}
              <Box style={{ marginTop: "auto" }}>
                <Group grow>
                  <form
                    action={canReserve ? setRezervorano : undefined}
                    style={{
                      flex: 1,
                      opacity: canReserve ? 1 : 0.4,
                      pointerEvents: canReserve ? "auto" : "none",
                      transition: "opacity 0.2s",
                    }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="gradient"
                      gradient={{ from: "yellow", to: "orange", deg: 275 }}
                      styles={shadowLabel}
                      leftSection={<IconCalendarCheck size={16} />}
                    >
                      {t("page.inzeratDetail.reserveButton")}
                    </Button>
                  </form>
                  <form
                    action={canSell ? setProdano : undefined}
                    style={{
                      flex: 1,
                      opacity: canSell ? 1 : 0.4,
                      pointerEvents: canSell ? "auto" : "none",
                      transition: "opacity 0.2s",
                    }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="gradient"
                      gradient={{ from: "gray", to: "darkgray", deg: 275 }}
                      styles={shadowLabel}
                      leftSection={<IconCircleCheck size={16} />}
                    >
                      {t("page.inzeratDetail.markAsSoldButton")}
                    </Button>
                  </form>
                </Group>
              </Box>

            </Stack>
          </Card>
        </Box>
      </Box>
    </Stack>
  );
}
