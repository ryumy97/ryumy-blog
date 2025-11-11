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
import colors from "@/lib/colors";

function Scene() {
  const particleSystem = useMemo(() => new ParticleSystem([], []), []);

  const { clock, camera } = useThree();

  const [caption, setCaption] = useState("");

  const dataRef = useRef<{
    position: [number, number, number];
    target: [number, number, number];
  }>({
    position: [0, 0, 10],
    target: [0, 0, 0],
  });
  const cancelledRef = useRef(false);

  const safeSetCaption = useCallback((value: string) => {
    if (!cancelledRef.current) {
      setCaption(value);
    }
  }, []);

  const runChapter = useCallback(async (): Promise<() => void> => {
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          resolve();
        }, ms);
      });

    const waitOrCancelled = async (ms: number) => {
      await wait(ms);
      return cancelledRef.current;
    };

    const highlightPath = (path: string[], color: string) => {
      particleSystem.colorPath(path, color);
    };

    const highlightEdge = (fromId: string, toId: string, color: string) => {
      particleSystem.colorEdge(fromId, toId, color);
    };

    const runBfsVisualization = async (startId: string, targetId: string) => {
      const seen = new Set<string>([startId]);
      const processed = new Set<string>();
      const queue: string[][] = [[startId]];

      particleSystem.resetNodeColors(colors.success);
      particleSystem.resetEdgeColors(colors.light);
      particleSystem.colorNode(startId, colors.primary);
      particleSystem.colorNode(targetId, colors.secondary);
      safeSetCaption(`Starting BFS from ${startId} to ${targetId}`);

      while (queue.length > 0 && !cancelledRef.current) {
        const path = queue.shift()!;
        const currentNodeId = path[path.length - 1];

        processed.add(currentNodeId);
        if (currentNodeId !== startId && currentNodeId !== targetId) {
          particleSystem.colorNode(currentNodeId, colors.visited);
        }

        highlightPath(path, colors.primary);
        safeSetCaption(`Current path: ${path.join(" -> ")}`);
        await wait(500);
        if (cancelledRef.current) {
          return;
        }

        if (currentNodeId === targetId) {
          highlightPath(path, colors.secondary);
          path.forEach((nodeId) => {
            particleSystem.colorNode(
              nodeId,
              nodeId === startId ? colors.primary : colors.secondary
            );
          });
          safeSetCaption(`Found target path: ${path.join(" -> ")}`);
          return;
        }

        highlightPath(path, colors.visited);

        const neighbors = particleSystem.getNeighbors(currentNodeId);

        for (const neighbor of neighbors) {
          if (cancelledRef.current) {
            return;
          }

          if (processed.has(neighbor.id)) {
            highlightEdge(currentNodeId, neighbor.id, colors.pruned);
            safeSetCaption(
              `Already visited ${neighbor.id}, skipping this branch`
            );
            await wait(500);
            if (cancelledRef.current) {
              return;
            }
            highlightEdge(currentNodeId, neighbor.id, colors.visited);
            continue;
          }

          if (seen.has(neighbor.id)) {
            highlightEdge(currentNodeId, neighbor.id, colors.info);
            safeSetCaption(
              `Node ${neighbor.id} is already in the frontier queue`
            );
            await wait(500);
            if (cancelledRef.current) {
              return;
            }
            continue;
          }

          const nextPath = [...path, neighbor.id];

          highlightPath(path, colors.primary);
          highlightEdge(currentNodeId, neighbor.id, colors.info);

          if (neighbor.id !== targetId) {
            particleSystem.colorNode(neighbor.id, colors.info);
          } else {
            particleSystem.colorNode(neighbor.id, colors.secondary);
          }

          safeSetCaption(`Checking next path: ${nextPath.join(" -> ")}`);
          await wait(500);
          if (cancelledRef.current) {
            return;
          }

          highlightPath(path, colors.visited);

          queue.push(nextPath);
          seen.add(neighbor.id);
        }

        highlightPath(path, colors.visited);
      }

      if (!cancelledRef.current) {
        safeSetCaption(`No path found from ${startId} to ${targetId}.`);
      }
    };

    const runDfsVisualization = async (startId: string, targetId: string) => {
      particleSystem.resetNodeColors(colors.success);
      particleSystem.resetEdgeColors(colors.light);
      particleSystem.colorNode(startId, colors.primary);
      particleSystem.colorNode(targetId, colors.secondary);

      const visited = new Set<string>();
      const stack: string[] = [];

      safeSetCaption(`Starting DFS from ${startId} to ${targetId}`);

      const dfs = async (
        currentId: string,
        path: string[]
      ): Promise<boolean> => {
        if (cancelledRef.current) {
          return false;
        }

        visited.add(currentId);
        stack.push(currentId);

        if (currentId !== startId && currentId !== targetId) {
          particleSystem.colorNode(currentId, colors.primary);
        }

        highlightPath(path, colors.primary);
        safeSetCaption(`DFS exploring: ${path.join(" -> ")}`);
        await wait(500);
        if (cancelledRef.current) {
          return false;
        }

        if (currentId === targetId) {
          highlightPath(path, colors.secondary);
          stack.forEach((nodeId) => {
            particleSystem.colorNode(nodeId, colors.secondary);
          });
          safeSetCaption(`DFS found path: ${path.join(" -> ")}`);
          return true;
        }

        const neighbors = particleSystem.getNeighbors(currentId);
        for (const neighbor of neighbors) {
          if (cancelledRef.current) {
            return false;
          }

          if (visited.has(neighbor.id)) {
            highlightEdge(currentId, neighbor.id, colors.pruned);
            safeSetCaption(`DFS backtracks over visited ${neighbor.id}`);
            await wait(500);
            if (cancelledRef.current) {
              return false;
            }
            highlightEdge(currentId, neighbor.id, colors.visited);
            continue;
          }

          highlightEdge(currentId, neighbor.id, colors.info);
          particleSystem.colorNode(neighbor.id, colors.info);
          safeSetCaption(
            `DFS dives deeper: ${[...path, neighbor.id].join(" -> ")}`
          );
          await wait(500);
          if (cancelledRef.current) {
            return false;
          }

          const found = await dfs(neighbor.id, [...path, neighbor.id]);
          if (found) {
            return true;
          }

          highlightEdge(currentId, neighbor.id, colors.pruned);
          particleSystem.colorNode(neighbor.id, colors.pruned);
          safeSetCaption(
            `DFS backtracks from ${neighbor.id} to ${currentId}, path invalid`
          );
          await wait(500);
          if (cancelledRef.current) {
            return false;
          }

          highlightPath(path, colors.primary);
        }

        stack.pop();
        if (currentId !== startId && currentId !== targetId) {
          particleSystem.colorNode(currentId, colors.pruned);
        }
        highlightPath(path, colors.pruned);
        safeSetCaption(`DFS backtracks to ${path.slice(0, -1).join(" -> ")}`);
        await wait(500);
        return false;
      };

      const found = await dfs(startId, [startId]);
      if (!cancelledRef.current && !found) {
        safeSetCaption(`No DFS path found from ${startId} to ${targetId}.`);
      }
    };

    const runDijkstraVisualization = async (
      startId: string,
      targetId: string
    ) => {
      particleSystem.resetNodeColors(colors.success);
      particleSystem.resetEdgeColors(colors.light);
      particleSystem.colorNode(startId, colors.primary);
      particleSystem.colorNode(targetId, colors.secondary);

      const distances = new Map<string, number>();
      const visited = new Set<string>();
      const previous = new Map<string, string>();

      const queue: string[] = [];

      particleSystem.labelSprites.forEach((sprite, id) => {
        sprite.visible = false;
      });

      const allNodes = particleSystem.getAllNodes();
      allNodes.forEach((node) => {
        const distance = node.id === startId ? 0 : Infinity;
        distances.set(node.id, distance);
        queue.push(node.id);
      });

      const updateDistanceIndicator = (nodeId: string, value: number) => {
        particleSystem.colorNode(
          nodeId,
          nodeId === startId
            ? colors.primary
            : nodeId === targetId
            ? colors.secondary
            : colors.info
        );
        safeSetCaption(`Dijkstra distance for ${nodeId}: ${value.toFixed(1)}`);
      };

      safeSetCaption(`Starting Dijkstra from ${startId} to ${targetId}`);

      while (queue.length > 0 && !cancelledRef.current) {
        queue.sort(
          (a, b) =>
            (distances.get(a) ?? Infinity) - (distances.get(b) ?? Infinity)
        );

        const current = queue.shift()!;

        if ((distances.get(current) ?? Infinity) === Infinity) {
          break;
        }

        if (current !== startId && current !== targetId) {
          particleSystem.colorNode(current, colors.primary);
        }

        safeSetCaption(
          `Dijkstra dequeued ${current} (distance ${(
            distances.get(current) ?? Infinity
          ).toFixed(1)})`
        );
        await wait(500);
        if (cancelledRef.current) {
          return;
        }

        if (current === targetId) {
          const path: string[] = [];
          let c: string | undefined = current;
          while (c) {
            path.unshift(c);
            c = previous.get(c);
          }
          highlightPath(path, colors.secondary);
          path.forEach((nodeId) => {
            particleSystem.colorNode(
              nodeId,
              nodeId === startId ? colors.primary : colors.secondary
            );
          });
          safeSetCaption(
            `Dijkstra found shortest path: ${path.join(" -> ")} (distance ${(
              distances.get(targetId) ?? Infinity
            ).toFixed(1)})`
          );
          return;
        }

        visited.add(current);
        const neighbors = particleSystem.getNeighbors(current);

        for (const neighbor of neighbors) {
          if (cancelledRef.current) {
            return;
          }

          if (visited.has(neighbor.id)) {
            highlightEdge(current, neighbor.id, colors.visited);
            continue;
          }

          const edgeWeight = particleSystem.getEdgeWeight(current, neighbor.id);
          const tentativeDistance =
            (distances.get(current) ?? Infinity) + edgeWeight;

          highlightEdge(current, neighbor.id, colors.info);
          safeSetCaption(
            `Dijkstra relaxing edge ${current} -> ${neighbor.id} (w=${edgeWeight})`
          );
          await wait(500);
          if (cancelledRef.current) {
            return;
          }

          if (tentativeDistance < (distances.get(neighbor.id) ?? Infinity)) {
            distances.set(neighbor.id, tentativeDistance);
            previous.set(neighbor.id, current);
            updateDistanceIndicator(neighbor.id, tentativeDistance);

            highlightEdge(current, neighbor.id, colors.secondary);
            safeSetCaption(
              `Better path to ${neighbor.id}: ${tentativeDistance.toFixed(1)}`
            );
            await wait(500);
            if (cancelledRef.current) {
              return;
            }
          } else {
            highlightEdge(current, neighbor.id, colors.pruned);
            safeSetCaption(
              `Existing path to ${neighbor.id} is shorter; edge discarded`
            );
            await wait(500);
            if (cancelledRef.current) {
              return;
            }
          }

          highlightEdge(current, neighbor.id, colors.visited);
        }

        if (current !== startId && current !== targetId) {
          particleSystem.colorNode(current, colors.visited);
        }
      }

      safeSetCaption(
        `Dijkstra could not find a path from ${startId} to ${targetId}.`
      );
    };

    const runAStarVisualization = async (startId: string, targetId: string) => {
      particleSystem.resetNodeColors(colors.success);
      particleSystem.resetEdgeColors(colors.light);
      particleSystem.colorNode(startId, colors.primary);
      particleSystem.colorNode(targetId, colors.secondary);

      const openSet = new Set<string>([startId]);
      const openList: string[] = [startId];
      const closedSet = new Set<string>();
      const cameFrom = new Map<string, string>();
      const gScore = new Map<string, number>();
      const fScore = new Map<string, number>();

      const targetNode = particleSystem.getNode(targetId);
      if (!targetNode) {
        safeSetCaption(`Target node ${targetId} not found`);
        return;
      }

      const heuristic = (nodeId: string) => {
        const node = particleSystem.getNode(nodeId);
        if (!node) return 0;
        const dx = node.position[0] - targetNode.position[0];
        const dy = node.position[1] - targetNode.position[1];
        const dz = node.position[2] - targetNode.position[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      };

      const reconstructPath = (nodeId: string) => {
        const path = [nodeId];
        let current = nodeId;
        while (cameFrom.has(current)) {
          current = cameFrom.get(current)!;
          path.unshift(current);
        }
        return path;
      };

      const updateOpenColors = () => {
        openList.forEach((nodeId) => {
          if (nodeId !== startId && nodeId !== targetId) {
            particleSystem.colorNode(nodeId, colors.info);
          }
        });
      };

      gScore.set(startId, 0);
      fScore.set(startId, heuristic(startId));

      safeSetCaption(`Starting A* from ${startId} to ${targetId}`);

      while (openList.length > 0 && !cancelledRef.current) {
        updateOpenColors();

        let currentId = openList[0];
        let currentIndex = 0;
        for (let i = 1; i < openList.length; i++) {
          const nodeId = openList[i];
          if (
            (fScore.get(nodeId) ?? Infinity) <
            (fScore.get(currentId) ?? Infinity)
          ) {
            currentId = nodeId;
            currentIndex = i;
          }
        }

        openList.splice(currentIndex, 1);
        openSet.delete(currentId);

        if (currentId !== startId && currentId !== targetId) {
          particleSystem.colorNode(currentId, colors.primary);
        }

        safeSetCaption(
          `A* exploring ${currentId} (f=${(
            fScore.get(currentId) ?? Infinity
          ).toFixed(2)})`
        );
        await wait(500);
        if (cancelledRef.current) {
          return;
        }

        if (currentId === targetId) {
          const path = reconstructPath(currentId);
          highlightPath(path, colors.secondary);
          path.forEach((nodeId) => {
            particleSystem.colorNode(
              nodeId,
              nodeId === startId ? colors.primary : colors.secondary
            );
          });
          safeSetCaption(`A* found optimal path: ${path.join(" -> ")}`);
          return;
        }

        closedSet.add(currentId);
        if (currentId !== startId && currentId !== targetId) {
          particleSystem.colorNode(currentId, colors.visited);
        }

        const neighbors = particleSystem.getNeighbors(currentId);
        for (const neighbor of neighbors) {
          if (cancelledRef.current) {
            return;
          }

          if (closedSet.has(neighbor.id)) {
            highlightEdge(currentId, neighbor.id, colors.pruned);
            safeSetCaption(`A* skipping closed node ${neighbor.id}`);
            await wait(500);
            if (cancelledRef.current) {
              return;
            }
            highlightEdge(currentId, neighbor.id, colors.visited);
            continue;
          }

          const tentativeGScore =
            (gScore.get(currentId) ?? Infinity) +
            particleSystem.getEdgeWeight(currentId, neighbor.id);

          if (!openSet.has(neighbor.id)) {
            openSet.add(neighbor.id);
            openList.push(neighbor.id);
          } else if (tentativeGScore >= (gScore.get(neighbor.id) ?? Infinity)) {
            highlightEdge(currentId, neighbor.id, colors.pruned);
            safeSetCaption(
              `A* keeping better path for ${neighbor.id}, current edge discarded`
            );
            await wait(500);
            if (cancelledRef.current) {
              return;
            }
            highlightEdge(currentId, neighbor.id, colors.visited);
            continue;
          }

          cameFrom.set(neighbor.id, currentId);
          gScore.set(neighbor.id, tentativeGScore);
          fScore.set(neighbor.id, tentativeGScore + heuristic(neighbor.id));

          highlightEdge(currentId, neighbor.id, colors.info);
          if (neighbor.id !== targetId) {
            particleSystem.colorNode(neighbor.id, colors.info);
          }

          const pathPreview = reconstructPath(neighbor.id);
          safeSetCaption(
            `A* updating path via ${neighbor.id}: ${pathPreview.join(" -> ")}`
          );
          await wait(500);
          if (cancelledRef.current) {
            return;
          }

          highlightEdge(currentId, neighbor.id, colors.visited);
        }
      }

      if (!cancelledRef.current) {
        safeSetCaption(
          `A* could not find a path from ${startId} to ${targetId}.`
        );
      }
    };

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

    if (await waitOrCancelled(1000)) {
      return () => {
        particleSystem.clear();
      };
    }

    await animateCameraToNode("A", [0, 0, 5]);
    particleSystem.colorNode("A", colors.primary);

    if (await waitOrCancelled(1000)) {
      return () => {
        particleSystem.clear();
      };
    }

    await animateCameraToNode("T", [0, 0, 5]);
    particleSystem.colorNode("T", colors.secondary);

    if (await waitOrCancelled(1000)) {
      return () => {
        particleSystem.clear();
      };
    }

    animateCamera(
      camera,
      dataRef.current.position,
      dataRef.current.target,
      [0, 0, 10],
      [0, 0, 0]
    );

    dataRef.current.position = [0, 0, 10];
    dataRef.current.target = [0, 0, 0];

    if (await waitOrCancelled(500)) {
      return () => {
        particleSystem.clear();
      };
    }

    await runBfsVisualization("A", "T");

    if (await waitOrCancelled(1000)) {
      return () => {
        particleSystem.clear();
      };
    }

    await runDfsVisualization("A", "T");

    if (await waitOrCancelled(1000)) {
      return () => {
        particleSystem.clear();
      };
    }

    await runDijkstraVisualization("A", "T");

    if (await waitOrCancelled(1000)) {
      return () => {
        particleSystem.clear();
      };
    }

    await runAStarVisualization("A", "T");

    return () => {
      particleSystem.clear();
    };
  }, [camera, particleSystem, safeSetCaption]);

  useEffect(() => {
    cancelledRef.current = false;
    let cancel: (() => void) | null = null;
    let active = true;

    runChapter().then((c) => {
      if (!active) {
        c();
        return;
      }
      cancel = c;
    });

    return () => {
      cancelledRef.current = true;
      active = false;
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
