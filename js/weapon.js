// js/weapon.js

export const WeaponType = {
  MELEE: "melee",
  RANGED: "ranged",
};

export const Rarity = {
  COMMON: "common",
  RARE: "rare",
  EPIC: "epic",
  HEROIC: "heroic",
  LEGENDARY: "legendary",
};

export class Weapon {
  constructor(name, type, damage, range, rarity, icon) {
    this.name = name;         // 무기 이름
    this.type = type;         // 무기 타입 (melee, ranged)
    this.damage = damage;     // 무기 고유 공격력
    this.range = range;       // 공격 범위
    this.rarity = rarity;     // 희귀도
    this.icon = icon;         // 무기 아이콘 경로
  }

  attack(playerX, playerY, facingRight) {
    console.log(`${this.name} 공격 발동!`);
    // 예시: 플레이어 기준 상대적 위치에서 hitbox 생성
    return {
      x: facingRight ? playerX + 20 : playerX - this.range,
      y: playerY,
      width: this.range,
      height: 32,
      damage: this.damage,
    };
  }
}

// 기본 무기 정의 (나무 막대기)
// 무기 아이콘 경로를 weapon.js에서 지정
export const defaultWeapon = new Weapon(
  "나무 막대기",
  WeaponType.MELEE,
  5,
  30,
  Rarity.COMMON,
  "res/img/icons/default_weapon_icon.png"
);
