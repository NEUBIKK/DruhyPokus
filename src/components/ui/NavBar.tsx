"use client";

import { Group, Avatar, Text, Stack } from "@mantine/core";
import { HoverButton } from "@/components/ui/HoverButton";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const { openSignIn, openSignUp, signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  return (
    <Group gap="sm" align="center">
      {isSignedIn && user ? (
        <>
          <Avatar src={user.imageUrl} radius="xl" size="md" />
          <Stack gap={0}>
            <Text size="sm" fw={600} lh={1.2}>{user.fullName}</Text>
            <Text size="xs" c="dimmed" lh={1.2}>{user.primaryEmailAddress?.emailAddress}</Text>
          </Stack>
          <HoverButton
            label="Odhlásit se"
            gradient={{ from: "rgba(0, 47, 255, 1)", to: "rgba(0, 225, 255, 1)", deg: 275 }}
            styles={{ label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } }}
            onClick={() => signOut(() => router.push("/inzeraty"))}
          />
        </>
      ) : (
        <>
          <HoverButton
            label="Přihlásit se"
            gradient={{ from: "rgba(0, 47, 255, 1)", to: "rgba(0, 225, 255, 1)", deg: 275 }}
            styles={{ label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } }}
            onClick={() => openSignIn()}
          />
          <HoverButton
            label="Registrovat se"
            gradient={{ from: "yellow", to: "orange", deg: 275 }}
            styles={{ label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } }}
            onClick={() => openSignUp()}
          />
        </>
      )}
    </Group>
  );
}
