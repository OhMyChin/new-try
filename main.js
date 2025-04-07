import { createSlime, createPMushroom } from "./js/enemy.js";
import { defaultWeapon } from "./js/weapon.js";

// 캔버스 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1240;
canvas.height = 720;

let gameStarted = false;

// 시작 화면 깜빡임 관련 변수
let pressEnterVisible = true;
let blinkTimer = 0;
const blinkInterval = 30; // 약 30프레임마다 깜빡임

// 이미지 로딩
const startBackground = new Image();
startBackground.src = "res/img/start_background.png";

const playerSprite = new Image();
playerSprite.src = "res/img/player.png";

// 플레이어 스탯 인터페이스 업데이트 함수
function updateStats() {
  const statsDiv = document.getElementById("stats");
  if (statsDiv) {
    statsDiv.innerHTML = `
      HP: ${player.hp}<br>
      ATK: ${player.attack}<br>
      DEF: ${player.defense}
    `;
    // stat 인터페이스는 게임 시작 후에만 보임
    if (gameStarted) statsDiv.style.display = "block";
    else statsDiv.style.display = "none";
  }
}

// 플레이어 객체 (무기 포함)
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
  totalFrames: 5,
  animationSpeed: 8,
  frameCounter: 0,
  facingRight: true,
  moving: false,
  hp: 100,
  attack: 10,
  defense: 5,
  weapon: defaultWeapon,
};

const gravity = 1;
const groundHeight = 50;
const groundY = canvas.height - groundHeight;

// 키 입력 상태 및 동시 입력 처리
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  // 게임 시작 전 Enter 키로 시작
  if (e.key === "Enter" && !gameStarted) {
    gameStarted = true;
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
  // 동시 입력 처리: A와 D 모두 안 눌리면 idle 상태
  if (!keys["a"] && !keys["d"]) {
    player.moving = false;
    player.currentFrame = 0;
  } else {
    player.moving = true;
    // 우선순위: A가 눌리면 왼쪽, 아니면 D
    if (keys["a"]) player.facingRight = false;
    else if (keys["d"]) player.facingRight = true;
  }
});

// 적 생성 (enemy.js의 생성 함수를 사용)
const enemies = [
  createSlime(600, groundY - 32),
  createPMushroom(900, groundY - 32),
];

// 공격 관련 변수 (히트박스 시각화)
let currentHitbox = null;
let hitboxTimer = 0;

// 공격 처리: 마우스 왼쪽 버튼
document.addEventListener("mousedown", (e) => {
  if (gameStarted && e.button === 0) {
    playerAttack();
  }
});

function playerAttack() {
  if (player.weapon.type === "melee") {
    performMeleeAttack();
  } else if (player.weapon.type === "ranged") {
    performRangedAttack();
  }
}

function performMeleeAttack() {
  // 무기의 attack() 메서드를 호출해 공격 hitbox를 생성 (절대 좌표 기준)
  const hitbox = player.weapon.attack(player.x, player.y, player.facingRight);
  
  // 최종 데미지는 플레이어 공격력 + 무기 고유 데미지
  const totalDamage = player.attack + hitbox.damage;
  hitbox.damage = totalDamage;
  console.log(`근접 공격! 총 데미지: ${totalDamage}`);

  // 적과의 충돌 판정 (간단한 AABB 충돌 체크)
  enemies.forEach((enemy) => {
    if (
      enemy.alive &&
      hitbox.x < enemy.x + enemy.width &&
      hitbox.x + hitbox.width > enemy.x &&
      hitbox.y < enemy.y + enemy.height &&
      hitbox.y + hitbox.height > enemy.y
    ) {
      enemy.takeDamage(totalDamage);
      console.log(`${enemy.name}에게 ${totalDamage}의 피해! 남은 HP: ${enemy.hp}`);
    }
  });
  
  // 절대 좌표 hitbox를 플레이어 기준 상대 오프셋으로 저장
  currentHitbox = {
    offsetX: hitbox.x - player.x,
    offsetY: hitbox.y - player.y,
    width: hitbox.width,
    height: hitbox.height,
    damage: hitbox.damage
  };
  hitboxTimer = 10; // 10프레임 동안 히트박스 시각화
}

function performRangedAttack() {
  console.log("원거리 공격! (미구현)");
}

