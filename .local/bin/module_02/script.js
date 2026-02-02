// Game State
const game = {
    isRunning: false,
    isPaused: false,
    wave: 1,
    kills: 0,
    lastTime: 0,
    spawnTimer: 0,
    spawnInterval: 2000,
    waveTimer: 0,
    waveDuration: 30000,
    projectiles: [],
    damageNumbers: []
};

// Slime State
const slime = {
    x: 400,
    y: 300,
    width: 60,
    height: 50,
    speed: 5,
    hp: 100,
    maxHp: 100,
    level: 1,
    exp: 0,
    expToLevel: 50,
    abilities: [],
    element: null,
    // Ability bonuses
    attackPower: 0,
    defense: 0,
    healRate: 0,
    speedBonus: 0,
    critChance: 0
};

// Hero Types
const heroTypes = {
    warrior: {
        name: '전사',
        emoji: '⚔️',
        hp: 80,
        speed: 1.5,
        damage: 15,
        attackRange: 50,
        attackSpeed: 1500,
        exp: 15,
        ability: {
            name: '전사의 힘',
            desc: '공격력 +5, 방어력 +2',
            effect: () => { slime.attackPower += 5; slime.defense += 2; }
        }
    },
    mage: {
        name: '마법사',
        emoji: '🔮',
        hp: 50,
        speed: 1.2,
        damage: 25,
        attackRange: 200,
        attackSpeed: 2000,
        exp: 20,
        ability: {
            name: '마법사의 지혜',
            desc: '원거리 반격 가능, 공격력 +3',
            effect: () => { slime.attackPower += 3; }
        }
    },
    priest: {
        name: '성직자',
        emoji: '✝️',
        hp: 60,
        speed: 1.0,
        damage: 10,
        attackRange: 150,
        attackSpeed: 2500,
        exp: 25,
        healAmount: 20,
        ability: {
            name: '성직자의 축복',
            desc: '초당 HP 2 회복',
            effect: () => { slime.healRate += 2; }
        }
    },
    archer: {
        name: '궁수',
        emoji: '🏹',
        hp: 45,
        speed: 1.8,
        damage: 18,
        attackRange: 250,
        attackSpeed: 1200,
        exp: 18,
        ability: {
            name: '궁수의 민첩',
            desc: '이동 속도 +1, 크리티컬 +10%',
            effect: () => { slime.speedBonus += 1; slime.critChance += 0.1; }
        }
    },
    thief: {
        name: '도적',
        emoji: '🗡️',
        hp: 40,
        speed: 2.5,
        damage: 20,
        attackRange: 40,
        attackSpeed: 800,
        exp: 22,
        ability: {
            name: '도적의 그림자',
            desc: '이동 속도 +2, 회피 확률 +15%',
            effect: () => { slime.speedBonus += 2; }
        }
    }
};

// Active heroes
let heroes = [];

// Input state
const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// DOM Elements
let arena, slimeEl, hpBar, hpText, expBar, expText, levelEl, killsEl, abilityList;
let waveIndicator, waveNumber, abilityPopup, abilityName, abilityDesc;

