"use client";

import { useTranslations } from "next-intl";
import { Paper, Stack, Group, TextInput, Select, SegmentedControl } from "@mantine/core";
import { Search, X } from "lucide-react";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

export function InzeratSearchBar() {
  const t = useTranslations();

  const Router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && (value !== "all" || key === "q")) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    Router.push(`${pathname}?${params.toString()}`);
  }, [Router, searchParams, pathname]);

  const clearParam = useCallback((key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    Router.push(`${pathname}?${params.toString()}`);
  }, [Router, searchParams, pathname]);

  const ClearButton = ({ paramKey }: { paramKey: string }) => {
    const isActive = !!searchParams.get(paramKey);
    if (!isActive) return null;
    return (
      <X
        size={14}
        style={{ cursor: "pointer", color: "var(--mantine-color-dimmed)" }}
        onClick={() => clearParam(paramKey)}
      />
    );
  };

  return (
    <Paper radius="md" withBorder p="md">
      <Stack gap="md">
        <Group justify="space-between" grow>
          <TextInput
            placeholder={t("components.InzeratSearchBar.placeholder")}
            leftSection={<Search size={16} />}
            rightSection={<ClearButton paramKey="q" />}
            value={searchParams.get("q") ?? ""}
            onChange={(e) => updateParams("q", e.target.value)}
          />
          <Select
            placeholder={t("components.InzeratSearchBar.categoryPlaceholder")}
            data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
            value={searchParams.get("category") ?? null}
            clearable
            onClear={() => clearParam("category")}
            onChange={(value) => updateParams("category", value ?? "all")}
          />
          <Select
            placeholder={t("components.InzeratSearchBar.categoryAll")}
            data={["Dostupné", "Prodáno / Předáno", "Prodáno"]}
            value={searchParams.get("state") ?? null}
            clearable
            onClear={() => clearParam("state")}
            onChange={(value) => updateParams("state", value ?? "all")}
          />
        </Group>

        <SegmentedControl
          data={[
            { label: t("components.InzeratSearchBar.filterAll"),  value: "all" },
            { label: t("components.InzeratSearchBar.filterFree"), value: "free" },
            { label: t("components.InzeratSearchBar.filterPaid"), value: "paid" },
          ]}
          value={searchParams.get("price") ?? "all"}
          onChange={(value) => updateParams("price", value ?? "all")}
        />
      </Stack>
    </Paper>
  );
}
