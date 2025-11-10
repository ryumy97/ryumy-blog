"use client";

import { AppearBottom } from "@/components/loco";
import { TunnelIn } from "@/components/tunnel";
import { Caption } from "@/components/ui/caption";
import { animateCamera } from "@/lib/camera";
import { Canvas, useThree } from "@react-three/fiber";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ParticleSystem } from "../particle-system";
import { PointsScene } from "../points-scene";
import { delay } from "motion";
import colors from "@/lib/colors";

function Scene() {
  const particleSystem = useMemo(() => new ParticleSystem([], []), []);

  const { clock, camera, gl } = useThree();

  const [caption, setCaption] = useState("");

  const dataRef = useRef<{
    position: [number, number, number];
    target: [number, number, number];
  }>({
    position: [0, 0, 10],
    target: [0, 0, 0],
  });

  const runChapter = useCallback(async (): Promise<() => void> => {
    const animateCameraToNode = async (
      nodeId: string,
      position: [number, number, number] = [0, 0, 10]
    ) => {
      const node = particleSystem.getNode(nodeId);
      if (!node) {
        throw new Error(`Node with id ${nodeId} not found`);
      }

      await animateCamera(
        camera,
        dataRef.current.position,
        dataRef.current.target,
        position,
        node.position
      );

      dataRef.current.position = position;
      dataRef.current.target = node.position;
    };

    await animateCamera(
      camera,
      dataRef.current.position,
      dataRef.current.target,
      dataRef.current.position,
      [0, 0, 0]
    );

    particleSystem.addNode("A", [-2, 0, 0], colors.success, clock.elapsedTime);
    particleSystem.addNode(
      "B",
      [-1.78, 1.5, 0],
      colors.success,
      clock.elapsedTime
    );
    particleSystem.addNode(
      "C",
      [-1.56, -0.5, 0],
      colors.success,
      clock.elapsedTime
    );
    particleSystem.addNode(
      "D",
      [-1.11, 1, 0],
      colors.success,
      clock.elapsedTime
    );
    particleSystem.addNode(
      "E",
      [-0.89, -1.5, 0],
      colors.success,
      clock.elapsedTime
    );
    particleSystem.addNode(
      "F",
      [-0.44, 0.5, 0],
      colors.success,
      clock.elapsedTime
    );
    particleSystem.addNode(
      "G",
      [-0.22, -2, 0],
      colors.success,
      clock.elapsedTime
    );
    particleSystem.addNode("H", [0, -1, -2], colors.success, clock.elapsedTime);
    particleSystem.addNode(
      "I",
      [0.44, 0, 0],
      colors.success,
      clock.elapsedTime
    );
    particleSystem.addNode(
      "J",
      [0.89, -0.5, 0],
      colors.success,
      clock.elapsedTime
    );
    particleSystem.addNode(
      "K",
      [1.33, -1, 0],
      colors.success,
      clock.elapsedTime
    );
    particleSystem.addNode(
      "L",
      [1.78, -1.5, 0],
      colors.success,
      clock.elapsedTime
    );
    particleSystem.addNode("T", [2, -2, 0], colors.success, clock.elapsedTime);

    particleSystem.connectNodes("A", "B", 10, clock.elapsedTime);
    particleSystem.connectNodes("E", "G", 5, clock.elapsedTime);
    particleSystem.connectNodes("A", "C", 5, clock.elapsedTime);
    particleSystem.connectNodes("F", "I", 3, clock.elapsedTime);
    particleSystem.connectNodes("B", "D", 15, clock.elapsedTime);
    particleSystem.connectNodes("G", "J", 20, clock.elapsedTime);
    particleSystem.connectNodes("C", "D", 20, clock.elapsedTime);
    particleSystem.connectNodes("G", "T", 35, clock.elapsedTime);
    particleSystem.connectNodes("C", "E", 10, clock.elapsedTime);
    particleSystem.connectNodes("H", "G", 10, clock.elapsedTime);
    particleSystem.connectNodes("D", "F", 5, clock.elapsedTime);
    particleSystem.connectNodes("I", "J", 10, clock.elapsedTime);
    particleSystem.connectNodes("D", "H", 25, clock.elapsedTime);
    particleSystem.connectNodes("J", "K", 5, clock.elapsedTime);
    particleSystem.connectNodes("E", "F", 10, clock.elapsedTime);
    particleSystem.connectNodes("K", "L", 15, clock.elapsedTime);
    particleSystem.connectNodes("E", "I", 30, clock.elapsedTime);
    particleSystem.connectNodes("L", "T", 5, clock.elapsedTime);

    particleSystem.showWeightSprites();

    delay(async () => {
      await animateCameraToNode("A", [0, 0, 5]);
      particleSystem.colorNode("A", colors.primary);
    }, 1);

    delay(async () => {
      await animateCameraToNode("T", [0, 0, 5]);
      particleSystem.colorNode("T", colors.secondary);
    }, 2);

    delay(async () => {
      animateCamera(
        camera,
        dataRef.current.position,
        dataRef.current.target,
        [0, 0, 10],
        [0, 0, 0]
      );

      dataRef.current.position = [0, 0, 10];
      dataRef.current.target = [0, 0, 0];
    }, 3);

    return () => {
      particleSystem.clear();
    };
  }, []);

  useEffect(() => {
    let cancel: (() => void) | null = null;
    runChapter().then((c) => {
      cancel = c;
    });

    return () => {
      cancel?.();
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
