export type Category = 'plastic' | 'paper' | 'metal' | 'glass' | 'other';

const basePoints: Record<Category, number> = {
  plastic: 10,
  paper: 8,
  metal: 12,
  glass: 15,
  other: 5,
};

const sizeMultiplier: Record<'small' | 'medium' | 'large', number> = {
  small: 1,
  medium: 1.2,
  large: 1.5,
};

export function computePoints(
  category: Category,
  size?: 'small' | 'medium' | 'large'
): number {
  // Fixed scoring: award 100 points per recycling action
  // regardless of category and size, as requested.
  return 100;
}

export function guidanceFor(category: Category): string {
  switch (category) {
    case 'plastic':
      return [
        '내용물 비우기 → 물로 깨끗이 헹구기 (기름기/음식물 제거)',
        '라벨·뚜껑 분리하기 (재질이 다르면 각각 배출)',
        '부피 줄이기: 페트병은 찌그러뜨려요',
        '플라스틱 전용 배출함에 넣기',
        '⚠️ 오염 심하면 일반 종량제에 배출될 수 있어요',
      ].join('\n');
    case 'paper':
      return [
        '스테이플러·테이프·비닐 코팅 제거 (가능한 만큼)',
        '상자는 테이프 제거 후 납작하게 접기',
        '종이컵/우유팩은 헹군 뒤 말려서 종이류 전용 배출함',
        '젖은 종이·오염된 종이는 일반 종량제',
      ].join('\n');
    case 'metal':
      return [
        '내용물 비우기 → 물로 헹구기',
        '라벨/비닐 제거 (가능한 만큼)',
        '부피 줄이기: 캔은 눌러서 배출',
        '캔/고철 전용 배출함에 넣기',
        '⚠️ 에어로졸(스프레이)은 구멍 내지 말고 지자체 지침대로 별도 배출',
      ].join('\n');
    case 'glass':
      return [
        '뚜껑 분리(금속/플라스틱은 따로 배출)',
        '내용물 비우고 가볍게 헹구기',
        '색상 분리 수거함이 있으면 색상별로 배출',
        '⚠️ 깨진 유리는 신문지로 감싸 “파손 위험” 표기 후 지자체 지침대로 배출',
      ].join('\n');
    default:
      return [
        '가까운 분리수거 안내(학교/지자체 공지) 확인',
        '재질 확인이 어려우면 교사/관리자에게 문의',
        '⚠️ 위험물(배터리/전구 등)은 지정 수거함 이용',
      ].join('\n');
  }
}
