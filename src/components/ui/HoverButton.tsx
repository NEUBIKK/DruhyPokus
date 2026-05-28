"use client";

import { Button } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import Link from "next/link";
import type { ReactNode, MouseEvent, CSSProperties } from "react";

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
  radius?: string | number;
  size?: string;
  mt?: string | number;
  bg?: string;
  color?: string;
  keepTransparentBg?: boolean;
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
  radius,
  size,
  mt,
  bg,
  color,
  keepTransparentBg,
}: HoverButtonProps) {
  const { hovered, ref } = useHover();

  const hoverStyle: CSSProperties = {
    width: fullWidth ? "100%" : undefined,
    transition:
      "transform 140ms ease-out, box-shadow 140ms ease-out, border-color 140ms ease-out",
    transform: hovered ? "translateY(-1px)" : "translateY(0)",
    boxShadow: keepTransparentBg
      ? "none"
      : hovered
        ? "0 6px 18px rgba(0, 0, 0, 0.14)"
        : "0 1px 2px rgba(0,0,0,0.05)",
    border: hovered && !keepTransparentBg
      ? "1px solid rgba(255, 165, 0, 0.35)"
      : "1px solid transparent",
    willChange: "transform, box-shadow",
    // Přebijeme Mantine hover background přes inline style
    ...(keepTransparentBg ? { backgroundColor: "transparent" } : bg ? { backgroundColor: bg } : {}),
  };

  const sharedProps = {
    fullWidth,
    variant,
    gradient,
    color,
    leftSection,
    disabled,
    styles,
    style: hoverStyle,
    radius,
    size,
    ...(keepTransparentBg
      ? {
          // Mantine data attribute pro potlačení hover bg
          "data-transparent": true,
        }
      : {}),
  };

  return (
    <div
      ref={ref}
      style={{
        display: fullWidth ? "block" : "inline-block",
        width: fullWidth ? "100%" : "auto",
        marginTop: mt,
      }}
    >
      {href ? (
        <Button component={Link} href={href} {...sharedProps}>
          {label}
        </Button>
      ) : (
        <Button component="button" type={type} onClick={onClick} {...sharedProps}>
          {label}
        </Button>
      )}
    </div>
  );
}
