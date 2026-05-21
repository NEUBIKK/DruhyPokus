"use client";

import { useTranslations } from "next-intl";
import { Card, Badge, Group, Title, Text, Button, Paper, Stack, TextInput, Select } from "@mantine/core";
import {Search} from "lucide-react";
export function InzeratSearchBar( props: {
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
  <Paper radius="md" withBorder p="md" >
      <Stack gap="md">
      <Group justify="space-between" grow>
        <TextInput placeholder={t("components.InzeratSearchBar.placeholder")} leftSection={<Search size={16} />} />
        <Select placeholder={t("components.InzeratSearchBar.categoryPlaceholder")} />
        <Select placeholder={t("components.InzeratSearchBar.categoryAll")} />




      </Group>
      </Stack>


  </Paper>





  </>;

}
