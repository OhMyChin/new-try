// 무기 타입 정의
export const WeaponType = {
    MELEE: "melee",   // 근접
    RANGED: "ranged", // 원거리
  };
  
  // 무기 희귀도 정의
  export const Rarity = {
    COMMON: "일반",
    RARE: "희귀",
    SUPERIOR: "고급",
    HEROIC: "영웅",
    LEGENDARY: "전설",
  };
  
  // 무기 클래스
  export class Weapon {
    constructor(name, type, damage, range, rarity) {
      this.name = name;
      this.type = type;         // 근접 or 원거리
      this.damage = damage;     // 무기 자체 공격력
      this.range = range;       // 공격 범위 (픽셀 단위)
      this.rarity = rarity;     // 무기 희귀도
    }
  
    // 기본 공격 메서드
    attack(playerX, playerY, facingRight) {
      console.log(`${this.name} 공격 발동!`);
      // 히트박스 위치 및 크기 계산
      return {
        x: facingRight ? playerX + 20 : playerX - this.range,
        y: playerY,
        width: this.range,
        height: 32,
        damage: this.damage,
      };
    }
  }
  
  // 기본 무기 정의
  export const defaultWeapon = new Weapon(
    "나무 막대기",
    WeaponType.MELEE,
    5,
    30,
    Rarity.COMMON
  );
  