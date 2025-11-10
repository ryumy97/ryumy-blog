import { lerp } from "@/lib/math";
import { animate, spring } from "motion";
import * as THREE from "three";

type LabelSprite = THREE.Sprite & {
  userData: {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    texture: THREE.CanvasTexture;
  };
};

function drawLabelCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  id: string,
  color: string
) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = color;
  context.font = "24px Inter, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(id, canvas.width / 2, canvas.height / 2);
}

function createLabelSprite(id: string, color: string): LabelSprite {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not get canvas context");
  }

  drawLabelCanvas(canvas, context, id, color);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(material) as LabelSprite;
  sprite.scale.set(0.4, 0.2, 1);
  sprite.center.set(0.5, 0.5);
  sprite.visible = true;
  sprite.userData = {
    canvas,
    context,
    texture,
  };

  return sprite;
}

function updateLabelSprite(sprite: LabelSprite, id: string, color: string) {
  const { canvas, context, texture } = sprite.userData;

  drawLabelCanvas(canvas, context, id, color);

  texture.needsUpdate = true;
  sprite.visible = true;
}

class Node {
  public id: string;
  public index: number = 0;
  public position: [number, number, number];
  public createdAt: number;
  public color: string;
  public size: number;

  constructor(
    id: string,
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
  public weight: number;
  public createdAt: number;
  public index: number = 0;
  public percent: number = 0;

  constructor(from: Node, to: Node, weight: number, createdAt: number) {
    this.from = from;
    this.to = to;
    this.weight = weight;
    this.createdAt = createdAt;
  }
}

export class ParticleSystem {
  private nodes: Node[];
  private edges: Edge[];

  public colorArray: Float32Array = new Float32Array(0);
  public sizeArray: Float32Array = new Float32Array(0);
  public positionArray: Float32Array = new Float32Array(0);
  public linePositionArray: Float32Array = new Float32Array(0);

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
  public linePositionAttribute: THREE.BufferAttribute =
    new THREE.BufferAttribute(this.linePositionArray, 3);

  public labelSprites: Map<string, LabelSprite> = new Map();
  public weightSprites: Map<string, LabelSprite> = new Map();

  public weightSpritesOpacity: number = 0;

  public needsUpdate: boolean = false;
  public labelsNeedSync: boolean = false;
  public weightsNeedSync: boolean = false;

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;

    this.updateAttributes();
  }

  public getNode(id: string) {
    return this.nodes.find((n) => n.id === id);
  }

  public addNode(
    id: string,
    position: [number, number, number],
    color: string,
    time: number
  ) {
    const newNode = new Node(id, position, time, color);
    this.nodes.push(newNode);

    this.updateAttributes();

    const updateNodeAttributesBinded = () => {
      this.updateNodeAttributes(newNode);
    };

    animate(0, 1, {
      type: spring,
      stiffness: 400,
      damping: 20,
      onUpdate(latest) {
        newNode.size = latest;

        updateNodeAttributesBinded();
      },
    });
  }

  public addNodeFrom(
    fromId: string,
    to: {
      id: string;
      position: [number, number, number];
      color: string;
      weight: number;
      time: number;
    }
  ) {
    const from = this.nodes.find((n) => n.id === fromId);
    if (!from) {
      throw new Error(`From node with id ${fromId} not found`);
    }

    const newNode = new Node(to.id, to.position, to.time, to.color);
    this.nodes.push(newNode);

    const edge = new Edge(from, newNode, to.weight, to.time);
    this.edges.push(edge);

    this.updateAttributes();

    const updateNodeAttributesBinded = () => {
      this.updateNodeAttributes(newNode);
    };

    animate(0, 1, {
      type: spring,
      stiffness: 400,
      damping: 20,
      onUpdate(latest) {
        newNode.size = latest;

        updateNodeAttributesBinded();
      },
    });

    const updateEdgeAttributesBinded = () => {
      this.updateEdgeAttributes(edge);
    };

    animate(0, 1, {
      type: spring,
      stiffness: 400,
      damping: 50,
      onUpdate(latest) {
        edge.percent = latest;

        updateEdgeAttributesBinded();
      },
    });
  }

  public connectNodes(
    fromId: string,
    toId: string,
    weight: number,
    time: number
  ) {
    const from = this.nodes.find((n) => n.id === fromId);
    if (!from) {
      throw new Error(`From node with id ${fromId} not found`);
    }

    const to = this.nodes.find((n) => n.id === toId);

    if (!to) {
      throw new Error(`To node with id ${toId} not found`);
    }

    const newEdge = new Edge(from, to, weight, time);
    this.edges.push(newEdge);

    this.updateAttributes();

    const updateEdgeAttributesBinded = () => {
      this.updateEdgeAttributes(newEdge);
    };

    animate(0, 1, {
      type: spring,
      stiffness: 400,
      damping: 50,
      onUpdate(latest) {
        newEdge.percent = latest;

        updateEdgeAttributesBinded();
      },
    });
  }

  public removeNode(id: string) {
    const node = this.nodes.find((n) => n.id === id);
    if (!node) {
      throw new Error(`Node with id ${id} not found`);
    }

    this.nodes = this.nodes.filter((n) => n.id !== id);
    this.edges = this.edges.filter((e) => e.from.id !== id && e.to.id !== id);

    this.updateAttributes();
  }

