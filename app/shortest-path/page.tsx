"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

interface PathNode {
  node: string;
  distance: number;
  previous: string | null;
}

export default function ShortestPathPage() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "A", x: 100, y: 100, label: "A" },
    { id: "B", x: 300, y: 100, label: "B" },
    { id: "C", x: 500, y: 100, label: "C" },
    { id: "D", x: 100, y: 250, label: "D" },
    { id: "E", x: 300, y: 250, label: "E" },
    { id: "F", x: 500, y: 250, label: "F" },
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "D", weight: 2 },
    { from: "B", to: "C", weight: 3 },
    { from: "B", to: "E", weight: 5 },
    { from: "C", to: "F", weight: 6 },
    { from: "D", to: "E", weight: 1 },
    { from: "E", to: "F", weight: 4 },
  ]);

  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [algorithm, setAlgorithm] = useState<"dijkstra" | "bfs">("dijkstra");

  // Dijkstra's algorithm
  const dijkstra = useCallback(
    (start: string, end: string): string[] => {
      const graph: Record<string, { node: string; weight: number }[]> = {};
      const pathNodes: Record<string, PathNode> = {};
      const unvisited = new Set<string>();

      // Initialize graph structure
      nodes.forEach((node) => {
        graph[node.id] = [];
        pathNodes[node.id] = {
          node: node.id,
          distance: Infinity,
          previous: null,
        };
        unvisited.add(node.id);
      });

      edges.forEach((edge) => {
        graph[edge.from].push({ node: edge.to, weight: edge.weight });
        graph[edge.to].push({ node: edge.from, weight: edge.weight });
      });

      // Initialize start node
      pathNodes[start].distance = 0;

      // Main algorithm loop
      while (unvisited.size > 0) {
        // Find unvisited node with smallest distance
        let current: string | null = null;
        let minDistance = Infinity;

        unvisited.forEach((nodeId) => {
          if (pathNodes[nodeId].distance < minDistance) {
            minDistance = pathNodes[nodeId].distance;
            current = nodeId;
          }
        });

        if (!current || minDistance === Infinity) break;
        unvisited.delete(current);

        // Update distances to neighbors
        graph[current].forEach((neighbor) => {
          if (unvisited.has(neighbor.node)) {
            const newDistance = pathNodes[current!].distance + neighbor.weight;
            if (newDistance < pathNodes[neighbor.node].distance) {
              pathNodes[neighbor.node].distance = newDistance;
              pathNodes[neighbor.node].previous = current;
            }
          }
        });
      }

      // Reconstruct path
      const result: string[] = [];
      let current: string | null = end;
      while (current) {
        result.unshift(current);
        current = pathNodes[current].previous;
      }

      // Store distances for display
      const distMap: Record<string, number> = {};
      Object.values(pathNodes).forEach((pn) => {
        distMap[pn.node] = pn.distance;
      });
      setDistances(distMap);

      return result[0] === start ? result : [];
    },
    [nodes, edges]
  );

  // BFS (for unweighted graphs)
  const bfs = useCallback(
    (start: string, end: string): string[] => {
      const graph: Record<string, string[]> = {};
      const visited = new Set<string>();
      const queue: { node: string; path: string[] }[] = [
        { node: start, path: [start] },
      ];

      // Build adjacency list
      nodes.forEach((node) => {
        graph[node.id] = [];
      });

      edges.forEach((edge) => {
        graph[edge.from].push(edge.to);
        graph[edge.to].push(edge.from);
      });

      visited.add(start);

      while (queue.length > 0) {
        const { node, path } = queue.shift()!;

        if (node === end) {
          // Store distances (BFS gives shortest path in terms of edges)
          const distMap: Record<string, number> = {};
          nodes.forEach((n) => {
            distMap[n.id] = path.includes(n.id) ? path.indexOf(n.id) : Infinity;
          });
          setDistances(distMap);
          return path;
        }

        graph[node].forEach((neighbor) => {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push({ node: neighbor, path: [...path, neighbor] });
          }
        });
      }

      setDistances({});
      return [];
    },
    [nodes, edges]
  );

  const findPath = useCallback(() => {
    if (!selectedStart || !selectedEnd) return;

    const result =
      algorithm === "dijkstra"
        ? dijkstra(selectedStart, selectedEnd)
        : bfs(selectedStart, selectedEnd);

    setPath(result);
  }, [selectedStart, selectedEnd, algorithm, dijkstra, bfs]);

  const reset = useCallback(() => {
    setPath([]);
    setDistances({});
    setSelectedStart(null);
    setSelectedEnd(null);
  }, []);

  const isInPath = (nodeId: string) => path.includes(nodeId);
  const isPathEdge = (edge: Edge) => {
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (edge.from === path[i] && edge.to === path[i + 1]) ||
        (edge.from === path[i + 1] && edge.to === path[i])
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to pages
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">
            Shortest Path Algorithms
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Visualize and explore shortest path algorithms in graphs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Algorithm</CardTitle>
                <CardDescription>Choose the algorithm to use</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={algorithm === "dijkstra" ? "default" : "outline"}
                    onClick={() => {
                      setAlgorithm("dijkstra");
                      reset();
                    }}
                    className="flex-1"
                  >
                    Dijkstra
                  </Button>
                  <Button
                    variant={algorithm === "bfs" ? "default" : "outline"}
                    onClick={() => {
                      setAlgorithm("bfs");
                      reset();
                    }}
                    className="flex-1"
                  >
                    BFS
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Node</label>
                  <div className="flex flex-wrap gap-2">
                    {nodes.map((node) => (
                      <Button
                        key={node.id}
                        variant={
                          selectedStart === node.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setSelectedStart(node.id);
                          setPath([]);
                        }}
                      >
                        {node.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Node</label>
                  <div className="flex flex-wrap gap-2">
                    {nodes.map((node) => (
                      <Button
                        key={node.id}
                        variant={
                          selectedEnd === node.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setSelectedEnd(node.id);
                          setPath([]);
                        }}
                      >
                        {node.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={findPath}
                    disabled={!selectedStart || !selectedEnd}
                    className="flex-1"
                  >
                    Find Path
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    Reset
                  </Button>
                </div>

                {path.length > 0 && (
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <div className="text-sm font-medium mb-2">Path Found:</div>
                    <div className="text-lg font-mono">{path.join(" → ")}</div>
                    {algorithm === "dijkstra" &&
                      distances[selectedEnd!] !== undefined && (
                        <div className="text-sm text-muted-foreground mt-2">
                          Distance: {distances[selectedEnd!]}
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Algorithm Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {algorithm === "dijkstra" ? (
                  <>
                    <p>
                      <strong>Dijkstra's Algorithm</strong> finds the shortest
                      path in weighted graphs using a greedy approach.
                    </p>
                    <p className="text-muted-foreground">
                      Time Complexity: O(V² + E) or O((V + E) log V) with
                      priority queue
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Breadth-First Search (BFS)</strong> finds the
                      shortest path in unweighted graphs by exploring level by
                      level.
                    </p>
                    <p className="text-muted-foreground">
                      Time Complexity: O(V + E)
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Graph Visualization */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Graph Visualization</CardTitle>
                <CardDescription>
                  Click nodes to select start and end points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[600px] border rounded-lg bg-card overflow-hidden">
                  <svg
                    width="100%"
                    height="100%"
                    className="absolute inset-0"
                    viewBox="0 0 600 400"
                  >
                    {/* Edges */}
                    {edges.map((edge, idx) => {
                      const fromNode = nodes.find((n) => n.id === edge.from);
                      const toNode = nodes.find((n) => n.id === edge.to);
                      if (!fromNode || !toNode) return null;

                      const isPath = isPathEdge(edge);
                      const midX = (fromNode.x + toNode.x) / 2;
                      const midY = (fromNode.y + toNode.y) / 2;

                      return (
                        <g key={idx}>
                          <line
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={isPath ? "#fec463" : "#a8b4c7"}
                            strokeWidth={isPath ? 3 : 2}
                            className="transition-colors"
                          />
                          <text
                            x={midX}
                            y={midY - 5}
                            textAnchor="middle"
                            className="text-xs fill-foreground"
                            style={{ fontSize: "12px" }}
                          >
                            {edge.weight}
                          </text>
                        </g>
                      );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => {
                      const isStart = selectedStart === node.id;
                      const isEnd = selectedEnd === node.id;
                      const inPath = isInPath(node.id);
                      const distance = distances[node.id];

                      let fill = "#e8e9df";
                      if (inPath) fill = "#fec463";
                      if (isStart) fill = "#3dd98b";
                      if (isEnd) fill = "#ec4b6e";

                      return (
                        <g key={node.id}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={20}
                            fill={fill}
                            stroke={
                              inPath || isStart || isEnd ? "#4d3f32" : "#d4d5c8"
                            }
                            strokeWidth={inPath || isStart || isEnd ? 3 : 2}
                            className="cursor-pointer transition-all hover:r-[25]"
                            onClick={() => {
                              if (!selectedStart) {
                                setSelectedStart(node.id);
                              } else if (
                                !selectedEnd &&
                                node.id !== selectedStart
                              ) {
                                setSelectedEnd(node.id);
                              }
                            }}
                          />
                          <text
                            x={node.x}
                            y={node.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground font-bold pointer-events-none"
                            style={{ fontSize: "14px" }}
                          >
                            {node.label}
                          </text>
                          {distance !== undefined && distance !== Infinity && (
                            <text
                              x={node.x}
                              y={node.y + 35}
                              textAnchor="middle"
                              className="text-xs fill-muted-foreground"
                              style={{ fontSize: "10px" }}
                            >
                              d:{distance}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#3dd98b] border-2 border-foreground" />
                    <span>Start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#ec4b6e] border-2 border-foreground" />
                    <span>End</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#fec463] border-2 border-foreground" />
                    <span>Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#e8e9df] border-2 border-[#d4d5c8]" />
                    <span>Unvisited</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
