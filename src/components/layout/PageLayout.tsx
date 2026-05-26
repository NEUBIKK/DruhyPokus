"use client";

import {
  AppShell,
  Container,
  Group,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import type { PropsWithChildren } from "react";
import { PageLogo } from "@/components/layout/PageLogo";
import { IconSun, IconMoon } from "@tabler/icons-react";

const HEADER_HEIGHT = 90;
const BODY_MAX_WIDTH = 1280;

export function PageLayout({ children }: PropsWithChildren) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      padding="md"
      withBorder={false}
    >
      <AppShell.Header px="md">
        <Container size={BODY_MAX_WIDTH} h="100%">
          <Group
            h="100%"
            align="center"
            justify="space-between"
          >
            <PageLogo />

            <ActionIcon
              variant="light"
              color="orange"
              size="lg"
              style={{
                background:
                  "linear-gradient(135deg, #ff922b, #ffd43b)",
                border: "none",
                color: "white",
              }}
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light"
                    ? "dark"
                    : "light"
                )
              }
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === "light" ? (
                <IconMoon
                  size={18}
                  style={{
                    filter:
                      "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
                  }}
                />
              ) : (
                <IconSun
                  size={18}
                  style={{
                    filter:
                      "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
                  }}
                />
              )}
            </ActionIcon>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size={BODY_MAX_WIDTH} px="md">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
