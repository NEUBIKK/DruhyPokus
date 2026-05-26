"use client";

import { Button, Text, Group, ThemeIcon, Stack, Divider } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash, IconCheck, IconX } from "@tabler/icons-react";

interface DeleteButtonProps {
  label: string;
  confirmTitle: string;
  confirmMessage: string;
  confirmYes: string;
  confirmNo: string;
  action: () => Promise<void>;
}

export function DeleteButton({
  label,
  confirmTitle,
  confirmMessage,
  confirmYes,
  confirmNo,
  action,
}: DeleteButtonProps) {
  const handleClick = () => {
    modals.openConfirmModal({
      withCloseButton: false,
      centered: true,
      radius: "md",
      size: "md",
      padding: "xl",
      styles: {
        content: { boxShadow: "0 8px 40px rgba(0,0,0,0.25)" },
        header: { justifyContent: "center" },
        title: { width: "100%" },
      },
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 6,
      },
      title: (
        <Stack align="center" gap="xs" w="100%" pt="xs">
          <ThemeIcon
            variant="gradient"
            gradient={{ from: "rgba(255, 0, 0, 1)", to: "orange", deg: 275 }}
            size={64}
            radius="lg"
            style={{ boxShadow: "0 4px 24px rgba(255,80,0,0.35)" }}
          >
            <IconTrash size={30} />
          </ThemeIcon>
          <Text fw={600} size="md" ta="center" mt={4}>
            {confirmTitle}
          </Text>
        </Stack>
      ),
      children: (
        <Stack gap="lg" align="center">
          <Text size="sm" c="dimmed" ta="center" px="xs">
            {confirmMessage}
          </Text>
          <Divider w="100%" opacity={0.3} />
          <Group grow gap="sm" w="100%">
            <Button
              variant="gradient"
              gradient={{ from: "gray", to: "darkgray", deg: 275 }}
              radius="md"
              leftSection={<IconX size={15} />}
              styles={{
                root: { boxShadow: "0 2px 10px rgba(0,0,0,0.2)" },
                label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" },
              }}
              onClick={() => modals.closeAll()}
            >
              {confirmNo}
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "rgba(255, 0, 0, 1)", to: "orange", deg: 275 }}
              radius="md"
              leftSection={<IconCheck size={15} />}
              styles={{
                root: { boxShadow: "0 2px 10px rgba(255,80,0,0.35)" },
                label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" },
              }}
              onClick={() => { modals.closeAll(); action(); }}
            >
              {confirmYes}
            </Button>
          </Group>
        </Stack>
      ),
      labels: { confirm: confirmYes, cancel: confirmNo },
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  return (
    <Button
      onClick={handleClick}
      variant="gradient"
      gradient={{ from: "rgba(255, 0, 0, 1)", to: "orange", deg: 275 }}
      styles={{ label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } }}
      leftSection={<IconTrash size={16} />}
    >
      {label}
    </Button>
  );
}
