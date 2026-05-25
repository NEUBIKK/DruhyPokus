"use client";

import {
  Stack, TextInput, Textarea, Select, NumberInput,
  Checkbox, Group, Button, Divider, Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { updateItem } from "../actions";

const shadowLabel = { label: { textShadow: "0 1px 2px rgba(0,0,0,0.4)" } };

interface Item {
  id: number;
  title: string;
  description: string | null;
  category: string;
  price: number | null;
  status: string | null;
  contactName: string;
  email: string | null;
}

export function EditForm({
  item,
  locale,
  id,
}: {
  item: Item;
  locale: string;
  id: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isFreeInitial = item.price === null || item.price === 0;

  const form = useForm({
    initialValues: {
      title: item.title,
      description: item.description ?? "",
      category: item.category,
      price: item.price ?? 0,
      isFree: isFreeInitial,
      status: item.status ?? "Dostupné",
      contactName: item.contactName,
      email: item.email ?? "",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    startTransition(async () => {
      await updateItem(Number(id), {
        title: values.title,
        description: values.description || null,
        category: values.category,
        price: values.isFree ? null : values.price,
        status: values.status,
        contactName: values.contactName,
        email: values.email || null,
      });
      router.push(`/inzeraty/${id}`);
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ height: "100%" }}>
      <Stack gap="md" h="100%">

        <TextInput
          label="Název"
          name="title"
          radius="md"
          required
          {...form.getInputProps("title")}
        />

        <Textarea
          label="Popis"
          name="description"
          radius="md"
          minRows={3}
          autosize
          {...form.getInputProps("description")}
        />

        <Select
          label="Kategorie"
          name="category"
          radius="md"
          required
          data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
          value={form.values.category}
          onChange={(val) => form.setFieldValue("category", val ?? "")}
        />

        <Divider />

        <Group align="flex-end" gap="md">
          <NumberInput
            label="Cena"
            name="price"
            radius="md"
            suffix=" Kč"
            min={0}
            thousandSeparator=" "
            disabled={form.values.isFree}
            placeholder={form.values.isFree ? "Zdarma" : "0 Kč"}
            w={200}
            value={form.values.isFree ? 0 : form.values.price}
            onChange={(val) => form.setFieldValue("price", Number(val))}
          />
          <Box pb={8}>
            <Checkbox
              label="Zdarma"
              color="orange"
              checked={form.values.isFree}
              onChange={(e) => form.setFieldValue("isFree", e.currentTarget.checked)}
              styles={{ label: { fontWeight: 600, fontSize: "14px" } }}
            />
          </Box>
        </Group>

        <Divider />

        <Select
          label="Stav nabídky"
          name="status"
          radius="md"
          data={["Dostupné", "Rezervováno", "Prodáno / Předáno"]}
          value={form.values.status}
          onChange={(val) => form.setFieldValue("status", val ?? "Dostupné")}
        />

        <Divider />

        <TextInput
          label="Jméno kontaktu"
          name="contactName"
          radius="md"
          required
          {...form.getInputProps("contactName")}
        />

        <TextInput
          label="E-mail"
          name="email"
          radius="md"
          {...form.getInputProps("email")}
        />

        <Box style={{ marginTop: "auto" }}>
          <Group grow>
            <Button
              type="submit"
              loading={isPending}
              variant="gradient"
              gradient={{ from: "yellow", to: "orange", deg: 275 }}
              styles={shadowLabel}
              leftSection={<IconCheck size={16} />}
            >
              {t("page.upravitInzerat.saveButton")}
            </Button>
            <Button
              type="button"
              variant="gradient"
              gradient={{ from: "gray", to: "darkgray", deg: 275 }}
              styles={shadowLabel}
              leftSection={<IconX size={16} />}
              onClick={() => router.push(`/inzeraty/${id}`)}
            >
              {t("page.upravitInzerat.discardButton")}
            </Button>
          </Group>
        </Box>

      </Stack>
    </form>
  );
}
