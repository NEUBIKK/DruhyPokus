"use client";

import { useTranslations } from "next-intl";
import { Card, Badge, Group, Title, Text, Button } from "@mantine/core";

export function InzeratCard( props: {
  itemName?: string;
  description?: string;
  category?: string;
  price?: number;
  contactName?: string;
  state?: string;
}

) {
  const t = useTranslations();

  return <>
 <Card radius="md" withBorder p="lg">
      <Card.Section px="md" py="xs">
        <Group justify="space-between">
          <Title order={3}>{props.itemName}</Title>
          <Badge color="green">{props.state}</Badge>
        </Group>
        <Text c="dimmed" truncate>
          {props.description}
        </Text>
      </Card.Section>
      <Card.Section px="md" py="xs">
        <Group>
          <Badge color="blue">{props.category}</Badge>
          <Badge color="yellow">
            {t("common.currency.prefix")}
            {props.price}
            {t("common.currency.suffix")}
          </Badge>
        </Group>
      </Card.Section>
      <Card.Section px="md" py="xs">
        <Text c="dimmed" size="sm">
          {t("components.inzeratCard.contactInfo")}
          {props.contactName}
        </Text>
      </Card.Section>
      <Card.Section px="md" py="xs" mt="auto">
        <Group grow>
          <Button variant="light">{t("components.inzeratCard.detailButton")}</Button>
        </Group>
      </Card.Section>
    </Card>
  </>;
}
