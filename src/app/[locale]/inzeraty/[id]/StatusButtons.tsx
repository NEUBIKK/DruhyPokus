// StatusButtons.tsx — BEZ "use client" !

import { Button, Group } from "@mantine/core";
import { IconCalendarCheck, IconCircleCheck } from "@tabler/icons-react";
import { updateStatus } from "./actions";
import { getTranslations } from "next-intl/server";

const shadowLabel = { label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } };

export async function StatusButtons({ id }: { id: number }) {
  const t = await getTranslations();

  return (
    <Group grow>
      <form action={async () => { "use server"; await updateStatus(id, "Rezervováno"); }}>
        <Button
          type="submit"
          fullWidth
          variant="gradient"
          gradient={{ from: "yellow", to: "orange", deg: 275 }}
          styles={shadowLabel}
          leftSection={<IconCalendarCheck size={16} />}
        >
          {t("page.inzeratDetail.reserveButton")}
        </Button>
      </form>
      <form action={async () => { "use server"; await updateStatus(id, "Prodáno / Předáno"); }}>
        <Button
          type="submit"
          fullWidth
          variant="gradient"
          gradient={{ from: "gray", to: "darkgray", deg: 275 }}
          styles={shadowLabel}
          leftSection={<IconCircleCheck size={16} />}
        >
          {t("page.inzeratDetail.markAsSoldButton")}
        </Button>
      </form>
    </Group>
  );
}
