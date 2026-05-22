import { InzeratCard } from "@/components/ui/InzeratCard";
import { InzeratSearchBar } from "@/components/ui/InzeratSearchBar";
import { db } from "@/db";
import { items } from "@/db/schemas";
import { SimpleGrid, Title, Text, Stack, Group, Button, } from "@mantine/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("page.home.title"),
    description: t("page.home.description"),
  };
}

export default async function Page(_: PageProps<"/[locale]">) {
  const t = await getTranslations();

const listings_to_show = db.select().from(items).limit(30).all();


  return (
  <Stack gap="md">
  <Title>
    {t("page.inzeraty.title")}
  </Title>
<Group  justify="space-between">

  <Text c="dimmed">
    {t("page.inzeraty.description")}
  </Text>
<Button  component="a" href="/inzeraty/novy" variant="gradient"
      gradient={{ from: 'yellow', to: 'orange', deg: 275 }}>
  {t("page.inzeraty.buttonForm")}

</Button>
  </Group>
  <InzeratSearchBar />
  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" >
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
  </Stack>)

}
