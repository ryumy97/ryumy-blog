"use client";

import { AppearBottom } from "@/components/loco";
import { TunnelIn } from "@/components/tunnel";
import { Caption } from "@/components/ui/caption";
import { animateCamera } from "@/lib/camera";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { delay } from "motion";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ParticleSystem } from "./particle-system";
import { PointsScene } from "./points-scene";

function Scene() {
  const particleSystem = useMemo(() => new ParticleSystem([], []), []);

  const { clock, camera, gl } = useThree();

  const [chapter, setChapter] = useState(0);

  const [caption, setCaption] = useState("");

  const dataRef = useRef<{
    position: [number, number, number];
    target: [number, number, number];
  }>({
    position: [0, 0, 10],
    target: [0, 0, 0],
  });

  const runChapter = useCallback((): (() => void) => {
    const canvas = gl.domElement;

    if (chapter === 0) {
      setCaption("Let's learn about node-edge graphs.");

      const cancel = delay(async () => {
        setChapter(chapter + 1);
      }, 2);

      const handleClick = () => {
        setChapter(chapter + 1);
      };

      canvas.addEventListener("click", handleClick);

      return () => {
        cancel();
        canvas.removeEventListener("click", handleClick);
      };
    }

    if (chapter === 1) {
      particleSystem.addNode("A", [0, 0, 0], "#3dd98b", clock.elapsedTime);
      animateCamera(
        camera,
        dataRef.current.position,
        dataRef.current.target,
        dataRef.current.position,
        [0, 0, 0]
      );

      setCaption("This is a node (also called a vertex).");

      const cancel = delay(async () => {
        setChapter(chapter + 1);
      }, 2);

      const handleClick = () => {
        setChapter(chapter + 1);
      };

      canvas.addEventListener("click", handleClick);

      return () => {
        cancel();
        canvas.removeEventListener("click", handleClick);
      };
    }

    if (chapter === 2) {
      setCaption("They represent an individual data point within a system.");

      const cancel = delay(async () => {
        setChapter(chapter + 1);
      }, 2);

      const handleClick = () => {
        setChapter(chapter + 1);
      };

      canvas.addEventListener("click", handleClick);

      return () => {
        cancel();
        canvas.removeEventListener("click", handleClick);
      };
    }

    if (chapter === 3) {
      setCaption(
        "The system can have multiple data points. Like the ones here."
      );

      particleSystem.addNode("B", [1, 0, 0], "#3dd98b", clock.elapsedTime);
      particleSystem.addNode("C", [-1, 0, 0], "#ff5555", clock.elapsedTime);
      particleSystem.addNode("D", [1, 1, 1], "#ff5555", clock.elapsedTime);
      particleSystem.addNode("E", [1, 2, -1], "#ff5555", clock.elapsedTime);
      particleSystem.addNode("F", [-1, -1, 0], "#ff5555", clock.elapsedTime);

      const cancel = delay(async () => {
        setChapter(chapter + 1);
      }, 2);

      const handleClick = () => {
        setChapter(chapter + 1);
      };

      canvas.addEventListener("click", handleClick);

      return () => {
        cancel();
        canvas.removeEventListener("click", handleClick);
      };
    }

    if (chapter === 4) {
      setCaption("Edges connect nodes to each other.");

      particleSystem.connectNodes("A", "B", clock.elapsedTime);
      particleSystem.connectNodes("A", "D", clock.elapsedTime);
      particleSystem.connectNodes("A", "C", clock.elapsedTime);
      particleSystem.connectNodes("B", "D", clock.elapsedTime);
      particleSystem.connectNodes("B", "E", clock.elapsedTime);
      particleSystem.connectNodes("C", "F", clock.elapsedTime);
      particleSystem.connectNodes("E", "F", clock.elapsedTime);

      const cancel = delay(async () => {
        setChapter(chapter + 1);
      }, 2);

      const handleClick = () => {
        setChapter(chapter + 1);
      };

      canvas.addEventListener("click", handleClick);

      return () => {
        cancel();
        canvas.removeEventListener("click", handleClick);
      };
    }

    if (chapter === 5) {
      setCaption("They represent a relationship between two nodes.");

      const cancel = delay(async () => {
        setChapter(chapter + 1);
      }, 2);

      const handleClick = () => {
        setChapter(chapter + 1);
      };

      canvas.addEventListener("click", handleClick);

      return () => {
        cancel();
        canvas.removeEventListener("click", handleClick);
      };
    }

    if (chapter === 6) {
      setCaption("Edges can have a weight.");

      const cancel = delay(async () => {
        setChapter(chapter + 1);
      }, 2);
    }

    return () => {};
  }, [chapter]);

  useEffect(() => {
    const cancel = runChapter();

    return () => {
      cancel();
    };
  }, [particleSystem, runChapter]);

  return (
    <>
      <PointsScene particleSystem={particleSystem} />
      <TunnelIn>
        <AnimatePresence>
          {caption && (
            <AppearBottom key={caption}>
              <Caption className="">{caption}</Caption>
            </AppearBottom>
          )}
        </AnimatePresence>
      </TunnelIn>
    </>
  );
}

export default function Page() {
  return (
    <Canvas
      id="edge-node-canvas"
      className="fixed inset-0 h-full w-full"
      camera={{ position: [4, 3, 6], fov: 45 }}
    >
      <color attach="background" args={["#2e323f"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={0.9} />
      <pointLight position={[-4, -5, -6]} intensity={0.3} />
      <Scene />
    </Canvas>
  );
}
