import * as THREE from 'three';
import { createContext, GeometryClass, MaterialClass } from './index';

import { test, describe, expect } from 'vitest';

function mockTextureLoader(lib: any) {
    // mock texture loader so that it returns a dummy texture
    // @ts-ignore
    lib.textureLoader.loadAsync = function (path: string) {
        return new class extends THREE.Texture {
            constructor() {
                super();
                this.image = new Image();
                this.image.src = path;
                this.needsUpdate = true;
                this.userData = {};
                this.offset = new THREE.Vector2(0, 0);
            }

            get height() {
                return 200;
            }
            get width() {
                return 200;
            }
        }
    }
}

describe('createObject', () => {
    test('creates a BoxGeometry + MeshBasicMaterial object', () => {
        const lib = createContext();
        const result = lib.createObject(
            GeometryClass.BoxGeometry,
            MaterialClass.MeshBasicMaterial,
        );

        expect(result).toBe(0);
    });

    test('creates a SphereGeometry + MeshBasicMaterial object', () => {
        const lib = createContext();
        const result = lib.createObject(
            GeometryClass.SphereGeometry,
            MaterialClass.MeshBasicMaterial,
        );
        expect(result).toBe(0);
    });

    test('creates a PlaneGeometry + MeshBasicMaterial object', () => {
        const lib = createContext();
        const result = lib.createObject(
            GeometryClass.PlaneGeometry,
            MaterialClass.MeshBasicMaterial,
        );
        expect(result).toBe(0);
    });

    test('creates a CylinderGeometry + MeshBasicMaterial object', () => {
        const lib = createContext();

        const result = lib.createObject(
            GeometryClass.CylinderGeometry,
            MaterialClass.MeshBasicMaterial,
        );
        expect(result).toBe(0);
    });

    test('Increases the object count', () => {
        const lib = createContext();
        const obj1 = lib.createObject(
            GeometryClass.BoxGeometry,
            MaterialClass.MeshBasicMaterial,
        );
        const obj2 = lib.createObject(
            GeometryClass.SphereGeometry,
            MaterialClass.MeshBasicMaterial,
        );

        expect(obj1).toBe(obj2 - 1);
    })
});

const DEFAULT_TEXTURE = `http://localhost:8000/test_images/image.png`;
const DEFAULT_TEXTURE_ID = 123;
const addTextureFixture = async (rows: number | undefined = undefined, cols: number | undefined = undefined) => {
    const lib = createContext();
    mockTextureLoader(lib);
    const textureId = await lib.addTexture(DEFAULT_TEXTURE_ID, DEFAULT_TEXTURE, rows, cols);
    return { lib, textureId }
}

describe('addTexture', () => {
    test('Return texture id if texture is not present', async () => {
        const lib = createContext();
        mockTextureLoader(lib);
        expect(await lib.addTexture(128, DEFAULT_TEXTURE)).toBe(128);
    });

    test('Returns -1 if texture is already loaded', async () => {
        const lib = createContext();
        mockTextureLoader(lib);
        await lib.addTexture(128, DEFAULT_TEXTURE);
        expect(await lib.addTexture(321, DEFAULT_TEXTURE)).toBe(-1);
    });

    test('Returns -1 if texture id is taken', async () => {
        const lib = createContext();
        mockTextureLoader(lib);
        await lib.addTexture(321, DEFAULT_TEXTURE);
        expect(await lib.addTexture(321, DEFAULT_TEXTURE)).toBe(-1);
    });

    test('Doesn\'t assign rows/cols if not provided', async () => {
        const { lib, textureId } = await addTextureFixture();
        expect(lib.__TEXTURES.get(textureId)).toBeTruthy();
        expect(lib.__TEXTURES.get(textureId)!.userData.rows)
            .toBe(undefined)
        expect(lib.__TEXTURES.get(textureId)!.userData.columns)
            .toBe(undefined)
    });

    test("Assigns rows/cols if provided", async () => {
        const { lib, textureId } = await addTextureFixture(5, 7);
        expect(lib.__TEXTURES.get(textureId)!.userData.rows)
            .toBe(5)
        expect(lib.__TEXTURES.get(textureId)!.userData.columns)
            .toBe(7)
    });
})

