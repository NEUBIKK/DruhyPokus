"use client";

import { IconPhone } from "@tabler/icons-react";
import { HoverButton } from "@/components/ui/HoverButton";

interface ContactButtonProps {
  label: string;
  itemId: string;
  locale: string;
}

export function ContactButton({ label, itemId, locale }: ContactButtonProps) {
  return (
    <HoverButton
      label={label}
      href={`/${locale}/inzeraty/${itemId}/kontakt`}
      variant="gradient"
      gradient={{ from: "rgba(0, 255, 42, 1)", to: "green", deg: 275 }}
      styles={{ label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } }}
      leftSection={<IconPhone size={16} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }} />}
      radius="xl"
      size="sm"
    />
  );
}