  public removeEdge(fromId: string, toId: string) {
    const edge = this.edges.find(
      (e) => e.from.id === fromId && e.to.id === toId
    );
    if (!edge) {
      throw new Error(`Edge from ${fromId} to ${toId} not found`);
    }

    this.edges = this.edges.filter(
      (e) => e.from.id !== fromId && e.to.id !== toId
    );
    this.updateAttributes();
  }

  public clear() {
    this.nodes = [];
    this.edges = [];
    this.updateAttributes();
  }

  public syncLabelSprites() {
    if (!this.labelsNeedSync) {
      return;
    }

    this.nodes.forEach((node) => {
      let sprite = this.labelSprites.get(node.id);
      if (!sprite) {
        sprite = createLabelSprite(node.id, node.color);
        this.labelSprites.set(node.id, sprite);
      } else {
        updateLabelSprite(sprite, node.id, node.color);
      }

      sprite.position.set(
        node.position[0],
        node.position[1] + 0.15,
        node.position[2]
      );
    });

    this.labelSprites.forEach((sprite, id) => {
      if (!this.nodes.some((node) => node.id === id)) {
        sprite.visible = false;
        this.labelSprites.delete(id);
      }
    });
  }

  public syncWeightSprites() {
    if (!this.weightsNeedSync) {
      return;
    }

    this.edges.forEach((edge) => {
      let sprite = this.weightSprites.get(edge.from.id + "-" + edge.to.id);
      if (!sprite) {
        sprite = createLabelSprite(edge.weight.toFixed(1), "#878d97");
        this.weightSprites.set(edge.from.id + "-" + edge.to.id, sprite);
      }

      const material = sprite.material as THREE.SpriteMaterial;
      material.opacity = this.weightSpritesOpacity;
      material.transparent = true;
      material.depthWrite = false;
      material.needsUpdate = true;

      sprite.visible = this.weightSpritesOpacity > 0;

      sprite.position.set(
        lerp(edge.from.position[0], edge.to.position[0], 0.5),
        lerp(edge.from.position[1], edge.to.position[1], 0.5),
        lerp(edge.from.position[2], edge.to.position[2], 0.5)
      );
    });

    this.weightSprites.forEach((sprite, id) => {
      if (!this.edges.some((edge) => edge.from.id + "-" + edge.to.id === id)) {
        sprite.visible = false;
        this.weightSprites.delete(id);
      }
    });
  }

  public showWeightSprites() {
    const binded = (latest: number) => {
      this.weightSpritesOpacity = latest;
      this.weightsNeedSync = true;
    };

    animate(0, 1, {
      type: spring,
      stiffness: 400,
      damping: 20,
      onUpdate(latest) {
        binded(latest);
      },
    });
  }

  public hideWeightSprites() {
    const binded = (latest: number) => {
      this.weightSpritesOpacity = latest;
      this.weightsNeedSync = true;
    };

    animate(1, 0, {
      type: spring,
      stiffness: 400,
      damping: 20,
      onUpdate(latest) {
        binded(latest);
      },
    });
  }

  private updateAttributes() {
    this.colorArray = new Float32Array(this.nodes.length * 3);
    this.sizeArray = new Float32Array(this.nodes.length);
    this.positionArray = new Float32Array(this.nodes.length * 3);
    this.linePositionArray = new Float32Array(this.edges.length * 2 * 3);

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

    this.edges.forEach((edge, i) => {
      const from = edge.from.position;
      const to = edge.to.position;
      const baseIndex = i * 6;

      this.linePositionArray[baseIndex] = from[0];
      this.linePositionArray[baseIndex + 1] = from[1];
      this.linePositionArray[baseIndex + 2] = from[2];
      this.linePositionArray[baseIndex + 3] = lerp(from[0], to[0], 0);
      this.linePositionArray[baseIndex + 4] = lerp(from[1], to[1], 0);
      this.linePositionArray[baseIndex + 5] = lerp(from[2], to[2], 0);

      edge.index = i;
    });

    this.colorAttribute = new THREE.BufferAttribute(this.colorArray, 3);
    this.sizeAttribute = new THREE.BufferAttribute(this.sizeArray, 1);
    this.positionAttribute = new THREE.BufferAttribute(this.positionArray, 3);
    this.linePositionAttribute = new THREE.BufferAttribute(
      this.linePositionArray,
      3
    );

    this.needsUpdate = true;
    this.labelsNeedSync = true;
    this.weightsNeedSync = true;
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
    this.labelsNeedSync = true;
    this.weightsNeedSync = true;
  }

  private updateEdgeAttributes(edge: Edge) {
    const from = edge.from.position;
    const to = edge.to.position;
    const percent = edge.percent;

    this.linePositionArray[edge.index * 6] = from[0];
    this.linePositionArray[edge.index * 6 + 1] = from[1];
    this.linePositionArray[edge.index * 6 + 2] = from[2];
    this.linePositionArray[edge.index * 6 + 3] = lerp(from[0], to[0], percent);
    this.linePositionArray[edge.index * 6 + 4] = lerp(from[1], to[1], percent);
    this.linePositionArray[edge.index * 6 + 5] = lerp(from[2], to[2], percent);

    this.needsUpdate = true;
  }
}
