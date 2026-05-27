import { Title } from "@mantine/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("page.home.title"),
    description: t("page.home.description"),
  };
}

export default async function Page(_: PageProps<"/[locale]">) {
  const t = await getTranslations();

  redirect("/inzeraty");

  return <Title>{t("page.home.title")}</Title>;
}
