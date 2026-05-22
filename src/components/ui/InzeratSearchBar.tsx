"use client";

import { useTranslations } from "next-intl";
import { Card, Badge, Group, Title, Text, Button, Paper, Stack, TextInput, Select, SegmentedControl } from "@mantine/core";
import { Search } from "lucide-react";
import { useState } from "react";
import{useCallback} from "react";
import {useSearchParams} from "next/navigation";
import {usePathname,useRouter} from "@/i18n/navigation";

export function InzeratSearchBar(props: {
  itemName?: string;
  description?: string;
  category?: string;
  price?: number;
  contactName?: string;
  state?: string;
}) {
  const t = useTranslations();

  const Router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateParams = useCallback( (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && (value !== "all" || key === "q")) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    Router.push(`${pathname}?${params.toString()}`);
  }, [Router, searchParams, pathname]);


  return (
    <Paper radius="md" withBorder p="md">
      <Stack gap="md">
        <Group justify="space-between" grow>
          <TextInput
            placeholder={t("components.InzeratSearchBar.placeholder")}
            leftSection={<Search size={16} />}
            defaultValue={searchParams.get("q") ?? ""}
            onChange={(value) => updateParams("q", value.target.value)}
          />
          <Select
            placeholder={t("components.InzeratSearchBar.categoryPlaceholder")}
            data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
            defaultValue={searchParams.get("category") ?? ""}
            onChange={(value) => updateParams("category", value ?? "all")}
          />
          <Select
            placeholder={t("components.InzeratSearchBar.categoryAll")}
            data={["Dostupné", "Prodáno / Předáno", "Prodáno"]}
            defaultValue={searchParams.get("state") ?? ""}
            onChange={(value) => updateParams("state", value ?? "all")}
          />
        </Group>

        <SegmentedControl
          data={[
            { label: t("components.InzeratSearchBar.filterAll"),  value: "all" },
            { label: t("components.InzeratSearchBar.filterFree"), value: "free" },
            { label: t("components.InzeratSearchBar.filterPaid"), value: "paid" },

          ]}
          defaultValue={searchParams.get("price") ?? ""}
            onChange={(value) => updateParams("price", value ?? "all")}
        />
      </Stack>
    </Paper>
  );
}
