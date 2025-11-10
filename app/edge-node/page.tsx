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
import colors from "@/lib/colors";

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

  const runChapter = useCallback(async (): Promise<() => void> => {
    const canvas = gl.domElement;

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
      particleSystem.addNode(
        "A",
        [-2, 0, 0],
        colors.success,
        clock.elapsedTime
      );

      animateCameraToNode("A");

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

      particleSystem.addNode(
        "B",
        [-1, 1, 0],
        colors.success,
        clock.elapsedTime
      );
      particleSystem.addNode("C", [1, 1, 0], colors.success, clock.elapsedTime);
      particleSystem.addNode("D", [2, 0, 0], colors.success, clock.elapsedTime);
      particleSystem.addNode(
        "E",
        [0, -1, 0],
        colors.success,
        clock.elapsedTime
      );
      particleSystem.addNode(
        "F",
        [-1, -2, 0],
        colors.success,
        clock.elapsedTime
      );

      animateCameraToNode("E");

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

      particleSystem.connectNodes("A", "B", 14.1, clock.elapsedTime);
      particleSystem.connectNodes("B", "C", 20.0, clock.elapsedTime);
      particleSystem.connectNodes("C", "D", 14.1, clock.elapsedTime);
      particleSystem.connectNodes("B", "E", 25.0, clock.elapsedTime);
      particleSystem.connectNodes("E", "F", 11.2, clock.elapsedTime);
      particleSystem.connectNodes("F", "A", 28.3, clock.elapsedTime);

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

      particleSystem.showWeightSprites();

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

    if (chapter === 7) {
      setCaption(
        "The weight represents the strength of the relationship between two nodes."
      );

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

    if (chapter === 8) {
      setCaption("Let's try to find the shortest path between two nodes.");

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

    if (chapter === 9) {
      setCaption("Starting from node D...");

      animateCameraToNode("D", [0, 0, 5]);

      particleSystem.colorNode("D", colors.primary);

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

    if (chapter === 10) {
      setCaption("to node F.");

      animateCameraToNode("F", [0, 0, 5]);

      particleSystem.colorNode("F", colors.secondary);

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

    if (chapter === 11) {
      setCaption("The shortest path is the path with the lowest total weight.");

      animateCameraToNode("E", [0, 0, 10]);

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

    return () => {};
  }, [chapter]);

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
