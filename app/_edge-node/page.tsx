"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";
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
  position: [number, number, number];
  label: string;
}

interface Edge {
  from: string;
  to: string;
  weight?: number;
}

// 3D Edge Component
function Edge3D({
  from,
  to,
  nodes,
  selected,
}: {
  from: string;
  to: string;
  nodes: Node[];
  selected: boolean;
}) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);

  if (!fromNode || !toNode) return null;

  const points = [
    new THREE.Vector3(...fromNode.position),
    new THREE.Vector3(...toNode.position),
  ];

  const color = selected ? "#fec463" : "#a8b4c7";
  const lineWidth = selected ? 3 : 1;

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={selected ? 0.9 : 0.5}
    />
  );
}

function NodesPoints({
  nodes,
  selectedNode,
  hoveredNode,
  onNodeSelect,
  onNodeHover,
}: {
  nodes: Node[];
  selectedNode: string | null;
  hoveredNode: string | null;
  onNodeSelect: (nodeId: string) => void;
  onNodeHover: (nodeId: string | null) => void;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const positions = useMemo(() => {
    const array = new Float32Array(nodes.length * 3);
    nodes.forEach((node, idx) => {
      array[idx * 3] = node.position[0];
      array[idx * 3 + 1] = node.position[1];
      array[idx * 3 + 2] = node.position[2];
    });
    return array;
  }, [nodes]);

  useEffect(() => {
    const geometry = geometryRef.current;
    if (!geometry) return;

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.attributes.position.needsUpdate = true;
  }, [positions]);

  useEffect(() => {
    const geometry = geometryRef.current;
    if (!geometry) return;

    const colors = new Float32Array(nodes.length * 3);
    nodes.forEach((node, idx) => {
      const color = new THREE.Color(
        node.id === selectedNode
          ? "#fec463"
          : node.id === hoveredNode
          ? "#ec4b6e"
          : "#3dd98b"
      );
      colors[idx * 3] = color.r;
      colors[idx * 3 + 1] = color.g;
      colors[idx * 3 + 2] = color.b;
    });

    const existing = geometry.getAttribute("color") as
      | THREE.BufferAttribute
      | undefined;

    if (!existing || existing.count !== nodes.length) {
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    } else {
      existing.array.set(colors);
      existing.needsUpdate = true;
    }
  }, [nodes, selectedNode, hoveredNode]);

  return (
    <points
      ref={pointsRef}
      onPointerMove={(event) => {
        event.stopPropagation();
        if (event.index !== undefined) {
          onNodeHover(nodes[event.index].id);
        }
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onNodeHover(null);
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (event.index !== undefined) {
          onNodeSelect(nodes[event.index].id);
        }
      }}
    >
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        attach="material"
        size={1}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.95}
      />
    </points>
  );
}

function NodeLabels({ nodes }: { nodes: Node[] }) {
  return (
    <>
      {nodes.map((node) => (
        <Text
          key={`label-${node.id}`}
          position={[
            node.position[0],
            node.position[1] + 0.6,
            node.position[2],
          ]}
          fontSize={0.28}
          color="#fdfdfd"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#4d3f32"
        >
          {node.label}
        </Text>
      ))}
    </>
  );
}

// Main 3D Scene Component
function GraphScene({
  nodes,
  edges,
  selectedNode,
  onNodeSelect,
  hoveredNode,
  onNodeHover,
  selectedEdges,
}: {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  onNodeSelect: (nodeId: string) => void;
  hoveredNode: string | null;
  onNodeHover: (nodeId: string | null) => void;
  selectedEdges: Set<string>;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />

      {/* Render edges */}
      {edges.map((edge, idx) => {
        const edgeKey = `${edge.from}-${edge.to}`;
        const reverseKey = `${edge.to}-${edge.from}`;
        const isSelected =
          selectedEdges.has(edgeKey) || selectedEdges.has(reverseKey);
        return (
          <Edge3D
            key={idx}
            from={edge.from}
            to={edge.to}
            nodes={nodes}
            selected={isSelected}
          />
        );
      })}

      <NodesPoints
        nodes={nodes}
        selectedNode={selectedNode}
        hoveredNode={hoveredNode}
        onNodeSelect={onNodeSelect}
        onNodeHover={onNodeHover}
      />
      <NodeLabels nodes={nodes} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={20}
        autoRotate={false}
      />
    </>
  );
}

