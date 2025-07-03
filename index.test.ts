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

const loadTextureFixture = async (rows: number | undefined = undefined, cols: number | undefined = undefined) => {
    const THREE = require('three');
    const lib = require('./index');

    lib.textureLoader.loadAsync = jest.fn(() => {
        const texture = {
            width: 200,
            height: 200,
            userData: {},
            offset: {
                x: 0,
                y: 0
            },
            repeat: {
                _repeat: 0,
                set(x: number) {
                    this._repeat = x;
                },
            },
            clone() {
                return this
            },

            material: {
                
            }

        } as any;
        return Promise.resolve(texture);
    });

    lib.loadTexture(DEFAULT_TEXTURE, rows, cols);

    await new Promise(r => setTimeout(r, 100));
    return { THREE, lib }
}

describe('loadTexture', () => {
    test('return 0 if texture is not present', () => {
        const lib = require('./index');
        const textureUrl = DEFAULT_TEXTURE;
        expect(lib.loadTexture(textureUrl)).toBe(0);
    });

    test('returns -1 if texture is already loaded', () => {
        const lib = require('./index');
        lib.__TEXTURES.set(DEFAULT_TEXTURE, null as any);
        expect(lib.loadTexture(DEFAULT_TEXTURE)).toBe(-1);
    });

    test('Adds texture to __TEXTURES', async () => {
        const { THREE, lib } = await loadTextureFixture();
        expect(lib.__TEXTURES.size).toBe(1)
    });

    test('Doesnt assign rows/cols if not provided', async () => {
        const { THREE, lib } = await loadTextureFixture();
        expect(lib.__TEXTURES.get(DEFAULT_TEXTURE).userData.rows)
            .toBe(undefined)
        expect(lib.__TEXTURES.get(DEFAULT_TEXTURE).userData.columns)
            .toBe(undefined)

    });

    test("Assigns rows/cols if provided", async () => {
        const { THREE, lib } = await loadTextureFixture(5, 7);
        expect(lib.__TEXTURES.get(DEFAULT_TEXTURE).userData.rows)
            .toBe(5)
        expect(lib.__TEXTURES.get(DEFAULT_TEXTURE).userData.columns)
            .toBe(7)
    })
})

describe('object count', () => {
    test('initial count is 0', () => {
        const lib = require('./index');
        expect(lib.__nextObjId).toBe(0);
    });
})


const DEFAULT_TEXTURE = `https://i.imgur.com/aOa9J13.jpeg`;
const createSpriteFixture = async (rows: any, cols: any) => {
    const { lib, THREE } = await loadTextureFixture(rows, cols)
    const spriteObjectId = lib.createSprite(DEFAULT_TEXTURE, 2, 4);
    return {
        lib,
        spriteObjectId,
        THREE
    };
}


describe('createSprite', () => {
    test('Returns -1 if texture is not loaded', () => {
        const lib = require('./index');
        const result = lib.createSprite(DEFAULT_TEXTURE, '[{"color": 16777215}]');
        expect(result).toBe(-1);
    });

    test('Returns object id if texture is loaded', () => {
        const THREE = require('three');
        const lib = require('./index');
        lib.__nextObjId = 123;
        lib.__TEXTURES.set(DEFAULT_TEXTURE, new THREE.Texture());
        const result = lib.createSprite(DEFAULT_TEXTURE, 1, 1);
        expect(result).toBe(123);
    });
})

describe('setSpriteAnimationOffset', () => {
    test('Fails if texture has no rows/cols', async () => {
        const { lib, spriteObjectId, THREE } = await createSpriteFixture(undefined, undefined);
        const retcode = lib.setSpriteAnimationOffset(spriteObjectId, 0, 0);
        expect(retcode).toBe(-1);
    });

    test("Succeeds if texture has rows/cols", async () => {
        const { lib, spriteObjectId, THREE } = await createSpriteFixture(3, 3);
        const retcode = lib.setSpriteAnimationOffset(spriteObjectId, 0, 0);
        expect(retcode).toBe(0);
    })

    test("200x200 img, 4x4 cols/rows, offset 0,0 => 0px, 0px", async () => {
        const { lib, spriteObjectId, THREE } = await createSpriteFixture(3, 3);
        lib.setSpriteAnimationOffset(spriteObjectId, 0, 0);
        const object = lib.__OBJECTS.get(spriteObjectId);
        expect(object.material.map.offset.x).toBe(0);
        expect(object.material.map.offset.y).toBe(0);
    });

    test("200x200 img, 4x4 cols/rows, offset 0,1 => 0px, 50px", async () => {
        const { lib, spriteObjectId, THREE } = await createSpriteFixture(4, 4);
        lib.setSpriteAnimationOffset(spriteObjectId, 0, 1);
        const object = lib.__OBJECTS.get(spriteObjectId);
        expect(object.material.map.offset.x).toBe(0);
        expect(object.material.map.offset.y).toBe(50);
    })

    test("200x200 img, 4x4 cols/rows, offset 1,1 => 50px, 50px", async () => {
        const { lib, spriteObjectId, THREE } = await createSpriteFixture(4, 4);
        lib.setSpriteAnimationOffset(spriteObjectId, 1, 1);
        const object = lib.__OBJECTS.get(spriteObjectId);
        expect(object.material.map.offset.x).toBe(50);
        expect(object.material.map.offset.y).toBe(50);
    })

    test("200x200 img, 4x4 cols/rows, offset 1,2 => 50px, 100px", async () => {
        const { lib, spriteObjectId, THREE } = await createSpriteFixture(4, 4);
        lib.setSpriteAnimationOffset(spriteObjectId, 1, 2);
        const object = lib.__OBJECTS.get(spriteObjectId);
        expect(object.material.map.offset.x).toBe(50);
        expect(object.material.map.offset.y).toBe(100);

        console.log(new THREE.Vector3(23,32,32.003123213).toArray().join("-") )
    })

    // test('Sets sprite animation offset for a specific frame', () => {
    //     const { lib, spriteObjectId, THREE } = createSpriteFixture();

    //     const retcode = lib.setSpriteAnimationOffset(spriteObjectId, 1, 2);
    //     expect(retcode).toBe(0);

    //     const object = lib.__OBJECTS.get(spriteObjectId);
    //     const texture = object.material.map;
    //     expect(texture.offset.x).toBe(50);
    //     expect(texture.offset.y).toBe(100);
    // });
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