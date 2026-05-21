"use client";

import { Link, useRouter } from "@/i18n/navigation";
import {
  TextInput, Textarea, Card, NumberInput, Group, Select,
  Checkbox, SimpleGrid, Text, Button, Stack, Center, Title,
  Box, Image, Paper, Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";

export default function Page() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [negotiable, setNegotiable] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      category: null as string | null,
      price: "",
      name: "",
      email: "",
      status: "Dostupné",
    },
    validate: {
      title: (value) => (value.trim() === "" ? "Toto pole je povinné" : null),
      category: (value) => (!value ? "Toto pole je povinné" : null),
      name: (value) => (value.trim() === "" ? "Toto pole je povinné" : null),
      price: (value) => {
        if (negotiable) return null;
        const num = Number(value);
        return num <= 0 ? "Zadej cenu nebo zaškrtni Zdarma" : null;
      },
    },
  });

  const handleImageChange = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => setImageBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(null);
    setImageBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setServerError(null);

    setLoading(true);

    try {
      const res = await fetch("/api/inzeraty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          category: values.category,
          price: negotiable ? null : Number(values.price),
          isFree: negotiable,
          status: values.status ?? "Dostupné",
          contactName: values.name,
          email: values.email,
          image: imageBase64,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error ?? "Něco se pokazilo");
        return;
      }

      router.push("/inzeraty");
    } catch {
      setServerError("Nepodařilo se odeslat formulář");
    } finally {
      setLoading(false);
    }
  };

  const requiredLabel = (label: string) => (
    <span style={{ display: "inline-flex", alignItems: "flex-start", gap: "1px", fontSize: "14px", fontWeight: 500, lineHeight: 1.2 }}>
      {label}
      <span style={{ color: "#f97316", fontSize: "10px", fontWeight: 700, position: "relative", top: "-1px" }}>*</span>
    </span>
  );

  const sectionTitleProps = { fw: 700, size: "17px", mb: "md" } as const;

  return (
    <Center style={{ minHeight: "100vh", background: "#ffffff", padding: "40px 16px" }}>
      <Stack w="100%" maw={860}>
        <Group justify="space-between" align="flex-end">
          <Stack gap={2}>
            <Title order={1}>Přidat nabídku</Title>
            <Text size="sm" style={{ color: "#fdba74" }}>
              Vyplň informace o produktu a zveřejni nabídku.
            </Text>
          </Stack>
          <Link href="/inzeraty">
            <Button variant="light" color="orange" bg="white" radius="md" leftSection={<ArrowLeft size={16} />}>
              Zpět
            </Button>
          </Link>
        </Group>

        <Card shadow="xl" radius="xl" p="xl" withBorder style={{ borderColor: "#fed7aa", background: "white" }}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="xl">

              {/* ZÁKLADNÍ INFO */}
              <Box>
                <Text {...sectionTitleProps}>Základní informace</Text>
                <Stack gap="md">
                  <TextInput
                    size="md" radius="md"
                    label={requiredLabel("Název věci")}
                    withAsterisk={false}
                    placeholder="Např. Konferenční stolek"
                    {...form.getInputProps("title")}
                  />
                  <Textarea
                    radius="md"
                    label={<span style={{ fontSize: "14px", fontWeight: 500 }}>Popis</span>}
                    placeholder="Popiš stav, rozměry, místo předání..."
                    minRows={4}
                    autosize
                    {...form.getInputProps("description")}
                  />
                  <Select
                    size="md" radius="md"
                    label={requiredLabel("Kategorie")}
                    withAsterisk={false}
                    placeholder="Vyber kategorii"
                    data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
                    {...form.getInputProps("category")}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* CENA */}
              <Box>
                <Text {...sectionTitleProps}>Cena</Text>
                <Group align="flex-end" gap="md">
                  <NumberInput
                    radius="md"
                    label={<span style={{ fontSize: "14px", fontWeight: 500 }}>Cena</span>}
                    placeholder={negotiable ? "Nabídka je zdarma" : "0 Kč"}
                    suffix=" Kč"
                    min={0}
                    thousandSeparator=" "
                    disabled={negotiable}
                    w={200}
                    {...form.getInputProps("price")}
                  />
                  <Box pb={form.errors.price ? 22 : 8}>
                    <Checkbox
                      label="Nabídka je zdarma"
                      checked={negotiable}
                      color="orange"
                      onChange={(e) => setNegotiable(e.currentTarget.checked)}
                      styles={{ label: { fontWeight: 600, fontSize: "14px" } }}
                    />
                  </Box>
                </Group>
              </Box>

              <Divider />

              {/* KONTAKT */}
              <Box>
                <Text {...sectionTitleProps}>Kontaktní údaje</Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                  <TextInput
                    radius="md"
                    label={requiredLabel("Jméno kontaktu")}
                    withAsterisk={false}
                    placeholder="Tvé jméno"
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    radius="md"
                    label={<span style={{ fontSize: "14px", fontWeight: 500 }}>E-mail</span>}
                    placeholder="jmeno@example.com"
                    {...form.getInputProps("email")}
                  />
                </SimpleGrid>
              </Box>

              <Divider />

              {/* STAV + FOTOGRAFIE */}
              <Box>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                  <Box>
                    <Text {...sectionTitleProps}>Stav nabídky</Text>
                    <Select
                      size="md" radius="md"
                      placeholder="Vyber stav"
                      data={["Dostupné", "Rezervováno", "Prodáno / Předáno"]}
                      {...form.getInputProps("status")}
                    />
                  </Box>

                  <Box>
                    <Text {...sectionTitleProps}>Fotografie</Text>
                    {/* Mantine Dropzone is commented out */}
                    {/*
                    <Dropzone
                      onDrop={handleImageChange}
                      onReject={() => console.log("rejected")}
                      maxSize={5 * 1024 ** 2}
                      accept={IMAGE_MIME_TYPE}
                      radius="lg" p="md"
                      style={{ border: "2px dashed #fdba74", background: "#fffaf5" }}
                    >
                    </Dropzone>
                    */}
                    <Box
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: "2px dashed #fdba74",
                        background: "#fffaf5",
                        borderRadius: "12px",
                        padding: "16px",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                        onChange={(e) => {
                          const files = e.currentTarget.files;
                          if (files) {
                            handleImageChange(Array.from(files));
                          }
                        }}
                        style={{ display: "none" }}
                      />
                      {preview ? (
                        <Box style={{ position: "relative" }}>
                          <Image src={preview} alt="Preview" radius="lg" h={160} fit="cover" />
                          <Button
                            size="xs" color="red" variant="filled"
                            style={{ position: "absolute", top: 8, right: 8 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
                            }}
                          >
                            Odebrat
                          </Button>
                          <Text size="xs" c="dimmed" mt={4} ta="center" truncate>
                            Obrázek nahrán
                          </Text>
                        </Box>
                      ) : (
                        <Group justify="center" gap="sm" mih={90} style={{ pointerEvents: "none" }}>
                          <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 42, height: 42, borderRadius: "50%", background: "#fed7aa" }}>
                            <Upload size={20} color="#ea580c" />
                          </Box>
                          <Stack gap={0} align="center">
                            <Text size="sm" fw={700}>Nahrát obrázek</Text>
                            <Text size="xs" c="dimmed">PNG, JPG nebo WEBP</Text>
                            <Text size="xs" c="dimmed">max 5MB</Text>
                          </Stack>
                        </Group>
                      )}
                    </Box>
                  </Box>
                </SimpleGrid>
              </Box>

              {serverError && (
                <Text c="red" size="sm">{serverError}</Text>
              )}

              <Paper radius="lg" p="md" bg="orange.0" style={{ border: "1px solid #fdba74" }}>
                <Text size="sm" c="dimmed">Pole označená oranžovou hvězdičkou jsou povinná.</Text>
              </Paper>

              <Group justify="flex-end">
                <Button
                  size="md" radius="xl" color="orange" px="xl"
                  type="submit"
                  loading={loading}
                >
                  + Přidat nabídku
                </Button>
              </Group>

            </Stack>
          </form>
        </Card>
      </Stack>
    </Center>
  );
}