// Initialize game
function init() {
    // Get DOM elements
    arena = document.getElementById('arena');
    slimeEl = document.getElementById('slime');
    hpBar = document.getElementById('hp-bar');
    hpText = document.getElementById('hp-text');
    expBar = document.getElementById('exp-bar');
    expText = document.getElementById('exp-text');
    levelEl = document.getElementById('level');
    killsEl = document.getElementById('kills');
    abilityList = document.getElementById('ability-list');
    waveIndicator = document.getElementById('wave-indicator');
    waveNumber = document.getElementById('wave-number');
    abilityPopup = document.getElementById('ability-popup');
    abilityName = document.getElementById('ability-name');
    abilityDesc = document.getElementById('ability-desc');

    // Event listeners
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('victory-restart-btn').addEventListener('click', restartGame);

    // Keyboard input
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(e) {
    switch(e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
            keys.up = true;
            break;
        case 'arrowdown':
        case 's':
            keys.down = true;
            break;
        case 'arrowleft':
        case 'a':
            keys.left = true;
            break;
        case 'arrowright':
        case 'd':
            keys.right = true;
            break;
    }
}

function handleKeyUp(e) {
    switch(e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
            keys.up = false;
            break;
        case 'arrowdown':
        case 's':
            keys.down = false;
            break;
        case 'arrowleft':
        case 'a':
            keys.left = false;
            break;
        case 'arrowright':
        case 'd':
            keys.right = false;
            break;
    }
}

function startGame() {
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    resetGame();
    game.isRunning = true;
    game.lastTime = performance.now();

    showWaveIndicator();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    // Reset slime
    slime.x = arena.clientWidth / 2 - slime.width / 2;
    slime.y = arena.clientHeight / 2 - slime.height / 2;
    slime.hp = 100;
    slime.maxHp = 100;
    slime.level = 1;
    slime.exp = 0;
    slime.expToLevel = 50;
    slime.abilities = [];
    slime.attackPower = 0;
    slime.defense = 0;
    slime.healRate = 0;
    slime.speedBonus = 0;
    slime.critChance = 0;

    // Reset game state
    game.wave = 1;
    game.kills = 0;
    game.spawnTimer = 0;
    game.waveTimer = 0;
    game.projectiles = [];
    game.damageNumbers = [];
    heroes = [];

    // Clear arena
    arena.querySelectorAll('.hero, .projectile, .damage-number').forEach(el => el.remove());
    abilityList.innerHTML = '';

    updateUI();
    updateSlimePosition();
}

function restartGame() {
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('victory').classList.add('hidden');
    startGame();
}

function showWaveIndicator() {
    waveNumber.textContent = game.wave;
    waveIndicator.classList.remove('hidden');
    setTimeout(() => {
        waveIndicator.classList.add('hidden');
    }, 2000);
}

function gameLoop(currentTime) {
    if (!game.isRunning) return;

    const deltaTime = currentTime - game.lastTime;
    game.lastTime = currentTime;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Move slime
    moveSlime(deltaTime);

    // Spawn heroes
    game.spawnTimer += deltaTime;
    if (game.spawnTimer >= game.spawnInterval) {
        spawnHero();
        game.spawnTimer = 0;
    }

    // Update wave timer
    game.waveTimer += deltaTime;
    if (game.waveTimer >= game.waveDuration) {
        nextWave();
    }

    // Update heroes
    updateHeroes(deltaTime);

    // Update projectiles
    updateProjectiles(deltaTime);

    // Check collisions (absorption)
    checkCollisions();

    // Heal slime if has priest ability
    if (slime.healRate > 0) {
        slime.hp = Math.min(slime.maxHp, slime.hp + slime.healRate * deltaTime / 1000);
    }

    // Check game over
    if (slime.hp <= 0) {
        gameOver();
    }

    // Check victory
    if (slime.abilities.length >= 5) {
        victory();
    }

    updateUI();
}

function moveSlime(deltaTime) {
    const speed = (slime.speed + slime.speedBonus) * deltaTime / 16;

    if (keys.up) slime.y -= speed;
    if (keys.down) slime.y += speed;
    if (keys.left) slime.x -= speed;
    if (keys.right) slime.x += speed;

    // Boundary check
    slime.x = Math.max(0, Math.min(arena.clientWidth - slime.width, slime.x));
    slime.y = Math.max(0, Math.min(arena.clientHeight - slime.height, slime.y));

    updateSlimePosition();
}

function updateSlimePosition() {
    slimeEl.style.left = slime.x + 'px';
    slimeEl.style.top = slime.y + 'px';
}

function spawnHero() {
    const types = Object.keys(heroTypes);
    // Weighted spawn based on wave
    let availableTypes = types.slice(0, Math.min(2 + Math.floor(game.wave / 2), types.length));
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const heroData = heroTypes[type];

    // Spawn from edges
    let x, y;
    const side = Math.floor(Math.random() * 4);
    switch(side) {
        case 0: // Top
            x = Math.random() * (arena.clientWidth - 50);
            y = -60;
            break;
        case 1: // Right
            x = arena.clientWidth;
            y = Math.random() * (arena.clientHeight - 60);
            break;
        case 2: // Bottom
            x = Math.random() * (arena.clientWidth - 50);
            y = arena.clientHeight;
            break;
        case 3: // Left
            x = -50;
            y = Math.random() * (arena.clientHeight - 60);
            break;
    }

    const hero = {
        type: type,
        x: x,
        y: y,
        hp: heroData.hp * (1 + game.wave * 0.1),
        maxHp: heroData.hp * (1 + game.wave * 0.1),
        speed: heroData.speed,
        damage: heroData.damage * (1 + game.wave * 0.05),
        attackRange: heroData.attackRange,
        attackSpeed: heroData.attackSpeed,
        attackTimer: 0,
        exp: heroData.exp,
        element: null
    };

    // Create DOM element
    const heroEl = document.createElement('div');
    heroEl.className = `hero ${type}`;
    heroEl.innerHTML = `
        <div class="hero-body">
            <div class="hero-head"></div>
            <div class="hero-torso"></div>
            <span class="hero-weapon">${heroData.emoji}</span>
        </div>
        <div class="hero-hp">
            <div class="hero-hp-fill" style="width: 100%"></div>
        </div>
    `;
    arena.appendChild(heroEl);
    hero.element = heroEl;

    heroes.push(hero);
}

function updateHeroes(deltaTime) {
    heroes.forEach(hero => {
        if (hero.hp <= 0) return;

        // Move towards slime
        const dx = (slime.x + slime.width / 2) - (hero.x + 25);
        const dy = (slime.y + slime.height / 2) - (hero.y + 30);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > hero.attackRange) {
            // Move towards slime
            hero.x += (dx / dist) * hero.speed * deltaTime / 16;
            hero.y += (dy / dist) * hero.speed * deltaTime / 16;
        } else {
            // Attack
            hero.attackTimer += deltaTime;
            if (hero.attackTimer >= hero.attackSpeed) {
                heroAttack(hero);
                hero.attackTimer = 0;
            }
        }

        // Update position
        hero.element.style.left = hero.x + 'px';
        hero.element.style.top = hero.y + 'px';
    });
}

