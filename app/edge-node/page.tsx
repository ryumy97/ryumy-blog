"use client";

import { TunnelIn } from "@/components/tunnel";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { animate, delay, spring } from "motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

class Node {
  public id: number;
  public index: number = 0;
  public position: [number, number, number];
  public createdAt: number;
  public color: string;
  public size: number;

  constructor(
    id: number,
    position: [number, number, number],
    createdAt: number,
    color: string
  ) {
    this.id = id;
    this.position = position;
    this.createdAt = createdAt;
    this.color = color;
    this.size = 0;
  }
}

class Edge {
  public from: Node;
  public to: Node;
  public createdAt: number;

  constructor(from: Node, to: Node, createdAt: number) {
    this.from = from;
    this.to = to;
    this.createdAt = createdAt;
  }
}

class ParticleSystem {
  private nodes: Node[];
  private edges: Edge[];

  public nextNodeId: number = 0;

  public colorArray: Float32Array = new Float32Array(0);
  public sizeArray: Float32Array = new Float32Array(0);
  public positionArray: Float32Array = new Float32Array(0);

  public colorAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(
    this.colorArray,
    3
  );
  public positionAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(
    this.positionArray,
    3
  );
  public sizeAttribute: THREE.BufferAttribute = new THREE.BufferAttribute(
    this.sizeArray,
    1
  );

  public needsUpdate: boolean = false;

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;

    this.updateAttributes();
  }

  public addNode(
    position: [number, number, number],
    color: string,
    time: number
  ) {
    const newNode = new Node(this.nextNodeId, position, time, color);
    this.nextNodeId++;
    this.nodes.push(newNode);

    this.updateAttributes();

    const updateNodeAttributesBinded = (node: Node) => {
      this.updateNodeAttributes(node);
    };

    animate(0, 1, {
      type: spring,
      stiffness: 400,
      damping: 20,
      onUpdate(latest) {
        newNode.size = latest;

        updateNodeAttributesBinded(newNode);
      },
    });
  }

  public addNodeFrom(
    id: number,
    to: {
      position: [number, number, number];
      color: string;
      time: number;
    }
  ) {
    const from = this.nodes.find((n) => n.id === id);
    if (!from) {
      throw new Error(`From node with id ${id} not found`);
    }

    const newNode = new Node(this.nextNodeId, to.position, to.time, to.color);
    this.nextNodeId++;
    this.nodes.push(newNode);
    this.edges.push(new Edge(from, newNode, to.time));

    this.updateAttributes();

    const updateNodeAttributesBinded = (node: Node) => {
      this.updateNodeAttributes(node);
    };

    animate(0, 1, {
      type: spring,
      stiffness: 400,
      damping: 20,
      onUpdate(latest) {
        newNode.size = latest;

        updateNodeAttributesBinded(newNode);
      },
    });
  }

  private updateAttributes() {
    this.colorArray = new Float32Array(this.nodes.length * 3);
    this.sizeArray = new Float32Array(this.nodes.length);
    this.positionArray = new Float32Array(this.nodes.length * 3);

    this.nodes.forEach((node, i) => {
      this.positionArray[i * 3] = node.position[0];
      this.positionArray[i * 3 + 1] = node.position[1];
      this.positionArray[i * 3 + 2] = node.position[2];

      const color = new THREE.Color(node.color);
      this.colorArray[i * 3] = color.r;
      this.colorArray[i * 3 + 1] = color.g;
      this.colorArray[i * 3 + 2] = color.b;

      this.sizeArray[i] = node.size;

      node.index = i;
    });

    this.colorAttribute = new THREE.BufferAttribute(this.colorArray, 3);
    this.sizeAttribute = new THREE.BufferAttribute(this.sizeArray, 1);
    this.positionAttribute = new THREE.BufferAttribute(this.positionArray, 3);

    this.needsUpdate = true;
  }

  private updateNodeAttributes(node: Node) {
    this.positionArray[node.index * 3] = node.position[0];
    this.positionArray[node.index * 3 + 1] = node.position[1];
    this.positionArray[node.index * 3 + 2] = node.position[2];

    this.colorArray[node.index * 3] = new THREE.Color(node.color).r;
    this.colorArray[node.index * 3 + 1] = new THREE.Color(node.color).g;
    this.colorArray[node.index * 3 + 2] = new THREE.Color(node.color).b;

    this.sizeArray[node.index] = node.size;

    this.needsUpdate = true;
  }
}

