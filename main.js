const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerSpriteSheet = new Image();
playerSpriteSheet.src = "res/img/player.png"; // 파일 경로 확인

const player = {
    x: 100,
    y: canvas.height - 150,
    width: 24,
    height: 32,
    speed: 5,
    dx: 0,
    dy: 0,
    onGround: false,
    currentFrame: 0,
    totalFrames: 5, // 총 5프레임
    animationSpeed: 8, // 애니메이션 속도 (낮을수록 빠름)
    frameCounter: 0,
    facingRight: true,
    moving: false
};

const groundHeight = 50;
const groundY = canvas.height - groundHeight;

const keys = { w: false, a: false, d: false };

document.addEventListener("keydown", (e) => {
    if (e.key === "a") {
        keys.a = true;
        player.moving = true;
        player.facingRight = false;
    }
    if (e.key === "d") {
        keys.d = true;
        player.moving = true;
        player.facingRight = true;
    }
    if (e.key === "w" && player.onGround) {
        keys.w = true;
        player.dy = -10;
        player.onGround = false;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "a") keys.a = false;
    if (e.key === "d") keys.d = false;

    // 이동 키를 떼면 정지 상태
    if (!keys.a && !keys.d) {
        player.moving = false;
        player.currentFrame = 0; // 첫 번째 프레임 (정지)
    }
});

function movePlayer() {
    if (keys.a) player.dx = -player.speed;
    else if (keys.d) player.dx = player.speed;
    else player.dx = 0;

    if (!player.onGround) player.dy += 0.5;

    player.x += player.dx;
    player.y += player.dy;

    if (player.y >= groundY - player.height) {
        player.y = groundY - player.height;
        player.dy = 0;
        player.onGround = true;
    }

    // 이동 중일 때만 2~5 프레임 반복
    if (player.moving) {
        player.frameCounter++;
        if (player.frameCounter >= player.animationSpeed) {
            player.frameCounter = 0;
            player.currentFrame++; // 다음 프레임으로 이동
            if (player.currentFrame > 4) player.currentFrame = 1; // 2~5 프레임 순환
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 땅 그리기
    ctx.fillStyle = "#228B22";
    ctx.fillRect(0, groundY, canvas.width, groundHeight);

    // 플레이어 스프라이트 그리기
    const frameWidth = player.width;
    const frameHeight = player.height;
    const spriteX = player.currentFrame * frameWidth;
    const spriteY = 0;

    ctx.save();
    if (!player.facingRight) {
        ctx.scale(-1, 1);
        ctx.drawImage(playerSpriteSheet, spriteX, spriteY, frameWidth, frameHeight, 
                      -player.x - player.width, player.y, player.width, player.height);
    } else {
        ctx.drawImage(playerSpriteSheet, spriteX, spriteY, frameWidth, frameHeight, 
                      player.x, player.y, player.width, player.height);
    }
    ctx.restore();

    movePlayer();
    requestAnimationFrame(gameLoop);
}

playerSpriteSheet.onload = function () {
    gameLoop();
};