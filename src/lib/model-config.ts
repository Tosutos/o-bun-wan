import type { Category } from './scoring';

// Default labels for a 5-class trash model; replace with your model's labels
export const DEFAULT_LABELS = ['plastic', 'paper', 'metal', 'glass', 'other'];

// Map model label → app Category
export function mapLabelToCategory(label: string): Category {
  const l = label.toLowerCase();
  // plastic
  if (
    l.includes('plastic') ||
    l.includes('플라스틱') ||
    l.includes('pet') ||
    l.includes('polyethylene') ||
    l.includes('bottle') || // water bottle often plastic
    l.includes('jug') ||
    l.includes('tupperware') ||
    l.includes('bag')
  )
    return 'plastic';
  // paper
  if (
    l.includes('paper') ||
    l.includes('종이') ||
    l.includes('cardboard') ||
    l.includes('carton') ||
    l.includes('newspaper') ||
    l.includes('magazine') ||
    l.includes('tissue') ||
    l.includes('paper towel')
  )
    return 'paper';
  // metal
  if (
    l.includes('metal') ||
    l.includes('can') ||
    l.includes('알루미늄') ||
    l.includes('aluminum') ||
    l.includes('steel') ||
    l.includes('tin') ||
    l.includes('foil')
  )
    return 'metal';
  // glass
  if (
    l.includes('glass') ||
    l.includes('유리') ||
    l.includes('jar') ||
    l.includes('beer bottle') ||
    l.includes('wine bottle')
  )
    return 'glass';
  return 'other';
}

export type LabelMappingConfig = {
  plastic?: string[];
  paper?: string[];
  metal?: string[];
  glass?: string[];
  other?: string[];
};

export function mapLabelToCategoryWithConfig(label: string, cfg?: LabelMappingConfig): Category {
  if (!cfg) return mapLabelToCategory(label);
  const l = label.toLowerCase();
  const match = (arr?: string[]) => !!arr?.some((k) => l.includes(k.toLowerCase()));
  if (match(cfg.plastic)) return 'plastic';
  if (match(cfg.paper)) return 'paper';
  if (match(cfg.metal)) return 'metal';
  if (match(cfg.glass)) return 'glass';
  if (match(cfg.other)) return 'other';
  return mapLabelToCategory(label);
}

// Extended mapping: map raw labels → custom trash class → recycling category
export type CustomMapping = {
  custom?: Record<string, string[]>; // { customLabel: [keywords...] }
  categoryByCustom?: Record<string, Category>; // { customLabel: category }
};

export function mapToCustomAndCategory(
  rawLabel: string,
  mapping?: CustomMapping
): { customLabel?: string; category: Category } {
  const lower = rawLabel.toLowerCase();
  let customLabel: string | undefined;
  if (mapping?.custom) {
    for (const [name, keys] of Object.entries(mapping.custom)) {
      if (keys?.some((k) => lower.includes(k.toLowerCase()))) {
        customLabel = name;
        break;
      }
    }
  }
  if (customLabel) {
    const cat = mapping?.categoryByCustom?.[customLabel];
    if (cat) return { customLabel, category: cat };
  }
  // Fallback to direct category mapping if provided in legacy shape
  const legacyCategory = mapLabelToCategoryWithConfig(rawLabel, mapping as any);
  return { customLabel, category: legacyCategory };
}

// Korean display names for custom labels
export function customLabelKo(customLabel?: string): string | undefined {
  if (!customLabel) return undefined;
  const m: Record<string, string> = {
    glass: '유리',
    pet: '페트병',
    styrofoam: '스티로폼',
    can: '캔',
    milkCarton: '우유팩',
    paperCup: '종이컵',
    paper: '종이',
    box: '종이박스',
    plasticBag: '비닐봉지',
    battery: '배터리',
    rubberGloves: '고무장갑',
    lamp: '전구',
    cosmeticTube: '화장품 튜브',
    detergentTube: '세제 튜브',
    fruitPackingNet: '과일 포장망',
  };
  return m[customLabel] ?? customLabel;
}
