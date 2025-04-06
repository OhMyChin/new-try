export class Enemy {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.hp = 50;
        this.sprite = sprite;
        // 다른 속성들 추가 가능 (예: 이동속도, 공격력 등)
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }

    update() {
        // AI 또는 이동 로직 작성
    }
}
