"use client";

import { AppearBottom } from "@/components/loco";
import { TunnelIn } from "@/components/tunnel";
import { Caption } from "@/components/ui/caption";
import { animateCamera } from "@/lib/camera";
import { Canvas, useThree } from "@react-three/fiber";
import { delay } from "motion";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ParticleSystem } from "../particle-system";
import { PointsScene } from "../points-scene";

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
    await animateCamera(
      camera,
      dataRef.current.position,
      dataRef.current.target,
      dataRef.current.position,
      [0, 0, 0]
    );

    particleSystem.addNode("A", [0, 0, 0], "#3dd98b", clock.elapsedTime);
    particleSystem.addNode("B", [1, 0, 0], "#3dd98b", clock.elapsedTime);
    particleSystem.addNode("C", [-1, 0, 0], "#ff5555", clock.elapsedTime);
    particleSystem.addNode("D", [1, 1, 1], "#ff5555", clock.elapsedTime);
    particleSystem.addNode("E", [1, 2, -1], "#ff5555", clock.elapsedTime);
    particleSystem.addNode("F", [-1, -1, 0], "#ff5555", clock.elapsedTime);

    particleSystem.connectNodes("A", "B", clock.elapsedTime);
    particleSystem.connectNodes("A", "D", clock.elapsedTime);
    particleSystem.connectNodes("A", "C", clock.elapsedTime);
    particleSystem.connectNodes("B", "D", clock.elapsedTime);
    particleSystem.connectNodes("B", "E", clock.elapsedTime);
    particleSystem.connectNodes("C", "F", clock.elapsedTime);
    particleSystem.connectNodes("E", "F", clock.elapsedTime);

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
