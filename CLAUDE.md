# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains browser-based projects in separate module directories. The main project is a Korean-language action game called "슬라임의 역습" (Slime Rising) where the player controls a slime that absorbs heroes to gain their abilities.

## Running Projects

Open `index.html` directly in a browser, or use a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Windows direct open
start module_02\index.html
```

## Module Structure

- `module_01/` - Empty module (placeholder)
- `module_02/` - Slime Rising game

## module_02: Slime Rising Architecture

### Game Loop (`script.js`)

The game uses `requestAnimationFrame` with delta time for smooth animation:
- `game` object: Global state (wave, kills, timers, projectiles)
- `slime` object: Player state (position, HP, level, exp, abilities)
- `heroes` array: Active enemy instances
- `heroTypes` object: Hero class definitions (warrior, mage, priest, archer, thief)

### Core Systems

**Input**: Arrow keys or WASD tracked via `keys` object, processed in `moveSlime()`

**Spawning**: Heroes spawn from screen edges every `game.spawnInterval` ms, types unlocked progressively by wave

**Combat**:
- Melee heroes (warrior, thief) deal direct damage at close range
- Ranged heroes (mage, archer) create projectiles tracked in `game.projectiles`
- Priest heals nearby heroes instead of attacking

**Absorption**: When slime collides with hero (`dist < 40`), hero is absorbed via `absorbHero()`:
- Grants EXP (doubled on crit if archer ability obtained)
- First absorption of each hero type grants permanent ability via `gainAbility()`

**Progression**:
- Level up increases HP, attack, defense
- Waves increase hero stats and spawn rate
- Victory: absorb all 5 hero types

### Visual Structure (`style.css`)

Characters built with CSS-styled divs, no images:
- Slime: `.slime-body` with gradient and shadow, eyes with pupils
- Heroes: `.hero-head`, `.hero-torso`, `.hero-weapon` emoji, `.hero-hp` bar
- Each hero type has unique color scheme (warrior=red, mage=purple, priest=yellow, archer=green, thief=gray)

Key animations: `slimeBounce`, `heroWalk`, `absorb`, `damageFloat`, `levelUpGlow`

### UI Elements (`index.html`)

Four game screens toggled via `.hidden` class:
- `#title-screen`: Start button and controls info
- `#game-screen`: HUD (stats, abilities) + arena + popups
- `#game-over`: Final stats display
- `#victory`: Win screen when all abilities collected

## Korean Language

All UI text is in Korean. Maintain Korean language when modifying text unless requested otherwise.
