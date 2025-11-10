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
  sprite.center.set(0.5, 1);
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
  public createdAt: number;

  constructor(from: Node, to: Node, createdAt: number) {
    this.from = from;
    this.to = to;
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

  public needsUpdate: boolean = false;
  private labelsNeedSync: boolean = false;

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;

    this.updateAttributes();
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
    fromId: string,
    to: {
      id: string;
      position: [number, number, number];
      color: string;
      time: number;
    }
  ) {
    const from = this.nodes.find((n) => n.id === fromId);
    if (!from) {
      throw new Error(`From node with id ${fromId} not found`);
    }

    const newNode = new Node(to.id, to.position, to.time, to.color);
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

  public connectNodes(fromId: string, toId: string, time: number) {
    const from = this.nodes.find((n) => n.id === fromId);
    if (!from) {
      throw new Error(`From node with id ${fromId} not found`);
    }

    const to = this.nodes.find((n) => n.id === toId);

    if (!to) {
      throw new Error(`To node with id ${toId} not found`);
    }

    const newEdge = new Edge(from, to, time);
    this.edges.push(newEdge);

    this.updateAttributes();
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
        node.position[1] + 0.3,
        node.position[2]
      );
    });

    this.labelSprites.forEach((sprite, id) => {
      if (!this.nodes.some((node) => node.id === id)) {
        sprite.visible = false;
        this.labelSprites.delete(id);
      }
    });

    this.labelsNeedSync = false;
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
      this.linePositionArray[baseIndex + 3] = to[0];
      this.linePositionArray[baseIndex + 4] = to[1];
      this.linePositionArray[baseIndex + 5] = to[2];
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
  }

  private updateNodeAttributes(node: Node) {
    this.positionArray[node.index * 3] = node.position[0];
    this.positionArray[node.index * 3 + 1] = node.position[1];
    this.positionArray[node.index * 3 + 2] = node.position[2];

    this.colorArray[node.index * 3] = new THREE.Color(node.color).r;
    this.colorArray[node.index * 3 + 1] = new THREE.Color(node.color).g;
    this.colorArray[node.index * 3 + 2] = new THREE.Color(node.color).b;

    this.sizeArray[node.index] = node.size;

    this.updateEdgeAttributesForNode(node);

    this.needsUpdate = true;
    this.labelsNeedSync = true;
  }

  private updateEdgeAttributesForNode(node: Node) {
    this.edges.forEach((edge, i) => {
      if (edge.from !== node && edge.to !== node) {
        return;
      }

      const baseIndex = i * 6;
      const from = edge.from.position;
      const to = edge.to.position;

      this.linePositionArray[baseIndex] = from[0];
      this.linePositionArray[baseIndex + 1] = from[1];
      this.linePositionArray[baseIndex + 2] = from[2];
      this.linePositionArray[baseIndex + 3] = to[0];
      this.linePositionArray[baseIndex + 4] = to[1];
      this.linePositionArray[baseIndex + 5] = to[2];
    });
  }
}
