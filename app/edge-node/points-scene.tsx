import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ParticleSystem } from "./particle-system";

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

export function PointsScene({
  particleSystem,
}: {
  particleSystem: ParticleSystem;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const pointsGeometryRef = useRef<THREE.BufferGeometry>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry>(null);
  const pointsShaderRef = useRef<THREE.ShaderMaterial | null>(null);
  const labelsGroupRef = useRef<THREE.Group>(null);

  const { gl } = useThree();

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
  }, [particleSystem]);

  useEffect(() => {
    if (!pointsShaderRef.current) return;
    pointsShaderRef.current.uniforms.uSize.value = 18 * gl.getPixelRatio();
  }, [gl]);

  useFrame(() => {
    if (particleSystem.needsUpdate) {
      if (pointsGeometryRef.current) {
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
      }

      if (linesGeometryRef.current) {
        linesGeometryRef.current.setAttribute(
          "position",
          particleSystem.linePositionAttribute
        );

        if (linesGeometryRef.current.attributes.position) {
          linesGeometryRef.current.attributes.position.needsUpdate = true;
        }
      }

      if (labelsGroupRef.current) {
        particleSystem.syncLabelSprites();

        labelsGroupRef.current.clear();
        particleSystem.labelSprites.forEach((sprite, id) => {
          labelsGroupRef.current?.add(sprite);
        });
      }

      particleSystem.needsUpdate = false;
    }

    pointsMaterial.needsUpdate = true;
  });

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
      <group ref={labelsGroupRef} />
    </>
  );
}
