"use client";

import React, { ReactNode, useEffect, useId, useRef } from "react";
import { create, StoreApi } from "zustand";
import {
  animate,
  AnimatePresence,
  cubicBezier,
  motion,
  usePresence,
} from "motion/react";
import { delay } from "motion";
import { useNavStore } from "@/store/nav-store";
import SmoothScroll from "./SmoothScroll";
import { DEFAULT_DURATION, DEFAULT_TRANSITION } from "@/lib/animation";

type Props = { children: React.ReactNode };

type State = {
  current: Array<React.ReactNode>;
  version: number;
  set: StoreApi<State>["setState"];
};

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" &&
  (window.document?.createElement ||
    window.navigator?.product === "ReactNative")
    ? React.useLayoutEffect
    : React.useEffect;

export function useMutableCallback<T>(fn: T) {
  const ref = React.useRef<T>(fn);
  useIsomorphicLayoutEffect(() => void (ref.current = fn), [fn]);
  return ref;
}

function tunnel() {
  const useStore = create<State>((set) => ({
    current: new Array<ReactNode>(),
    version: 0,
    set,
  }));

  return {
    In: ({ children }: Props) => {
      const set = useStore((state) => state.set);
      const version = useStore((state) => state.version);

      /* When this component mounts, we increase the store's version number.
      This will cause all existing rats to re-render (just like if the Out component
      were mapping items to a list.) The re-rendering will cause the final 
      order of rendered components to match what the user is expecting. */
      useIsomorphicLayoutEffect(() => {
        set((state) => ({
          version: state.version + 1,
        }));
      }, []);

      /* Any time the children _or_ the store's version number change, insert
      the specified React children into the list of rats. */
      useIsomorphicLayoutEffect(() => {
        set(({ current }) => ({
          current: [...current, children],
        }));

        return () =>
          set(({ current }) => ({
            current: current.filter((c) => c !== children),
          }));
      }, [children, version]);

      return null;
    },

    Out: () => {
      const current = useStore((state) => state.current);
      return <AnimatePresence mode="popLayout">{current}</AnimatePresence>;
    },
  };
}

const Tunnel = tunnel();

const TransitionWrapper = ({ children }: Props) => {
  const [isPresent, safeToRemove] = usePresence();

  const ref = useRef<HTMLDivElement>(null);

  const { headerHeight } = useNavStore();

  useEffect(() => {
    const containwer = ref.current;

    if (!containwer) return;

    if (isPresent) {
      containwer.style.zIndex = "1";
      animate([
        [
          containwer,
          {
            position: "absolute",
            x: ["100vw", 0],
            y: ["100vw", 0],
            rotate: [-30, 0],
          },
          {
            ...DEFAULT_TRANSITION,
            delay: 0.3,
          },
        ],
      ]);

      delay(() => {
        containwer.style.zIndex = "0";
      }, 5);
    } else {
      containwer.style.zIndex = "0";

      animate([
        [
          containwer,
          {
            x: [0, "-10vw"],
            y: [0, "-10vw"],
            rotate: [0, 10],
          },
          DEFAULT_TRANSITION,
        ],
      ]);

      delay(() => {
        safeToRemove();
      }, DEFAULT_DURATION + 0.3);
    }
  }, [isPresent, safeToRemove]);

  return (
    <motion.div
      ref={ref}
      className="fixed left-0 right-0 top-0 bottom-0 w-full bg-background z-1"
      style={{
        top: `${headerHeight}px`,
      }}
    >
      <SmoothScroll>{children}</SmoothScroll>
    </motion.div>
  );
};

export const TransitionIn = ({ children }: Props) => {
  const id = useId();

  return (
    <Tunnel.In>
      <TransitionWrapper key={id}>{children}</TransitionWrapper>
    </Tunnel.In>
  );
};

export const TransitionOut = () => {
  return <Tunnel.Out />;
};
