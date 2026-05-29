"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useComputedColorScheme } from "@mantine/core";

export function PageLogo() {
  const t = useTranslations();
  const computedColorScheme = useComputedColorScheme("light");

  return (
    <Image
      src={computedColorScheme === "dark" ? "/ChatGPT_Image_29._5._2026_10_23_26-removebg-preview.png" : "/blogic-logo.png"}
      alt={t("common.pageLogo.ariaLabel")}
      width={115}
      height={46}
    />
  );
}
