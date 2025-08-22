export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  order: number;
}

export const categories: Category[] = [
  {
    id: "data-visualization",
    name: "데이터 표현 100가지 방법",
    description: "점, 선, 면 등 기초적인 시각적 요소부터 혁신적인 표현까지",
    color: "bg-primary",
    order: 1,
  },
  {
    id: "fundamentals",
    name: "Fundamentals",
    description: "점, 선, 면 등 기초적인 시각적 요소",
    color: "bg-secondary",
    order: 2,
  },
  {
    id: "structures",
    name: "Structures",
    description: "네트워크, 계층, 분포 등 구조적 표현",
    color: "bg-accent",
    order: 3,
  },
  {
    id: "context",
    name: "Context",
    description: "시간, 공간, 흐름 등 맥락적 표현",
    color: "bg-muted",
    order: 4,
  },
  {
    id: "interaction",
    name: "Interaction",
    description: "사용자 상호작용을 통한 데이터 탐색",
    color: "bg-primary",
    order: 5,
  },
  {
    id: "beyond",
    name: "Beyond",
    description: "혁신적이고 창의적인 데이터 표현",
    color: "bg-secondary",
    order: 6,
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name || id;
}

export function getCategoryDescription(id: string): string {
  return getCategoryById(id)?.description || "";
}

export function getCategoryColor(id: string): string {
  return getCategoryById(id)?.color || "bg-muted";
}

export function getAllCategories(): Category[] {
  return categories.sort((a, b) => a.order - b.order);
}

export function getCategoryNames(): Record<string, string> {
  return categories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {} as Record<string, string>);
}

export function getCategoryDescriptions(): Record<string, string> {
  return categories.reduce((acc, category) => {
    acc[category.id] = category.description;
    return acc;
  }, {} as Record<string, string>);
}
