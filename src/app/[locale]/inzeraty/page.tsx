import { InzeratCard } from "@/components/ui/InzeratCard";
import { InzeratSearchBar } from "@/components/ui/InzeratSearchBar";
import { HoverButton } from "@/components/ui/HoverButton";
import { db } from "@/db";
import { items } from "@/db/schemas";
import { SimpleGrid, Title, Text, Stack, Group } from "@mantine/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { eq, like, not, and, or, isNull, gte, lte, asc } from "drizzle-orm";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("page.home.title"),
    description: t("page.home.description"),
  };
}

interface FetchListingsParams {
  query: string;
  category: string;
  state: string;
  price: string;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
}

function fetchListings({ query, category, state, price, priceMin, priceMax, sort }: FetchListingsParams) {
  const conditions = [];

  if (query) {
    conditions.push(or(like(items.title, `%${query}%`), like(items.description, `%${query}%`)));
  }

  if (category && category !== "all") {
    conditions.push(eq(items.category, category));
  }

  if (state && state !== "all") {
    conditions.push(eq(items.status, state));
  }

  if (price && price !== "all") {
    if (price === "free") {
      conditions.push(isNull(items.price));
    } else if (price === "paid") {
      conditions.push(not(isNull(items.price)));
    }
  }

  if (priceMin !== undefined) {
    conditions.push(gte(items.price, priceMin));
  }

  if (priceMax !== undefined && priceMax < 5000) {
    conditions.push(lte(items.price, priceMax));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  if (sort === "price_asc") {
    return db
      .select()
      .from(items)
      .where(where)
      .orderBy(asc(items.price))
      .limit(30)
      .all();
  }

  return db
    .select()
    .from(items)
    .where(where)
    .limit(30)
    .all();
}

export default async function Page(props: PageProps<"/[locale]/inzeraty">) {
  const t = await getTranslations();

  const searchParams = await props.searchParams;
  const q = (searchParams.q as string) ?? "";
  const category = (searchParams.category as string) ?? "all";
  const state = (searchParams.state as string) ?? "all";
  const price = (searchParams.price as string) ?? "all";
  const sort = (searchParams.sort as string) ?? "";
  const priceMin = searchParams.priceMin ? Number(searchParams.priceMin) : undefined;
  const priceMax = searchParams.priceMax ? Number(searchParams.priceMax) : undefined;

  const listings_to_show = fetchListings({ query: q, category, state, price, priceMin, priceMax, sort });

  return (
    <Stack gap="md">
      <Title>{t("page.inzeraty.title")}</Title>
      <Group justify="space-between">
        <Text c="dimmed">{t("page.inzeraty.description")}</Text>
        <HoverButton
          styles={{ label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } }}
          href="/inzeraty/novy"
          label={t("page.inzeraty.buttonForm")}
        />
      </Group>

      <Suspense fallback={null}>
        <InzeratSearchBar />
      </Suspense>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {listings_to_show.map((listing) => (
          <InzeratCard
            id={listing.id}
            key={listing.id}
            itemName={listing.title}
            description={listing.description ?? ""}
            category={listing.category}
            price={listing.price ?? 0}
            contactName={listing.contactName}
            state={listing.status ?? ""}
            imageUrl={listing.image ?? undefined}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