function heroAttack(hero) {
    const heroData = heroTypes[hero.type];

    if (hero.type === 'priest') {
        // Priest heals other heroes
        healNearbyHeroes(hero);
    } else if (hero.type === 'mage' || hero.type === 'archer') {
        // Ranged attack
        createProjectile(hero);
    } else {
        // Melee attack - direct damage
        const damage = Math.max(1, hero.damage - slime.defense);
        slime.hp -= damage;
        showDamageNumber(slime.x + slime.width / 2, slime.y, damage);

        // Slime counter attack
        if (slime.attackPower > 0) {
            const counterDamage = slime.attackPower;
            hero.hp -= counterDamage;
            showDamageNumber(hero.x + 25, hero.y, counterDamage);
            updateHeroHP(hero);
        }
    }
}

function healNearbyHeroes(priest) {
    heroes.forEach(hero => {
        if (hero === priest || hero.hp <= 0) return;
        const dx = hero.x - priest.x;
        const dy = hero.y - priest.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
            hero.hp = Math.min(hero.maxHp, hero.hp + heroTypes.priest.healAmount);
            updateHeroHP(hero);
            showDamageNumber(hero.x + 25, hero.y, heroTypes.priest.healAmount, true);
        }
    });
}

function createProjectile(hero) {
    const dx = (slime.x + slime.width / 2) - (hero.x + 25);
    const dy = (slime.y + slime.height / 2) - (hero.y + 30);
    const dist = Math.sqrt(dx * dx + dy * dy);

    const projectile = {
        x: hero.x + 25,
        y: hero.y + 30,
        vx: (dx / dist) * 5,
        vy: (dy / dist) * 5,
        damage: hero.damage,
        type: hero.type === 'mage' ? 'fireball' : 'arrow',
        element: null
    };

    const projEl = document.createElement('div');
    projEl.className = `projectile ${projectile.type}`;
    arena.appendChild(projEl);
    projectile.element = projEl;

    game.projectiles.push(projectile);
}

function updateProjectiles(deltaTime) {
    game.projectiles = game.projectiles.filter(proj => {
        proj.x += proj.vx * deltaTime / 16;
        proj.y += proj.vy * deltaTime / 16;

        // Check if hit slime
        if (checkProjectileHit(proj)) {
            const damage = Math.max(1, proj.damage - slime.defense);
            slime.hp -= damage;
            showDamageNumber(slime.x + slime.width / 2, slime.y, damage);
            proj.element.remove();
            return false;
        }

        // Check if out of bounds
        if (proj.x < -20 || proj.x > arena.clientWidth + 20 ||
            proj.y < -20 || proj.y > arena.clientHeight + 20) {
            proj.element.remove();
            return false;
        }

        proj.element.style.left = proj.x + 'px';
        proj.element.style.top = proj.y + 'px';
        return true;
    });
}