const createSpriteFixture = async (rows: any, cols: any) => {
    const { lib, textureId } = await addTextureFixture(rows, cols)
    const spriteObjectId = lib.createSprite(textureId);
    expect(spriteObjectId).toBeGreaterThanOrEqual(0);
    return {
        lib,
        spriteObjectId,
    };
}


describe('createSprite', () => {
    test('Returns -1 if texture is not loaded', () => {
        const lib = createContext();
        const result = lib.createSprite(DEFAULT_TEXTURE_ID);
        expect(result).toBe(-1);
    });

    test('Returns object id if texture is loaded', async () => {
        // Arrange
        const lib = createContext();
        mockTextureLoader(lib);
        await lib.addTexture(123, DEFAULT_TEXTURE, 1, 1);
        // Act
        const result = lib.createSprite(123);
        // Assert
        expect(result).toBe(0);
    });

    test('texture is accessible', async () => {
        const { lib, spriteObjectId } = await createSpriteFixture(3, 3);
        const object = lib.__OBJECTS.get(spriteObjectId) as THREE.Sprite;
        expect(object).toBeTruthy();
        expect(object.material.map!.userData).toEqual({ columns: 3, rows: 3 });
    })
})

describe('setSpriteAnimationOffset', () => {
    test('Fails if texture has no rows/cols', async () => {
        const { lib, spriteObjectId } = await createSpriteFixture(undefined, undefined);
        const retcode = lib.setSpriteAnimationOffset(spriteObjectId, 0, 0);
        expect(retcode).toBe(-1);
    });

    test("Succeeds if texture has rows/cols", async () => {
        const { lib, spriteObjectId } = await createSpriteFixture(3, 3);
        const retcode = lib.setSpriteAnimationOffset(spriteObjectId, 0, 0);
        expect(retcode).toBe(0);
    })

    test("200x200 img, 3x3 cols/rows, anim=0,0 => offset=0,0", async () => {
        const { lib, spriteObjectId } = await createSpriteFixture(3, 3);
        lib.setSpriteAnimationOffset(spriteObjectId, 0, 0);
        const object = lib.__OBJECTS.get(spriteObjectId) as THREE.Sprite;

        expect(object).toBeTruthy();
        expect(object.material).toBeTruthy()
        expect(object.material.map!.offset.x).toBe(0);
        expect(object.material.map!.offset.y).toBe(0);
    });

    test("200x200 img, 4x4 cols/rows, anim=0,1 => offset=0.0,0.25", async () => {
        const { lib, spriteObjectId } = await createSpriteFixture(4, 4);
        lib.setSpriteAnimationOffset(spriteObjectId, 0, 1);
        const object = lib.__OBJECTS.get(spriteObjectId) as THREE.Sprite;
        expect(object.material.map!.offset.x).toBe(0.0);
        expect(object.material.map!.offset.y).toBe(0.25);
    })

    test("200x200 img, 4x4 cols/rows, anim=1,1 => 0.25,0.25", async () => {
        const { lib, spriteObjectId } = await createSpriteFixture(4, 4);
        lib.setSpriteAnimationOffset(spriteObjectId, 1, 1);
        const object = lib.__OBJECTS.get(spriteObjectId) as THREE.Sprite;
        expect(object.material.map!.offset.x).toBe(0.25);
        expect(object.material.map!.offset.y).toBe(0.25);
    })

    test("200x200 img, 4x4 cols/rows, anim=1,2 => offset=0.25,1.0", async () => {
        const { lib, spriteObjectId } = await createSpriteFixture(4, 4);
        lib.setSpriteAnimationOffset(spriteObjectId, 1, 2);
        const object = lib.__OBJECTS.get(spriteObjectId) as THREE.Sprite;
        expect(object.material.map!.offset.x).toBe(0.25);
        expect(object.material.map!.offset.y).toBe(0.5);
    })
});

describe('setPosition', () => {
    test('Sets position of an object', () => {
        const lib = createContext();
        const objectId = lib.createObject(
            GeometryClass.BoxGeometry,
            MaterialClass.MeshBasicMaterial
        );
        lib.setPosition(objectId, 1, 2, 3);
        const object = lib.__OBJECTS.get(objectId);
        expect(object).toBeTruthy();
        expect(object!.position.x).toBe(1);
        expect(object!.position.y).toBe(2);
        expect(object!.position.z).toBe(3);
    });
});
