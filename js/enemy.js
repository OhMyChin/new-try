export class Enemy {
  constructor(x, y, width, height, speed, hp, spriteSrc, name = "enemy") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.hp = hp;
    this.name = name;
    this.alive = true; // 살아있는 상태를 관리하는 속성
    this.sprite = new Image();
    this.sprite.src = spriteSrc;
  }

  update() {
    // 추후 AI 또는 이동 로직 추가 가능
  }

  draw(ctx) {
    if (!this.alive) return; // 죽은 적은 그리지 않음
    if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
      ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      // 이미지가 로딩 중이면 임시 박스 표시
      ctx.fillStyle = "gray";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      console.log(`${this.name}이(가) 쓰러졌습니다!`);
    }
  }
}

// 슬라임 몬스터 생성 함수
export function createSlime(x, y) {
  return new Enemy(
    x,
    y,
    32,                    // width
    32,                    // height
    1,                     // speed
    20,                    // hp
    "res/img/enemy/slime.png", // 슬라임 이미지 경로
    "slime"                // 이름
  );
}

// p_mushroom 몬스터 생성 함수
export function createPMushroom(x, y) {
  return new Enemy(
    x,
    y,
    32,
    32,
    1.5,
    25,
    "res/img/enemy/p_mushroom.png", // p_mushroom 이미지 경로
    "p_mushroom"           // 이름
  );
}