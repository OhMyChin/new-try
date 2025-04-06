export class Enemy {
    constructor(x, y, width, height, speed, hp, spriteSrc) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.hp = hp;
  
      this.sprite = new Image();
      this.sprite.src = spriteSrc;
    }
  
    update() {
      // 추후 AI 로직 등
    }
  
    draw(ctx) {
      if (this.sprite.complete && this.sprite.naturalWidth !== 0) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
      } else {
        // 이미지 로딩 전에는 임시 박스
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
  }
  
  // ======= 몬스터 생성 함수 =======
  
  // Slime 몬스터
  export function createSlime(x, y) {
    return new Enemy(
      x,
      y,
      32, // width
      32, // height
      1,  // speed
      20, // hp
      "res/img/enemy/slime.png"
    );
  }
  
  // P_mushroom 몬스터
  export function createPMushroom(x, y) {
    return new Enemy(
      x,
      y,
      32,
      32,
      1.5,
      25,
      "res/img/enemy/p_mushroom.png"
    );
  }
  