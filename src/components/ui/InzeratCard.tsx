"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, Badge, Group, Title, Text, Button, AspectRatio } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export function InzeratCard(props: {
  id?: number;
  itemName?: string;
  description?: string;
  category?: string;
  price?: number;
  contactName?: string;
  state?: string;
  imageUrl?: string;
}) {
  const t = useTranslations();
  const locale = useLocale();

  const isFree = props.price === 0 || props.price === null || props.price === undefined;

  return (
    <Link href={`/${locale}/inzeraty/${props.id}`} style={{ textDecoration: "none" }}>
      <Card radius="md" withBorder p="md" style={{ cursor: "pointer", height: "100%" }}>

        {/* Foto */}
        {props.imageUrl && (
          <Card.Section px="md" pt="md" pb="xs">
    <AspectRatio ratio={4 / 3}>
    <Image
      src={props.imageUrl}
      alt={props.itemName ?? ""}
      width={400}
      height={300}
      style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "var(--mantine-radius-md)",
      display: "block",
    }}
  />
  </AspectRatio>
          </Card.Section>
        )}

        {/* Název + stav dostupnosti */}
        <Card.Section px="md" pt="sm" pb={4}>
          <Group justify="space-between" align="center">
            <Title order={3} style={{ flex: 1 }}>
              {props.itemName}
            </Title>
            <Badge variant="gradient" c="white"
            styles={{
            label: {
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
                   },
        }}
              gradient={{ from: 'green', to: 'rgb(34, 255, 0)', deg: 275 }}style={{ flexShrink: 0 }}>
              {props.state}
            </Badge>
          </Group>
        </Card.Section>

        {/* Popis */}
        <Card.Section px="md" pb="xs">
          <Text c="dimmed" size="sm" lineClamp={2}>
            {props.description}
          </Text>
        </Card.Section>

        {/* Kategorie + cena */}
        <Card.Section px="md" pb="xs">
          <Group gap="xs">
            <Badge variant="outline" c="blue" >

              {props.category}
            </Badge>
            {isFree ? (
              <Badge variant="gradient"

                gradient={{ from: 'green', to: 'rgb(0, 255, 0)', deg: 275 }}
                styles={{
                label: {
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
                       },
          }}>
                {t("common.free")}
              </Badge>
            ) : (
              <Badge color="orange" variant="gradient"
                gradient={{ from: 'red', to: 'rgb(255, 165, 0)', deg: 275 }} styles={{
                label: {
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
              },
              }}>
                {t("common.currency.prefix")}
                {props.price}
                {t("common.currency.suffix")}
              </Badge>
            )}
          </Group>
        </Card.Section>

        {/* Kdo nabízí */}
        <Card.Section px="md" pb="xs">
          <Text c="dimmed" size="sm">
            {t("components.inzeratCard.contactInfo")}
            {props.contactName}
          </Text>
        </Card.Section>

        {/* Tlačítko */}
        <Card.Section px="md" pb="md" pt={4}>
          <Button
            fullWidth
            variant="gradient"
            gradient={{ from: 'yellow', to: 'orange', deg: 275 }}
            color="orange"
            component="div"
          >
            {t("components.inzeratCard.detailButton")}
          </Button>
        </Card.Section>

      </Card>
    </Link>
  );
}
