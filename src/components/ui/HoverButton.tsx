"use client";

import { Button } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import type { ReactNode, MouseEvent } from "react";

interface HoverButtonProps {
  href?: string;
  label: string;
  variant?: string;
  gradient?: { from: string; to: string; deg: number };
  leftSection?: ReactNode;
  type?: "button" | "submit";
  fullWidth?: boolean;
  styles?: Record<string, unknown>;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function HoverButton({
  href,
  label,
  variant = "gradient",
  gradient = { from: "yellow", to: "orange", deg: 275 },
  leftSection,
  type = "button",
  fullWidth,
  styles,
  disabled,
  onClick,
}: HoverButtonProps) {
  const { hovered, ref } = useHover();

  const hoverStyle = {
    width: fullWidth ? "100%" : undefined,
    transition:
      "transform 140ms ease-out, box-shadow 140ms ease-out, border-color 140ms ease-out",
    transform: hovered ? "translateY(-1px)" : "translateY(0)",
    boxShadow: hovered
      ? "0 6px 18px rgba(0, 0, 0, 0.14)"
      : "0 1px 2px rgba(0,0,0,0.05)",
    border: hovered
      ? "1px solid rgba(255, 165, 0, 0.35)"
      : "1px solid transparent",
    willChange: "transform, box-shadow",
  };

  return (
    <div
      ref={ref}
      style={{
        display: fullWidth ? "block" : "inline-block",
        width: fullWidth ? "100%" : "auto",
      }}
    >
      {href ? (
        <Button
          component="a"
          href={href}
          fullWidth={fullWidth}
          variant={variant}
          gradient={gradient}
          leftSection={leftSection}
          disabled={disabled}
          styles={styles}
          style={hoverStyle}
        >
          {label}
        </Button>
      ) : (
        <Button
          component="button"
          type={type}
          fullWidth={fullWidth}
          variant={variant}
          gradient={gradient}
          leftSection={leftSection}
          disabled={disabled}
          styles={styles}
          onClick={onClick}
          style={hoverStyle}
        >
          {label}
        </Button>
      )}
    </div>
  );
}