const vertexShader = /* glsl */ `
  attribute float size;
  attribute vec3 color;
  
  varying vec3 vColor;

  uniform float uSize;

  void main() {
    vColor = color;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    gl_PointSize = size * uSize * (300.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  uniform float uOpacity;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    gl_FragColor = vec4(vColor, uOpacity);
  }
`;

function PointsScene({ particleSystem }: { particleSystem: ParticleSystem }) {
  const pointsRef = useRef<THREE.Points>(null);
  const pointsGeometryRef = useRef<THREE.BufferGeometry>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry>(null);
  const pointsShaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const linesShaderRef = useRef<THREE.ShaderMaterial | null>(null);

  const { gl, clock, camera } = useThree();

  const pointsMaterial = useMemo(() => {
    const pointsMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSize: { value: 1 },
        uOpacity: { value: 1 },
      },
    });

    pointsShaderRef.current = pointsMaterial;
    return pointsMaterial;
  }, []);

  useEffect(() => {
    return () => {
      pointsShaderRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!pointsShaderRef.current) return;
    pointsShaderRef.current.uniforms.uSize.value = 18 * gl.getPixelRatio();
  }, [gl]);

  useFrame(() => {
    if (!pointsGeometryRef.current) return;

    if (particleSystem.needsUpdate) {
      pointsGeometryRef.current.setAttribute(
        "position",
        particleSystem.positionAttribute
      );
      pointsGeometryRef.current.setAttribute(
        "color",
        particleSystem.colorAttribute
      );
      pointsGeometryRef.current.setAttribute(
        "size",
        particleSystem.sizeAttribute
      );

      pointsGeometryRef.current.attributes.position.needsUpdate = true;
      pointsGeometryRef.current.attributes.color.needsUpdate = true;
      pointsGeometryRef.current.attributes.size.needsUpdate = true;

      particleSystem.needsUpdate = false;
    }

    pointsMaterial.needsUpdate = true;
  });

  //   camera.lookAt();

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry ref={pointsGeometryRef} />
        <primitive object={pointsMaterial} attach="material" />
      </points>
      <lineSegments>
        <bufferGeometry ref={linesGeometryRef} />
        <lineBasicMaterial color="#878d97" linewidth={1} />
      </lineSegments>
    </>
  );
}

function Scene() {
  const particleSystem = useMemo(() => new ParticleSystem([], []), []);

  const { clock, camera } = useThree();

  useEffect(() => {
    delay(() => {
      particleSystem.addNode([0, 0, 0], "#3dd98b", clock.elapsedTime);
    }, 0.1);

    delay(() => {
      particleSystem.addNodeFrom(0, {
        position: [1, 0, 0],
        color: "#3dd98b",
        time: clock.elapsedTime,
      });
    }, 1.1);
  }, [particleSystem]);

  return (
    <>
      <PointsScene particleSystem={particleSystem} />
      <TunnelIn>
        <div className="absolute top-1/2 -translate-y-1/2 left-4 w-full max-h-[calc(100vh-2rem)]  max-w-2xs mx-auto">
          <Card className="">
            <CardHeader>
              <CardTitle>Hello</CardTitle>
              <CardDescription>This is a card description</CardDescription>
            </CardHeader>
            <CardContent>Helo</CardContent>
            <CardFooter>{/* <Button>Click me</Button> */}</CardFooter>
          </Card>
        </div>
      </TunnelIn>
    </>
  );
}

export default function Page() {
  return (
    <Canvas
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