// 플레이어 이동 및 중력 처리 (동시 입력 오류 수정 포함)
function updatePlayer() {
  // 동시에 A와 D가 눌렸다면 이동하지 않음
  if (keys["a"] && keys["d"]) {
    player.dx = 0;
    player.moving = false;
  } else if (keys["a"]) {
    player.dx = -player.speed;
    player.facingRight = false;
    player.moving = true;
  } else if (keys["d"]) {
    player.dx = player.speed;
    player.facingRight = true;
    player.moving = true;
  } else {
    player.dx = 0;
    player.moving = false;
  }

  if ((keys["w"] || keys["W"]) && player.onGround) {
    player.dy = -15;
    player.onGround = false;
  }

  player.dy += gravity;
  player.x += player.dx;
  player.y += player.dy;

  if (player.y + player.height >= canvas.height - groundHeight) {
    player.y = canvas.height - groundHeight - player.height;
    player.dy = 0;
    player.onGround = true;
  }

  if (player.moving) {
    player.frameCounter++;
    if (player.frameCounter >= player.animationSpeed) {
      player.currentFrame++;
      if (player.currentFrame > 4) {
        player.currentFrame = 1;
      }
      player.frameCounter = 0;
    }
  } else {
    player.currentFrame = 0;
  }
}

// 시작 화면 그리기 (깜빡이는 텍스트)
function drawStartScreen() {
  ctx.drawImage(startBackground, 0, 0, canvas.width, canvas.height);
  if (pressEnterVisible) {
    ctx.fillStyle = "white";
    ctx.font = "40px 'Press Start 2P', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Press Enter To START", canvas.width / 2, canvas.height - 50);
  }
  blinkTimer++;
  if (blinkTimer > blinkInterval) {
    pressEnterVisible = !pressEnterVisible;
    blinkTimer = 0;
  }
}

// 무기 리스트 UI 틀 이미지 (weapon_list.png)
const weaponListImage = new Image();
weaponListImage.src = "res/img/weapon_list.png";

// 무기 아이콘은 player.weapon.icon을 사용
function drawWeaponUI() {
  // UI 틀 그리기 (weapon_list.png는 전체 슬롯 UI 배경)
  const uiX = canvas.width - 170;
  const uiY = 10;
  if (weaponListImage.complete) {
    ctx.drawImage(weaponListImage, uiX, uiY, 160, 40);
  }
  // 현재 무기 아이콘 그리기
  const iconImg = new Image();
  iconImg.src = player.weapon.icon;
  if (iconImg.complete) {
    // 슬롯당 40x40, 내부 아이콘은 36x36 (테두리 2px)
    const slotX = uiX + 2; // 첫 번째 슬롯 기준
    const slotY = uiY + 2;
    ctx.drawImage(iconImg, slotX, slotY, 36, 36);
  }
}


// 플레이어 그리기
function drawPlayer() {
  ctx.save();
  if (!player.facingRight) {
    ctx.scale(-1, 1);
    ctx.drawImage(
      playerSprite,
      player.currentFrame * player.width,
      0,
      player.width,
      player.height,
      -player.x - player.width,
      player.y,
      player.width,
      player.height
    );
  } else {
    ctx.drawImage(
      playerSprite,
      player.currentFrame * player.width,
      0,
      player.width,
      player.height,
      player.x,
      player.y,
      player.width,
      player.height
    );
  }
  ctx.restore();
}

// 적 그리기
function drawEnemies() {
  enemies.forEach(enemy => {
    enemy.draw(ctx);
  });
}

// 히트박스 그리기 (디버깅용)
function drawHitbox() {
  if (currentHitbox && hitboxTimer > 0) {
    // 플레이어의 현재 위치에 상대적 오프셋을 적용해 hitbox 좌표 재계산
    const boxX = player.x + currentHitbox.offsetX;
    const boxY = player.y + currentHitbox.offsetY;
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, currentHitbox.width, currentHitbox.height);
    ctx.restore();
    hitboxTimer--;
    if (hitboxTimer === 0) currentHitbox = null;
  }
}

// 전체 화면 그리기
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!gameStarted) {
    drawStartScreen();
    if (currentHitbox) drawHitbox();
    return;
  }
  // 게임 플레이 배경: 하늘과 땅
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#228B22";
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
  drawPlayer();
  drawEnemies();
  drawHitbox();
  updateStats();
  drawWeaponUI()
}

// 메인 게임 루프
function gameLoop() {
  updatePlayer();
  drawScene();
  requestAnimationFrame(gameLoop);
}

// 게임 시작: Enter 키를 누르면 시작
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !gameStarted) {
    gameStarted = true;
  }
});

gameLoop();
