/**
 * Tests for game entity classes
 * Enemy, Projectile, Particle, EnemyProjectile, GamerProjectile
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { readFile } from './test-helpers.js';

// ==================== CLASS TESTS ====================
describe('Enemy Class', () => {
    test('Enemy class file exists and has correct structure', () => {
        const enemyContent = readFile('js/classes/Enemy.js');

        assert.ok(enemyContent.includes('export class Enemy'), 'Should export Enemy class');
        assert.ok(enemyContent.includes('constructor('), 'Should have constructor');
        assert.ok(enemyContent.includes('update()'), 'Should have update method');
        assert.ok(enemyContent.includes('draw('), 'Should have draw method');
        assert.ok(enemyContent.includes('takeDamage('), 'Should have takeDamage method');
        assert.ok(enemyContent.includes('die()'), 'Should have die method');
        assert.ok(enemyContent.includes('attack()'), 'Should have attack method');
    });

    test('Enemy class handles special enemy types', () => {
        const enemyContent = readFile('js/classes/Enemy.js');

        assert.ok(enemyContent.includes('isGamer'), 'Should handle Gamer Dino');
        assert.ok(enemyContent.includes('isSigma'), 'Should handle Sigma Dino');
        assert.ok(enemyContent.includes('isBoss'), 'Should handle Boss');
    });

    test('Enemy class has callback system', () => {
        const enemyContent = readFile('js/classes/Enemy.js');

        assert.ok(enemyContent.includes('this.callbacks'), 'Should store callbacks');
        assert.ok(enemyContent.includes('callbacks.playSound'), 'Should call playSound');
        assert.ok(enemyContent.includes('callbacks.updateHUD'), 'Should call updateHUD');
    });
});

describe('Projectile Class', () => {
    test('Projectile class file exists and has correct structure', () => {
        const projectileContent = readFile('js/classes/Projectile.js');

        assert.ok(projectileContent.includes('export class Projectile'), 'Should export Projectile class');
        assert.ok(projectileContent.includes('constructor('), 'Should have constructor');
        assert.ok(projectileContent.includes('update()'), 'Should have update method');
        assert.ok(projectileContent.includes('draw('), 'Should have draw method');
        assert.ok(projectileContent.includes('isExpired()'), 'Should have isExpired method');
    });

    test('Projectile handles special weapons', () => {
        const projectileContent = readFile('js/classes/Projectile.js');

        assert.ok(projectileContent.includes('moai'), 'Should handle moai special');
        assert.ok(projectileContent.includes('doot'), 'Should handle doot special');
        assert.ok(projectileContent.includes('showYoAngelo'), 'Should have Yo Angelo effect');
        assert.ok(projectileContent.includes('showSkeletonEffect'), 'Should have skeleton effect');
    });
});

describe('Particle Class', () => {
    test('Particle class file exists and has correct structure', () => {
        const particleContent = readFile('js/classes/Particle.js');

        assert.ok(particleContent.includes('export class Particle'), 'Should export Particle class');
        assert.ok(particleContent.includes('constructor('), 'Should have constructor');
        assert.ok(particleContent.includes('update()'), 'Should have update method');
        assert.ok(particleContent.includes('draw('), 'Should have draw method');
        assert.ok(particleContent.includes('isExpired()'), 'Should have isExpired method');
    });

    test('Particle has physics properties', () => {
        const particleContent = readFile('js/classes/Particle.js');

        assert.ok(particleContent.includes('this.vx'), 'Should have velocity x');
        assert.ok(particleContent.includes('this.vy'), 'Should have velocity y');
        assert.ok(particleContent.includes('this.vz'), 'Should have velocity z');
        assert.ok(particleContent.includes('this.life'), 'Should have life');
    });
});

describe('EnemyProjectile Class', () => {
    test('EnemyProjectile class file exists', () => {
        const content = readFile('js/classes/EnemyProjectile.js');

        assert.ok(content.includes('export class EnemyProjectile'), 'Should export EnemyProjectile class');
        assert.ok(content.includes('update()'), 'Should have update method');
        assert.ok(content.includes('draw('), 'Should have draw method');
    });
});

describe('GamerProjectile Class', () => {
    test('GamerProjectile class file exists', () => {
        const content = readFile('js/classes/GamerProjectile.js');

        assert.ok(content.includes('export class GamerProjectile'), 'Should export GamerProjectile class');
        assert.ok(content.includes('spin'), 'Should have spin for RGB color cycling');
        assert.ok(content.includes('RGB color cycling'), 'Should have RGB color cycling comment');
    });
});
