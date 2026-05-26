"use client";

import { Box, ActionIcon } from "@mantine/core";
import { useState } from "react";
import Image from "next/image";
import { IconMaximize } from "@tabler/icons-react";

interface ImageWithHoverProps {
  src: string;
  alt: string;
}

export function ImageWithHover({ src, alt }: ImageWithHoverProps) {
  const [hovered, setHovered] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: "relative", width: "100%", height: "100%", minHeight: 300 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          style={{
            objectFit: "cover",
            borderRadius: "var(--mantine-radius-md)",
            transition: "transform 0.25s ease",
            transform: hovered ? "scale(1.03)" : "scale(1)",
          }}
        />
        {hovered && (
          <ActionIcon
            variant="filled"
            color="dark"
            radius="md"
            size="lg"
            onClick={() => setFullscreen(true)}
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              opacity: 0.85,
              transition: "opacity 0.2s ease",
            }}
          >
            <IconMaximize size={18} />
          </ActionIcon>
        )}
      </Box>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <Box
          onClick={() => setFullscreen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <Box style={{ position: "relative", width: "90vw", height: "90vh" }}>
            <Image
              src={src}
              alt={alt}
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
