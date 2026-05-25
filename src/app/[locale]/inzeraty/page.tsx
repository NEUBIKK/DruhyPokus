import { InzeratCard } from "@/components/ui/InzeratCard";
import { InzeratSearchBar } from "@/components/ui/InzeratSearchBar";
import { db } from "@/db";
import { items } from "@/db/schemas";
import { SimpleGrid, Title, Text, Stack, Group, Button } from "@mantine/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { eq, like, not, and, or, isNull } from "drizzle-orm";
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
}

function fetchListings({ query, category, state, price }: FetchListingsParams) {
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

  const results = db
    .select()
    .from(items)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(30)
    .all();

  return results;
}

export default async function Page(props: PageProps<"/[locale]/inzeraty">) {
  const t = await getTranslations();

  const searchParams = await props.searchParams;
  const q = (searchParams.q as string) ?? "";
  const category = (searchParams.category as string) ?? "all";
  const state = (searchParams.state as string) ?? "all";
  const price = (searchParams.price as string) ?? "all";

  const listings_to_show = fetchListings({ query: q, category, state, price });

  return (
    <Stack gap="md">
      <Title>
        {t("page.inzeraty.title")}
      </Title>
      <Group justify="space-between">
        <Text c="dimmed">
          {t("page.inzeraty.description")}
        </Text>
        <Button component="a" href="/inzeraty/novy" variant="gradient"
          gradient={{ from: "yellow", to: "orange", deg: 275 }}>
          {t("page.inzeraty.buttonForm")}
        </Button>
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
