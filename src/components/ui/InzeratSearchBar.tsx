"use client";

import { useTranslations } from "next-intl";
import {
  Group, TextInput, Select, SegmentedControl,
  Badge, Box, RangeSlider, Text, Collapse, ActionIcon, Tooltip,
} from "@mantine/core";
import { Search, X, Tag, LayoutGrid, SlidersHorizontal, ArrowUpNarrowWide } from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

const PRICE_MIN = 0;
const PRICE_MAX = 5000;

const inputHoverStyle = {
  transition: "box-shadow 0.18s ease, border-color 0.18s ease",
};

function useFieldHover() {
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };
}

export function InzeratSearchBar() {
  const t = useTranslations();
  const Router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchHover = useFieldHover();
  const categoryHover = useFieldHover();
  const stateHover = useFieldHover();
  const sliderIconHover = useFieldHover();
  const sortIconHover = useFieldHover();

  const initialMin = Number(searchParams.get("priceMin") ?? PRICE_MIN);
  const initialMax = Number(searchParams.get("priceMax") ?? PRICE_MAX);
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMin, initialMax]);
  const [showPriceSlider, setShowPriceSlider] = useState(
    !!searchParams.get("priceMin") || !!searchParams.get("priceMax")
  );
  const [sortCheapest, setSortCheapest] = useState(searchParams.get("sort") === "price_asc");

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
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

  const applyPriceRange = useCallback(([min, max]: [number, number]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min === PRICE_MIN && max === PRICE_MAX) {
      params.delete("priceMin");
      params.delete("priceMax");
    } else {
      params.set("priceMin", String(min));
      params.set("priceMax", String(max));
    }
    Router.push(`${pathname}?${params.toString()}`);
  }, [Router, searchParams, pathname]);

  const handlePriceSliderToggle = () => {
    const next = !showPriceSlider;
    setShowPriceSlider(next);
    if (!next) {
      setPriceRange([PRICE_MIN, PRICE_MAX]);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("priceMin");
      params.delete("priceMax");
      Router.push(`${pathname}?${params.toString()}`);
    }
  };

  const handleSortCheapest = () => {
    const next = !sortCheapest;
    setSortCheapest(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next) {
      params.set("sort", "price_asc");
    } else {
      params.delete("sort");
    }
    Router.push(`${pathname}?${params.toString()}`);
  };

  const isPriceActive = priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX;

  const fieldShadow = "0 2px 8px rgba(0,0,0,0.10)";

  return (
    <Box>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 72px",
          gap: 8,
          alignItems: "center",
        }}
      >
        {/* Search input */}
        <div
          onMouseEnter={searchHover.onMouseEnter}
          onMouseLeave={searchHover.onMouseLeave}
          style={{
            borderRadius: "var(--mantine-radius-md)",
            boxShadow: searchHover.hovered ? fieldShadow : "none",
            ...inputHoverStyle,
          }}
        >
          <TextInput
            placeholder={t("components.InzeratSearchBar.placeholder")}
            leftSection={<Search size={14} />}
            rightSection={
              searchParams.get("q") ? (
                <X
                  size={13}
                  style={{ cursor: "pointer", color: "var(--mantine-color-dimmed)" }}
                  onClick={() => clearParam("q")}
                />
              ) : null
            }
            value={searchParams.get("q") ?? ""}
            onChange={(e) => updateParams("q", e.target.value)}
            radius="md"
            size="sm"
            styles={{
              input: {
                borderColor: searchHover.hovered ? "var(--mantine-color-orange-3)" : undefined,
                transition: "border-color 0.18s ease",
              },
            }}
          />
        </div>

        {/* Category select */}
        <div
          onMouseEnter={categoryHover.onMouseEnter}
          onMouseLeave={categoryHover.onMouseLeave}
          style={{
            borderRadius: "var(--mantine-radius-md)",
            boxShadow: categoryHover.hovered ? fieldShadow : "none",
            ...inputHoverStyle,
          }}
        >
          <Select
            placeholder={t("components.InzeratSearchBar.categoryPlaceholder")}
            leftSection={<LayoutGrid size={13} />}
            data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
            value={searchParams.get("category") ?? null}
            clearable
            onClear={() => clearParam("category")}
            onChange={(value) => updateParams("category", value ?? "all")}
            radius="md"
            size="sm"
            styles={{
              input: {
                borderColor: categoryHover.hovered ? "var(--mantine-color-orange-3)" : undefined,
                transition: "border-color 0.18s ease",
              },
            }}
          />
        </div>

        {/* State select */}
        <div
          onMouseEnter={stateHover.onMouseEnter}
          onMouseLeave={stateHover.onMouseLeave}
          style={{
            borderRadius: "var(--mantine-radius-md)",
            boxShadow: stateHover.hovered ? fieldShadow : "none",
            ...inputHoverStyle,
          }}
        >
          <Select
            placeholder={t("components.InzeratSearchBar.categoryAll")}
            leftSection={<Tag size={13} />}
            data={["Dostupné", "Prodáno / Předáno", "Prodáno"]}
            value={searchParams.get("state") ?? null}
            clearable
            onClear={() => clearParam("state")}
            onChange={(value) => updateParams("state", value ?? "all")}
            radius="md"
            size="sm"
            styles={{
              input: {
                borderColor: stateHover.hovered ? "var(--mantine-color-orange-3)" : undefined,
                transition: "border-color 0.18s ease",
              },
            }}
          />
        </div>

        {/* Icon buttons */}
        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
          <Tooltip label={t("components.InzeratSearchBar.priceRange") ?? "Rozsah ceny"} withArrow>
            <ActionIcon
              variant={showPriceSlider ? "filled" : "default"}
              color={showPriceSlider ? "orange" : undefined}
              radius="md"
              size="lg"
              onClick={handlePriceSliderToggle}
              onMouseEnter={sliderIconHover.onMouseEnter}
              onMouseLeave={sliderIconHover.onMouseLeave}
              style={{
                transform: sliderIconHover.hovered ? "translateY(-1px)" : "translateY(0)",
                boxShadow: sliderIconHover.hovered ? fieldShadow : "none",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}
            >
              <SlidersHorizontal size={15} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={t("components.InzeratSearchBar.sortCheapest") ?? "Od nejlevnějšího"} withArrow>
            <ActionIcon
              variant={sortCheapest ? "filled" : "default"}
              color={sortCheapest ? "orange" : undefined}
              radius="md"
              size="lg"
              onClick={handleSortCheapest}
              onMouseEnter={sortIconHover.onMouseEnter}
              onMouseLeave={sortIconHover.onMouseLeave}
              style={{
                transform: sortIconHover.hovered ? "translateY(-1px)" : "translateY(0)",
                boxShadow: sortIconHover.hovered ? fieldShadow : "none",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}
            >
              <ArrowUpNarrowWide size={15} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>

      {/* SegmentedControl */}
      <Box mt={8}>
        <SegmentedControl
          fullWidth
          size="xs"
          className="segmented-hover"
          radius="md"
          data={[
            { label: t("components.InzeratSearchBar.filterAll"), value: "all" },
            { label: t("components.InzeratSearchBar.filterFree"), value: "free" },
            { label: t("components.InzeratSearchBar.filterPaid"), value: "paid" },
          ]}
          value={searchParams.get("price") ?? "all"}
          onChange={(value) => updateParams("price", value ?? "all")}
        />
      </Box>

      {/* Aktivní badges */}
      {(isPriceActive || sortCheapest) && (
        <Group gap="xs" mt={6}>
          {isPriceActive && (
            <Badge variant="light" color="orange" size="sm">
              {priceRange[0]}–{priceRange[1] === PRICE_MAX ? `${PRICE_MAX}+` : priceRange[1]} Kč
            </Badge>
          )}
          {sortCheapest && (
            <Badge variant="light" color="orange" size="sm">
              {t("components.InzeratSearchBar.sortCheapest") ?? "Nejlevnější"}
            </Badge>
          )}
        </Group>
      )}

      {/* Price slider */}
      <Collapse expanded={showPriceSlider}>
        <Box mt="xs" px={4}>
          <Group justify="space-between" mb={6}>
            <Text size="xs" c="dimmed">
              {priceRange[0]} Kč – {priceRange[1] === PRICE_MAX ? `${PRICE_MAX}+` : priceRange[1]} Kč
            </Text>
          </Group>
          <RangeSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50}
            value={priceRange}
            onChange={setPriceRange}
            onChangeEnd={applyPriceRange}
            radius="md"
            size="xs"
            color="orange"
            label={null}
          />
          <Group justify="space-between" mt={4}>
            <Text size="xs" c="dimmed">{PRICE_MIN} Kč</Text>
            <Text size="xs" c="dimmed">{PRICE_MAX}+ Kč</Text>
          </Group>
        </Box>
      </Collapse>
    </Box>
  );
}