function checkProjectileHit(proj) {
    return proj.x > slime.x && proj.x < slime.x + slime.width &&
           proj.y > slime.y && proj.y < slime.y + slime.height;
}

function checkCollisions() {
    heroes.forEach(hero => {
        if (hero.hp <= 0) return;

        const dx = (slime.x + slime.width / 2) - (hero.x + 25);
        const dy = (slime.y + slime.height / 2) - (hero.y + 30);
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Absorption range
        if (dist < 40) {
            absorbHero(hero);
        }
    });

    // Remove dead heroes
    heroes = heroes.filter(hero => {
        if (hero.hp <= 0) {
            hero.element.classList.add('absorbed');
            setTimeout(() => hero.element.remove(), 500);
            return false;
        }
        return true;
    });
}

function absorbHero(hero) {
    hero.hp = 0;
    game.kills++;

    // Add experience
    const isCrit = Math.random() < slime.critChance;
    const expGain = hero.exp * (isCrit ? 2 : 1);
    slime.exp += expGain;

    // Show absorb animation
    slimeEl.classList.add('absorbing');
    setTimeout(() => slimeEl.classList.remove('absorbing'), 300);

    // Check level up
    while (slime.exp >= slime.expToLevel) {
        levelUp();
    }

    // Check for new ability
    const heroData = heroTypes[hero.type];
    if (!slime.abilities.includes(hero.type)) {
        gainAbility(hero.type, heroData);
    }
}

function gainAbility(type, heroData) {
    slime.abilities.push(type);
    heroData.ability.effect();

    // Show ability popup
    abilityName.textContent = heroData.ability.name;
    abilityDesc.textContent = heroData.ability.desc;
    abilityPopup.classList.remove('hidden');

    setTimeout(() => {
        abilityPopup.classList.add('hidden');
    }, 2000);

    // Add ability icon to HUD
    const icon = document.createElement('div');
    icon.className = `ability-icon ${type}`;
    icon.textContent = heroData.emoji;
    icon.title = heroData.ability.name;
    abilityList.appendChild(icon);
}

function levelUp() {
    slime.exp -= slime.expToLevel;
    slime.level++;
    slime.expToLevel = Math.floor(slime.expToLevel * 1.3);
    slime.maxHp += 20;
    slime.hp = slime.maxHp;
    slime.attackPower += 2;
    slime.defense += 1;

    // Show level up effect
    slimeEl.classList.add('level-up');
    setTimeout(() => slimeEl.classList.remove('level-up'), 500);
}

function updateHeroHP(hero) {
    const hpFill = hero.element.querySelector('.hero-hp-fill');
    hpFill.style.width = (hero.hp / hero.maxHp * 100) + '%';
}

function showDamageNumber(x, y, amount, isHeal = false) {
    const dmgEl = document.createElement('div');
    dmgEl.className = 'damage-number' + (isHeal ? ' heal' : '');
    dmgEl.textContent = (isHeal ? '+' : '-') + Math.floor(amount);
    dmgEl.style.left = x + 'px';
    dmgEl.style.top = y + 'px';
    arena.appendChild(dmgEl);

    setTimeout(() => dmgEl.remove(), 1000);
}

function nextWave() {
    game.wave++;
    game.waveTimer = 0;
    game.spawnInterval = Math.max(500, game.spawnInterval - 100);
    showWaveIndicator();
}

function updateUI() {
    hpBar.style.width = (slime.hp / slime.maxHp * 100) + '%';
    hpText.textContent = `${Math.floor(slime.hp)}/${slime.maxHp}`;
    expBar.style.width = (slime.exp / slime.expToLevel * 100) + '%';
    expText.textContent = `${Math.floor(slime.exp)}/${slime.expToLevel}`;
    levelEl.textContent = slime.level;
    killsEl.textContent = game.kills;
}

function render() {
    // Main rendering is done through DOM updates
}

function gameOver() {
    game.isRunning = false;
    document.getElementById('final-level').textContent = slime.level;
    document.getElementById('final-kills').textContent = game.kills;
    document.getElementById('final-abilities').textContent = slime.abilities.length;
    document.getElementById('game-over').classList.remove('hidden');
}

function victory() {
    game.isRunning = false;
    document.getElementById('victory-level').textContent = slime.level;
    document.getElementById('victory-kills').textContent = game.kills;
    document.getElementById('victory').classList.remove('hidden');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
