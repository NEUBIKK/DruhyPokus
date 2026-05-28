import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { items } from "@/db/schemas";
import {
  Card, Group, Title, Text,
  Stack, Box, Center, ThemeIcon,
} from "@mantine/core";
import Image from "next/image";
import { IconPhoto, IconArrowLeft } from "@tabler/icons-react";
import { HoverButton } from "@/components/ui/HoverButton";
import { EditForm } from "./EditForm";

export default async function UpravitPage({
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

  // Backend guard — nepřihlášen nebo není owner → redirect zpět
  const { userId } = await auth();
  if (!userId || item.ownerID !== userId) {
    redirect(`/${locale}/inzeraty/${id}`);
  }

  return (
    <Stack gap="md" p="md">

      <Group justify="space-between">
        <HoverButton
          href={`/${locale}/inzeraty/${id}`}
          label={t("page.inzeratDetail.backToList")}
          leftSection={<IconArrowLeft size={16} />}
          variant="subtle"
          styles={{
            root: {
              color: "var(--mantine-color-orange-6)",
              fontSize: "var(--mantine-font-size-sm)",
              display: "flex",
              alignItems: "center",
              gap: 4,
              textDecoration: "none",
              backgroundColor: "transparent",
              padding: "0 15px",
            },
            label: {
              color: "var(--mantine-color-orange-6)",
            },
            leftSection: {
              color: "var(--mantine-color-orange-6)",
            },
          }}
        />
        <Title order={3}>{t("page.upravitInzerat.title")}</Title>
      </Group>

      <Box style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch" }}>

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

        <Box style={{ flex: "1 1 0", minWidth: 0 }}>
          <Card radius="md" withBorder p="lg" h="100%">
            <EditForm item={item} locale={locale} id={id} />
          </Card>
        </Box>

      </Box>
    </Stack>
  );
}
