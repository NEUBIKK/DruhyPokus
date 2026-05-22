"use client";

import { useTranslations } from "next-intl";
import { Card, Badge, Group, Title, Text, Button, Paper, Stack, TextInput, Select, SegmentedControl } from "@mantine/core";
import { Search } from "lucide-react";
import { useState } from "react";

export function InzeratSearchBar(props: {
  itemName?: string;
  description?: string;
  category?: string;
  price?: number;
  contactName?: string;
  state?: string;
}) {
  const t = useTranslations();
  const [priceFilter, setPriceFilter] = useState("all");

  return (
    <Paper radius="md" withBorder p="md">
      <Stack gap="md">
        <Group justify="space-between" grow>
          <TextInput
            placeholder={t("components.InzeratSearchBar.placeholder")}
            leftSection={<Search size={16} />}
          />
          <Select
            placeholder={t("components.InzeratSearchBar.categoryPlaceholder")}
            data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
          />
          <Select
            placeholder={t("components.InzeratSearchBar.categoryAll")}
            data={["Dostupné", "Prodáno / Předáno", "Prodáno"]}
          />
        </Group>

        <SegmentedControl
          value={priceFilter}
          onChange={setPriceFilter}
          data={[
            { label: t("components.InzeratSearchBar.filterAll"),  value: "all" },
            { label: t("components.InzeratSearchBar.filterFree"), value: "free" },
            { label: t("components.InzeratSearchBar.filterPaid"), value: "paid" },
          ]}
        />
      </Stack>
    </Paper>
  );
}
