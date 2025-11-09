"use client";

import tunnel from "tunnel-rat";

const t = tunnel();

export const TunnelOut = t.Out;
export const TunnelIn = t.In;
