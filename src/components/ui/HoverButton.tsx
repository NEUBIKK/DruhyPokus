"use client";

import { Button } from "@mantine/core";
import { useState } from "react";

interface HoverButtonProps {
  href: string;
  label: string;
}

export function HoverButton({ href, label }: HoverButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Button
      component="a"
      href={href}
      variant="gradient"
      gradient={{ from: "yellow", to: "orange", deg: 275 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: "transform 0.2s ease, outline 0.2s ease",
        transform: hovered ? "scale(1.01)" : "scale(1)",
        outline: hovered ? "1px solid rgba(255, 165, 0, 0.5)" : "1px solid transparent",
        boxShadow: hovered ? "0 2px 6px rgba(0, 0, 0, 0.1)" : "none",
      }}
    >
      {label}
    </Button>
  );
}
