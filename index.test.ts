beforeEach(() => {
    jest.resetModules()
});

describe('createObject', () => {
    test('creates a BoxGeometry + MeshBasicMaterial object', () => {
        const lib = require('./index');

        const result = lib.createObject(
            "BoxGeometry",
            "[]",
            "MeshBasicMaterial",
            '[{"color": 16777215}]',
        );
        expect(result).toBe(0);
    });

    test('creates a SphereGeometry + MeshBasicMaterial object', () => {
        const lib = require('./index');

        const result = lib.createObject(
            "SphereGeometry",
            "[1, 32, 32]",
            "MeshBasicMaterial",
            '[{"color": 16777215}]',
        );
        expect(result).toBe(0);
    });

    test('creates a PlaneGeometry + MeshBasicMaterial object', () => {
        const lib = require('./index');

        const result = lib.createObject(
            "PlaneGeometry",
            "[5, 5]",
            "MeshBasicMaterial",
            '[{"color": 16777215}]',
        );
        expect(result).toBe(0);
    });

    test('creates a CylinderGeometry + MeshBasicMaterial object', () => {
        const lib = require('./index');

        const result = lib.createObject(
            "CylinderGeometry",
            "[1, 1, 2, 32]",
            "MeshBasicMaterial",
            '[{"color": 16777215}]',
        );
        expect(result).toBe(0);
    });

    test('increases the object count', () => {
        const lib = require('./index');
        lib.createObject(
            "BoxGeometry",
            "[]",
            "MeshBasicMaterial",
            '[{"color": 16777215}]',
        );
        expect(lib.__nextObjId).toBe(1);
    })
});

describe('loadTexture', () => {
    test('return 0 if texture is not present', () => {
        const lib = require('./index');
        const textureUrl = 'https://example.com/texture.jpg';
        expect(lib.loadTexture(textureUrl)).toBe(0);
    });

    test('returns -1 if texture is already loaded', () => {
        const lib = require('./index');
        lib.__TEXTURES.set('https://example.com/texture.jpg', null as any);
        expect(lib.loadTexture('https://example.com/texture.jpg')).toBe(-1);
    });
})

describe('object count', () => {
    test('initial count is 0', () => {
        const lib = require('./index');
        expect(lib.__nextObjId).toBe(0);
    });
})

describe('createSprite', () => {
    test('Returns -1 if texture is not loaded', () => {
        const lib = require('./index');
        const result = lib.createSprite('https://example.com/texture.jpg', '[{"color": 16777215}]');
        expect(result).toBe(-1);
    });

    test('Returns object id if texture is loaded', () => {
        const THREE = require('three');
        const lib = require('./index');
        lib.__nextObjId = 123;
        lib.__TEXTURES.set('https://example.com/texture.jpg', new THREE.Texture());
        const result = lib.createSprite('https://example.com/texture.jpg', 1, 1);
        expect(result).toBe(123);
    });

    test('Sets user data on the sprite', () => { 
        const THREE = require('three');
        const lib = require('./index');
        lib.__nextObjId = 123;
        lib.__TEXTURES.set('https://example.com/texture.jpg', new THREE.Texture());
        const objectId = lib.createSprite('https://example.com/texture.jpg', 2, 3);
        console.log(lib.__OBJECTS.get(objectId));
        expect(lib.__OBJECTS.get(objectId).userData.rows).toBe(3);
        expect(lib.__OBJECTS.get(objectId).userData.columns).toBe(2);
    });
})

import * as THREE from 'three';

THREE.Texture

const createSpriteFixture = () => {
    const lib = require('./index');
    const THREE = require('three');
    const texture = new THREE.Texture();
    texture.width = 100;
    texture.height = 200;

    lib.__TEXTURES.set('https://example.com/texture.jpg', texture);
    const spriteObjectId = lib.createSprite('https://example.com/texture.jpg', 2, 4);

    return {
        lib,
        texture,
        spriteObjectId,
        THREE
    };
}

describe('setSpriteAnimationOffset', () => {
    test('Sets sprite animation offset', () => {
        const { lib, spriteObjectId, THREE } = createSpriteFixture();

        lib.setSpriteAnimationOffset(spriteObjectId, 0, 0);

        const object = lib.__OBJECTS.get(spriteObjectId);
        const texture = object.material.map;
        expect(texture.offset.x).toBe(0);
        expect(texture.offset.y).toBe(1);
    });

    test('Sets sprite animation offset for a specific frame', () => {
        const { lib, spriteObjectId, THREE } = createSpriteFixture();

        lib.setSpriteAnimationOffset(spriteObjectId, 1, 2);

        const object = lib.__OBJECTS.get(spriteObjectId);
        const texture = object.material.map;
        expect(texture.offset.x).toBe(50);
        expect(texture.offset.y).toBe(100);
    });
});

describe('setPosition', () => {
    test('Sets position of an object', () => {
        const lib = require('./index');
        const objectId = lib.createObject(
            "BoxGeometry",
            "[]",
            "MeshBasicMaterial",
            '[{"color": 16777215}]',
        );
        lib.setPosition(objectId, 1, 2, 3);
        const object = lib.__OBJECTS.get(objectId);
        expect(object.position.x).toBe(1);
        expect(object.position.y).toBe(2);
        expect(object.position.z).toBe(3);
    });
});