export default function EdgeNodePage() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "A", position: [-2, 2, 0], label: "A" },
    { id: "B", position: [2, 2, 0], label: "B" },
    { id: "C", position: [0, 0, 2], label: "C" },
    { id: "D", position: [-2, -2, 0], label: "D" },
    { id: "E", position: [2, -2, 0], label: "E" },
    { id: "F", position: [0, 0, -2], label: "F" },
    { id: "G", position: [0, 3, 0], label: "G" },
    { id: "H", position: [0, -3, 0], label: "H" },
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { from: "A", to: "B" },
    { from: "A", to: "C" },
    { from: "A", to: "D" },
    { from: "B", to: "C" },
    { from: "B", to: "E" },
    { from: "C", to: "D" },
    { from: "C", to: "E" },
    { from: "C", to: "F" },
    { from: "D", to: "E" },
    { from: "E", to: "F" },
    { from: "A", to: "G" },
    { from: "B", to: "G" },
    { from: "D", to: "H" },
    { from: "E", to: "H" },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate selected edges (edges connected to selected node)
  const selectedEdges = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const edgeSet = new Set<string>();
    edges.forEach((edge) => {
      if (edge.from === selectedNode || edge.to === selectedNode) {
        edgeSet.add(`${edge.from}-${edge.to}`);
      }
    });
    return edgeSet;
  }, [selectedNode, edges]);

  // Get neighbors of selected node
  const neighbors = useMemo(() => {
    if (!selectedNode) return [];
    return edges
      .filter((e) => e.from === selectedNode || e.to === selectedNode)
      .map((e) => (e.from === selectedNode ? e.to : e.from));
  }, [selectedNode, edges]);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);

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
            3D Edge-Node Graph
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Interactive 3D visualization of a graph with nodes and edges
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
                <CardDescription>
                  Interact with the 3D graph visualization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Instructions:</div>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Click and drag to rotate the camera</li>
                    <li>Scroll to zoom in/out</li>
                    <li>Click nodes to select them</li>
                    <li>Hover over nodes to highlight</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Graph Statistics:</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Nodes: {nodes.length}</div>
                    <div>Edges: {edges.length}</div>
                  </div>
                </div>

                {selectedNode && selectedNodeData && (
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <div className="text-sm font-medium mb-2">
                      Selected Node: {selectedNodeData.label}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        Position: ({selectedNodeData.position.join(", ")})
                      </div>
                      <div>Neighbors: {neighbors.length}</div>
                      <div className="mt-2">
                        Connected to: {neighbors.join(", ")}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => setSelectedNode(null)}
                  disabled={!selectedNode}
                  className="w-full"
                >
                  Clear Selection
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Node List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {nodes.map((node) => (
                    <Button
                      key={node.id}
                      variant={selectedNode === node.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNodeSelect(node.id)}
                      className="w-full justify-start"
                    >
                      {node.label} - ({node.position.join(", ")})
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#3dd98b]" />
                  <span>Default Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#ec4b6e]" />
                  <span>Hovered Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#fec463]" />
                  <span>Selected Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#a8b4c7]" />
                  <span>Default Edge</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#fec463]" />
                  <span>Selected Edge</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3D Canvas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>3D Visualization</CardTitle>
                <CardDescription>
                  Rotate, zoom, and explore the graph in 3D space
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[600px] rounded-lg overflow-hidden bg-[#2e323f]">
                  <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                    <GraphScene
                      nodes={nodes}
                      edges={edges}
                      selectedNode={selectedNode}
                      onNodeSelect={handleNodeSelect}
                      hoveredNode={hoveredNode}
                      onNodeHover={setHoveredNode}
                      selectedEdges={selectedEdges}
                    />
                  </Canvas>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
