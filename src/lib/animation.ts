import { cubicBezier } from "motion";

export const DEFAULT_EASING = cubicBezier(0.2, 0, 0, 1);
export const DEFAULT_DURATION = 0.5;

export const DEFAULT_TRANSITION = {
  ease: DEFAULT_EASING,
  duration: DEFAULT_DURATION,
};
