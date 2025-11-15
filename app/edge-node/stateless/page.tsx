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

    const stepDelay = 1200;
    const captionDelay = 1500;

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
      let stepCount = 0;

      particleSystem.resetNodeColors(colors.success);
      particleSystem.resetEdgeColors(colors.light);
      particleSystem.colorNode(startId, colors.primary);
      particleSystem.colorNode(targetId, colors.secondary);

      await zoomToNode(startId);
      safeSetCaption(
        `BFS (Breadth-First Search) explores level by level. We start at ${startId} and use a queue to explore all neighbors before going deeper.`
      );
      await wait(captionDelay * 2);

      while (queue.length > 0 && !cancelledRef.current) {
        const path = queue.shift()!;
        const currentNodeId = path[path.length - 1];
        stepCount++;

        processed.add(currentNodeId);
        if (currentNodeId !== startId && currentNodeId !== targetId) {
          particleSystem.colorNode(currentNodeId, colors.visited);
        }

        highlightPath(path, colors.primary);
        await zoomToNode(currentNodeId);

        if (stepCount <= 3) {
          safeSetCaption(
            `Step ${stepCount}: Dequeue path [${path.join(
              " -> "
            )}]. BFS processes nodes in FIFO order - first in, first out. We're now exploring from ${currentNodeId}.`
          );
          await wait(captionDelay);
        } else {
          safeSetCaption(`Current path: ${path.join(" -> ")}`);
          await wait(stepDelay);
        }
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
          safeSetCaption(
            `✓ Found target! BFS guarantees the shortest path (by number of edges): ${path.join(
              " -> "
            )}`
          );
          return;
        }

        highlightPath(path, colors.visited);

        const neighbors = particleSystem.getNeighbors(currentNodeId);

        if (stepCount <= 3 && neighbors.length > 0) {
          safeSetCaption(
            `Exploring ${neighbors.length} neighbor(s) of ${currentNodeId}. BFS adds all unvisited neighbors to the queue for later processing.`
          );
          await wait(captionDelay);
        }

        for (let i = 0; i < neighbors.length; i++) {
          const neighbor = neighbors[i];
          if (cancelledRef.current) {
            return;
          }

          if (processed.has(neighbor.id)) {
            await zoomToEdge(currentNodeId, neighbor.id);
            highlightEdge(currentNodeId, neighbor.id, colors.pruned);
            if (stepCount <= 3) {
              safeSetCaption(
                `Skipping ${neighbor.id} - already processed. BFS avoids revisiting nodes to prevent infinite loops.`
              );
              await wait(captionDelay);
            } else {
              safeSetCaption(
                `Already visited ${neighbor.id}, skipping this branch`
              );
              await wait(stepDelay);
            }
            if (cancelledRef.current) {
              return;
            }
            highlightEdge(currentNodeId, neighbor.id, colors.visited);
            continue;
          }

          if (seen.has(neighbor.id)) {
            await zoomToEdge(currentNodeId, neighbor.id);
            highlightEdge(currentNodeId, neighbor.id, colors.info);
            if (stepCount <= 3) {
              safeSetCaption(
                `${neighbor.id} is already in the queue. BFS will process it later when we dequeue its path.`
              );
              await wait(captionDelay);
            } else {
              safeSetCaption(
                `Node ${neighbor.id} is already in the frontier queue`
              );
              await wait(stepDelay);
            }
            if (cancelledRef.current) {
              return;
            }
            continue;
          }

          const nextPath = [...path, neighbor.id];

          highlightPath(path, colors.primary);
          await zoomToEdge(currentNodeId, neighbor.id);
          highlightEdge(currentNodeId, neighbor.id, colors.info);

          if (neighbor.id !== targetId) {
            particleSystem.colorNode(neighbor.id, colors.info);
          } else {
            particleSystem.colorNode(neighbor.id, colors.secondary);
          }

          if (stepCount <= 3 && i === 0) {
            safeSetCaption(
              `Adding path [${nextPath.join(
                " -> "
              )}] to queue. This path will be explored after all paths at the current level are processed.`
            );
            await wait(captionDelay);
          } else {
            safeSetCaption(`Checking next path: ${nextPath.join(" -> ")}`);
            await wait(stepDelay);
          }
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
      let stepCount = 0;

      await zoomToNode(startId);
      safeSetCaption(
        `DFS (Depth-First Search) explores as far as possible along each branch before backtracking. Unlike BFS, DFS uses a stack (LIFO) to go deep first.`
      );
      await wait(captionDelay * 2);

      const dfs = async (
        currentId: string,
        path: string[],
        depth: number = 0
      ): Promise<boolean> => {
        if (cancelledRef.current) {
          return false;
        }

        stepCount++;
        visited.add(currentId);
        stack.push(currentId);

        if (currentId !== startId && currentId !== targetId) {
          particleSystem.colorNode(currentId, colors.primary);
        }

        highlightPath(path, colors.primary);
        await zoomToNode(currentId);

        if (stepCount <= 3) {
          safeSetCaption(
            `Step ${stepCount}: DFS visits ${currentId} at depth ${depth}. We mark it visited and push it onto the recursion stack. Current path: [${path.join(
              " -> "
            )}]`
          );
          await wait(captionDelay);
        } else {
          safeSetCaption(`DFS exploring: ${path.join(" -> ")}`);
          await wait(stepDelay);
        }
        if (cancelledRef.current) {
          return false;
        }

        if (currentId === targetId) {
          highlightPath(path, colors.secondary);
          stack.forEach((nodeId) => {
            particleSystem.colorNode(nodeId, colors.secondary);
          });
          safeSetCaption(
            `✓ DFS found a path: ${path.join(
              " -> "
            )}. Note: DFS doesn't guarantee the shortest path, just any path.`
          );
          return true;
        }

        const neighbors = particleSystem.getNeighbors(currentId);
        if (stepCount <= 3 && neighbors.length > 0) {
          safeSetCaption(
            `DFS will recursively explore ${neighbors.length} unvisited neighbor(s). It goes deep into one branch before trying others.`
          );
          await wait(captionDelay);
        }

        for (const neighbor of neighbors) {
          if (cancelledRef.current) {
            return false;
          }

          if (visited.has(neighbor.id)) {
            await zoomToEdge(currentId, neighbor.id);
            highlightEdge(currentId, neighbor.id, colors.pruned);
            if (stepCount <= 3) {
              safeSetCaption(
                `Skipping ${neighbor.id} - already visited. DFS avoids cycles by not revisiting nodes.`
              );
              await wait(captionDelay);
            } else {
              safeSetCaption(`DFS backtracks over visited ${neighbor.id}`);
              await wait(stepDelay);
            }
            if (cancelledRef.current) {
              return false;
            }
            highlightEdge(currentId, neighbor.id, colors.visited);
            continue;
          }

          await zoomToEdge(currentId, neighbor.id);
          highlightEdge(currentId, neighbor.id, colors.info);
          particleSystem.colorNode(neighbor.id, colors.info);
          if (stepCount <= 3) {
            safeSetCaption(
              `DFS dives deeper to ${
                neighbor.id
              }. Unlike BFS, we immediately recurse instead of queuing. New path: [${[
                ...path,
                neighbor.id,
              ].join(" -> ")}]`
            );
            await wait(captionDelay);
          } else {
            safeSetCaption(
              `DFS dives deeper: ${[...path, neighbor.id].join(" -> ")}`
            );
            await wait(stepDelay);
          }
          if (cancelledRef.current) {
            return false;
          }

          const found = await dfs(
            neighbor.id,
            [...path, neighbor.id],
            depth + 1
          );
          if (found) {
            return true;
          }

          await zoomToEdge(currentId, neighbor.id);
          highlightEdge(currentId, neighbor.id, colors.pruned);
          particleSystem.colorNode(neighbor.id, colors.pruned);
          if (stepCount <= 3) {
            safeSetCaption(
              `Backtracking: Path through ${neighbor.id} didn't lead to target. DFS pops from stack and tries next neighbor.`
            );
            await wait(captionDelay);
          } else {
            safeSetCaption(
              `DFS backtracks from ${neighbor.id} to ${currentId}, path invalid`
            );
            await wait(stepDelay);
          }
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
        if (stepCount <= 3) {
          safeSetCaption(
            `All neighbors explored from ${currentId}. Backtracking to parent node.`
          );
          await wait(captionDelay);
        } else {
          safeSetCaption(`DFS backtracks to ${path.slice(0, -1).join(" -> ")}`);
          await wait(stepDelay);
        }
        return false;
      };

      const found = await dfs(startId, [startId], 0);
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
      let stepCount = 0;

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

      await zoomToNode(startId);
      safeSetCaption(
        `Dijkstra's algorithm finds the shortest path by weight. We initialize all distances to ∞ except the start (distance = 0). We always process the unvisited node with the smallest distance first.`
      );
      await wait(captionDelay * 2);

      while (queue.length > 0 && !cancelledRef.current) {
        queue.sort(
          (a, b) =>
            (distances.get(a) ?? Infinity) - (distances.get(b) ?? Infinity)
        );

        const current = queue.shift()!;
        stepCount++;

        if ((distances.get(current) ?? Infinity) === Infinity) {
          break;
        }

        if (current !== startId && current !== targetId) {
          particleSystem.colorNode(current, colors.primary);
        }

        await zoomToNode(current);
        if (stepCount <= 3) {
          safeSetCaption(
            `Step ${stepCount}: Select node ${current} with smallest distance (${(
              distances.get(current) ?? Infinity
            ).toFixed(
              1
            )}). Dijkstra's greedy choice: always process the closest unvisited node first.`
          );
          await wait(captionDelay);
        } else {
          safeSetCaption(
            `Dijkstra dequeued ${current} (distance ${(
              distances.get(current) ?? Infinity
            ).toFixed(1)})`
          );
          await wait(stepDelay);
        }
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
            `✓ Dijkstra found shortest path by weight: ${path.join(
              " -> "
            )} (total distance: ${(distances.get(targetId) ?? Infinity).toFixed(
              1
            )}). This is guaranteed to be optimal!`
          );
          return;
        }

        visited.add(current);
        const neighbors = particleSystem.getNeighbors(current);

        if (stepCount <= 3 && neighbors.length > 0) {
          safeSetCaption(
            `Relaxing edges from ${current}: For each neighbor, we check if going through ${current} gives a shorter path. This is called "edge relaxation".`
          );
          await wait(captionDelay);
        }

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

          await zoomToEdge(current, neighbor.id);
          highlightEdge(current, neighbor.id, colors.info);
          if (stepCount <= 3) {
            safeSetCaption(
              `Relaxing edge ${current} → ${
                neighbor.id
              } (weight: ${edgeWeight}). New distance via ${current}: ${tentativeDistance.toFixed(
                1
              )}. Current best: ${(
                distances.get(neighbor.id) ?? Infinity
              ).toFixed(1)}`
            );
            await wait(captionDelay);
          } else {
            safeSetCaption(
              `Dijkstra relaxing edge ${current} -> ${neighbor.id} (w=${edgeWeight})`
            );
            await wait(stepDelay);
          }
          if (cancelledRef.current) {
            return;
          }

          if (tentativeDistance < (distances.get(neighbor.id) ?? Infinity)) {
            distances.set(neighbor.id, tentativeDistance);
            previous.set(neighbor.id, current);
            updateDistanceIndicator(neighbor.id, tentativeDistance);

            highlightEdge(current, neighbor.id, colors.secondary);
            if (stepCount <= 3) {
              safeSetCaption(
                `✓ Better path found! Update ${
                  neighbor.id
                }'s distance to ${tentativeDistance.toFixed(
                  1
                )}. We record that we reached ${neighbor.id} from ${current}.`
              );
              await wait(captionDelay);
            } else {
              safeSetCaption(
                `Better path to ${neighbor.id}: ${tentativeDistance.toFixed(1)}`
              );
              await wait(stepDelay);
            }
            if (cancelledRef.current) {
              return;
            }
          } else {
            highlightEdge(current, neighbor.id, colors.pruned);
            if (stepCount <= 3) {
              safeSetCaption(
                `Existing path to ${neighbor.id} (${(
                  distances.get(neighbor.id) ?? Infinity
                ).toFixed(1)}) is shorter. Discard this edge - no improvement.`
              );
              await wait(captionDelay);
            } else {
              safeSetCaption(
                `Existing path to ${neighbor.id} is shorter; edge discarded`
              );
              await wait(stepDelay);
            }
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

      await zoomToNode(startId);
      safeSetCaption(
        `A* combines Dijkstra's actual cost (g) with a heuristic estimate (h) to the target. f(n) = g(n) + h(n). The heuristic guides us toward the target, making A* faster than Dijkstra while still finding optimal paths.`
      );
      await wait(captionDelay * 2);

      let stepCount = 0;
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
        stepCount++;

        if (currentId !== startId && currentId !== targetId) {
          particleSystem.colorNode(currentId, colors.primary);
        }

        await zoomToNode(currentId);
        const g = gScore.get(currentId) ?? Infinity;
        const h = heuristic(currentId);
        const f = fScore.get(currentId) ?? Infinity;
        if (stepCount <= 3) {
          safeSetCaption(
            `Step ${stepCount}: Select ${currentId} with lowest f-score (f=${f.toFixed(
              2
            )} = g=${g.toFixed(2)} + h=${h.toFixed(
              2
            )}). A* prioritizes nodes that seem promising based on both actual cost and estimated remaining distance.`
          );
          await wait(captionDelay);
        } else {
          safeSetCaption(`A* exploring ${currentId} (f=${f.toFixed(2)})`);
          await wait(stepDelay);
        }
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
          safeSetCaption(
            `✓ A* found optimal path: ${path.join(
              " -> "
            )}. With an admissible heuristic, A* guarantees the shortest path while exploring fewer nodes than Dijkstra!`
          );
          return;
        }

        closedSet.add(currentId);
        if (currentId !== startId && currentId !== targetId) {
          particleSystem.colorNode(currentId, colors.visited);
        }

        const neighbors = particleSystem.getNeighbors(currentId);
        if (stepCount <= 3 && neighbors.length > 0) {
          safeSetCaption(
            `Evaluating neighbors: For each neighbor, we calculate g (actual cost) and f (g + heuristic). We update if we found a better path.`
          );
          await wait(captionDelay);
        }

        for (const neighbor of neighbors) {
          if (cancelledRef.current) {
            return;
          }

          if (closedSet.has(neighbor.id)) {
            await zoomToEdge(currentId, neighbor.id);
            highlightEdge(currentId, neighbor.id, colors.pruned);
            if (stepCount <= 3) {
              safeSetCaption(
                `Skipping ${neighbor.id} - already in closed set. A* never revisits closed nodes.`
              );
              await wait(captionDelay);
            } else {
              safeSetCaption(`A* skipping closed node ${neighbor.id}`);
              await wait(stepDelay);
            }
            if (cancelledRef.current) {
              return;
            }
            highlightEdge(currentId, neighbor.id, colors.visited);
            continue;
          }

          const edgeWeight = particleSystem.getEdgeWeight(
            currentId,
            neighbor.id
          );
          const tentativeGScore =
            (gScore.get(currentId) ?? Infinity) + edgeWeight;

          if (!openSet.has(neighbor.id)) {
            openSet.add(neighbor.id);
            openList.push(neighbor.id);
          } else if (tentativeGScore >= (gScore.get(neighbor.id) ?? Infinity)) {
            await zoomToEdge(currentId, neighbor.id);
            highlightEdge(currentId, neighbor.id, colors.pruned);
            if (stepCount <= 3) {
              safeSetCaption(
                `Path to ${
                  neighbor.id
                } via ${currentId} (g=${tentativeGScore.toFixed(
                  1
                )}) is not better than existing (g=${(
                  gScore.get(neighbor.id) ?? Infinity
                ).toFixed(1)}). Discard this edge.`
              );
              await wait(captionDelay);
            } else {
              safeSetCaption(
                `A* keeping better path for ${neighbor.id}, current edge discarded`
              );
              await wait(stepDelay);
            }
            if (cancelledRef.current) {
              return;
            }
            highlightEdge(currentId, neighbor.id, colors.visited);
            continue;
          }

          cameFrom.set(neighbor.id, currentId);
          gScore.set(neighbor.id, tentativeGScore);
          const hNeighbor = heuristic(neighbor.id);
          fScore.set(neighbor.id, tentativeGScore + hNeighbor);

          await zoomToEdge(currentId, neighbor.id);
          highlightEdge(currentId, neighbor.id, colors.info);
          if (neighbor.id !== targetId) {
            particleSystem.colorNode(neighbor.id, colors.info);
          }

          const pathPreview = reconstructPath(neighbor.id);
          if (stepCount <= 3) {
            safeSetCaption(
              `✓ Better path to ${
                neighbor.id
              }! Update: g=${tentativeGScore.toFixed(1)}, h=${hNeighbor.toFixed(
                1
              )}, f=${(tentativeGScore + hNeighbor).toFixed(
                1
              )}. Path: [${pathPreview.join(" -> ")}]`
            );
            await wait(captionDelay);
          } else {
            safeSetCaption(
              `A* updating path via ${neighbor.id}: ${pathPreview.join(" -> ")}`
            );
            await wait(stepDelay);
          }
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

    const zoomToNode = async (nodeId: string) => {
      const node = particleSystem.getNode(nodeId);
      if (!node) return;

      // Calculate a better camera position that shows context around the node
      // Position camera at an angle and distance that shows surrounding nodes
      const distance = 5; // Increased distance for better view
      const angle = Math.PI / 6; // 30 degrees elevation

      const offset: [number, number, number] = [
        node.position[0],
        node.position[1] + distance * Math.sin(angle),
        node.position[2] + distance * Math.cos(angle),
      ];
      await animateCameraToNode(nodeId, offset);
    };

    const zoomToEdge = async (fromId: string, toId: string) => {
      const from = particleSystem.getNode(fromId);
      const to = particleSystem.getNode(toId);
      if (!from || !to) return;

      const midPoint: [number, number, number] = [
        (from.position[0] + to.position[0]) / 2,
        (from.position[1] + to.position[1]) / 2,
        (from.position[2] + to.position[2]) / 2,
      ];

      // Calculate edge length to determine appropriate camera distance
      const edgeLength = Math.sqrt(
        Math.pow(to.position[0] - from.position[0], 2) +
          Math.pow(to.position[1] - from.position[1], 2) +
          Math.pow(to.position[2] - from.position[2], 2)
      );

      const distance = Math.max(edgeLength * 1.5, 4); // At least 4 units away
      const angle = Math.PI / 6; // 30 degrees elevation

      const cameraPos: [number, number, number] = [
        midPoint[0],
        midPoint[1] + distance * Math.sin(angle),
        midPoint[2] + distance * Math.cos(angle),
      ];

      await animateCamera(
        camera,
        dataRef.current.position,
        dataRef.current.target,
        cameraPos,
        midPoint
      );

      dataRef.current.position = cameraPos;
      dataRef.current.target = midPoint;
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

    if (await waitOrCancelled(stepDelay)) {
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
      camera={{ position: [4, 3, 6], fov: 45, near: 0.1, far: 10000 }}
    >
      <color attach="background" args={["#2e323f"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={0.9} />
      <pointLight position={[-4, -5, -6]} intensity={0.3} />
      <Scene />
    </Canvas>
  );
}
