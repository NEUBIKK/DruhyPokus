"use client";

import { Button, Group } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconCalendarCheck, IconCircleCheck } from "@tabler/icons-react";
import { updateStatus } from "./actions";

const shadowLabel = { label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } };

const hoverButtonStyle = (hovered: boolean) => ({
  transition: "transform 0.2s ease, outline 0.2s ease, box-shadow 0.2s ease",
  transform: hovered ? "scale(1.015)" : "scale(1)",
  outline: hovered ? "1px solid rgba(255, 165, 0, 0.5)" : "1px solid transparent",
  boxShadow: hovered ? "0 2px 6px rgba(0, 0, 0, 0.1)" : "none",
});

interface StatusButtonsProps {
  id: number;
  reserveLabel: string;
  sellLabel: string;
}

export function StatusButtons({ id, reserveLabel, sellLabel }: StatusButtonsProps) {
  const reserveHover = useHover();
  const sellHover = useHover();

  return (
    <Group grow>
      <form action={async () => { "use server"; await updateStatus(id, "Rezervováno"); }}>
        <div ref={reserveHover.ref}>
          <Button
            type="submit"
            fullWidth
            variant="gradient"
            gradient={{ from: "yellow", to: "orange", deg: 275 }}
            styles={shadowLabel}
            leftSection={<IconCalendarCheck size={16} />}
            style={hoverButtonStyle(reserveHover.hovered)}
          >
            {reserveLabel}
          </Button>
        </div>
      </form>
      <form action={async () => { "use server"; await updateStatus(id, "Prodáno / Předáno"); }}>
        <div ref={sellHover.ref}>
          <Button
            type="submit"
            fullWidth
            variant="gradient"
            gradient={{ from: "gray", to: "darkgray", deg: 275 }}
            styles={shadowLabel}
            leftSection={<IconCircleCheck size={16} />}
            style={hoverButtonStyle(sellHover.hovered)}
          >
            {sellLabel}
          </Button>
        </div>
      </form>
    </Group>
  );
}
