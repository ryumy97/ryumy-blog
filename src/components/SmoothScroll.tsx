"use client";

import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      options={{
        allowNestedScroll: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
