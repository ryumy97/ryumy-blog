import { animate, cubicBezier, spring } from "motion";
import * as THREE from "three";

export const animateCamera = async (
  camera: THREE.Camera,
  originPosition: [number, number, number],
  originTarget: [number, number, number],
  position: [number, number, number],
  target: [number, number, number]
) => {
  const originPositionVector = new THREE.Vector3(
    originPosition[0],
    originPosition[1],
    originPosition[2]
  );
  const originTargetVector = new THREE.Vector3(
    originTarget[0],
    originTarget[1],
    originTarget[2]
  );
  const positionVector = new THREE.Vector3(
    position[0],
    position[1],
    position[2]
  );
  const targetVector = new THREE.Vector3(target[0], target[1], target[2]);

  animate(0, 1, {
    duration: 0.5,
    ease: cubicBezier(0.3, 0, 0, 1),
    onUpdate(latest) {
      const currentPosition = originPositionVector
        .clone()
        .lerp(positionVector, latest);
      const currentTarget = originTargetVector
        .clone()
        .lerp(targetVector, latest);

      camera.position.copy(currentPosition);
      camera.lookAt(currentTarget);
    },
  });
};
