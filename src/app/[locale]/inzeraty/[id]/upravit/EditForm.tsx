"use client";

import {
  Stack, TextInput, Textarea, Select, NumberInput,
  Checkbox, Group, Button, Divider, Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useHover } from "@mantine/hooks";
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

  const titleHover = useHover();
  const descriptionHover = useHover();
  const categoryHover = useHover();
  const priceHover = useHover();
  const checkboxHover = useHover();
  const statusHover = useHover();
  const contactNameHover = useHover();
  const emailHover = useHover();
  const saveHover = useHover();
  const discardHover = useHover();

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

  const hoverInputStyles = (hovered: boolean) => ({
    input: {
      borderColor: hovered ? "var(--mantine-color-orange-3)" : undefined,
      transition: "border-color 0.18s ease",
    },
  });

  const hoverButtonStyle = (hovered: boolean) => ({
    transition: "transform 0.2s ease, outline 0.2s ease, box-shadow 0.2s ease",
    transform: hovered ? "scale(1.015)" : "scale(1)",
    outline: hovered ? "1px solid rgba(255, 165, 0, 0.5)" : "1px solid transparent",
    boxShadow: hovered ? "0 2px 6px rgba(0, 0, 0, 0.1)" : "none",
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ height: "100%" }}>
      <Stack gap="md" h="100%">

        <div ref={titleHover.ref}>
          <TextInput
            label="Název"
            name="title"
            radius="md"
            required
            styles={hoverInputStyles(titleHover.hovered)}
            {...form.getInputProps("title")}
          />
        </div>

        <div ref={descriptionHover.ref}>
          <Textarea
            label="Popis"
            name="description"
            radius="md"
            minRows={3}
            autosize
            styles={hoverInputStyles(descriptionHover.hovered)}
            {...form.getInputProps("description")}
          />
        </div>

        <div ref={categoryHover.ref}>
          <Select
            label="Kategorie"
            name="category"
            radius="md"
            required
            data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
            value={form.values.category}
            onChange={(val) => form.setFieldValue("category", val ?? "")}
            styles={hoverInputStyles(categoryHover.hovered)}
          />
        </div>

        <Divider />

        <Group align="flex-end" gap="md">
          <div ref={priceHover.ref}>
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
              styles={hoverInputStyles(priceHover.hovered)}
            />
          </div>
          <Box pb={8}>
            <div ref={checkboxHover.ref}>
              <Checkbox
                label="Zdarma"
                color="orange"
                checked={form.values.isFree}
                onChange={(e) => form.setFieldValue("isFree", e.currentTarget.checked)}
                styles={{
                  label: { fontWeight: 600, fontSize: "14px" },
                  input: {
                    borderColor: checkboxHover.hovered ? "var(--mantine-color-orange-3)" : undefined,
                    transition: "border-color 0.18s ease",
                  },
                }}
              />
            </div>
          </Box>
        </Group>

        <Divider />

        <div ref={statusHover.ref}>
          <Select
            label="Stav nabídky"
            name="status"
            radius="md"
            data={["Dostupné", "Rezervováno", "Prodáno / Předáno"]}
            value={form.values.status}
            onChange={(val) => form.setFieldValue("status", val ?? "Dostupné")}
            styles={hoverInputStyles(statusHover.hovered)}
          />
        </div>

        <Divider />

        <div ref={contactNameHover.ref}>
          <TextInput
            label="Jméno kontaktu"
            name="contactName"
            radius="md"
            required
            styles={hoverInputStyles(contactNameHover.hovered)}
            {...form.getInputProps("contactName")}
          />
        </div>

        <div ref={emailHover.ref}>
          <TextInput
            label="E-mail"
            name="email"
            radius="md"
            styles={hoverInputStyles(emailHover.hovered)}
            {...form.getInputProps("email")}
          />
        </div>

        <Box style={{ marginTop: "auto" }}>
          <Group grow>
            <div ref={saveHover.ref} style={{ flex: 1 }}>
              <Button
                type="submit"
                loading={isPending}
                fullWidth
                variant="gradient"
                gradient={{ from: "yellow", to: "orange", deg: 275 }}
                styles={shadowLabel}
                leftSection={<IconCheck size={16} />}
                style={hoverButtonStyle(saveHover.hovered)}
              >
                {t("page.upravitInzerat.saveButton")}
              </Button>
            </div>
            <div ref={discardHover.ref} style={{ flex: 1 }}>
              <Button
                type="button"
                fullWidth
                variant="gradient"
                gradient={{ from: "gray", to: "darkgray", deg: 275 }}
                styles={shadowLabel}
                leftSection={<IconX size={16} />}
                onClick={() => router.push(`/inzeraty/${id}`)}
                style={hoverButtonStyle(discardHover.hovered)}
              >
                {t("page.upravitInzerat.discardButton")}
              </Button>
            </div>
          </Group>
        </Box>

      </Stack>
    </form>
  );
}
