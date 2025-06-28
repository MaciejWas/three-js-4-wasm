// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2023-2024, Maciej Wasilewski

import * as THREE from 'three';

export const __OBJECTS = new Map<number, THREE.Object3D>();
export let __nextObjId = 0;

export const __TEXTURES = new Map<string, THREE.Texture>();

export let __camera: THREE.PerspectiveCamera;
export let __scene: THREE.Scene;
export let __renderer: THREE.WebGLRenderer;

export let textureLoader = new THREE.TextureLoader();

export function init(
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer
) {
    camera = camera;
    scene = scene;
    renderer = renderer;
}

/**
 * Creates a 3D object using the specified geometry and material classes and their parameters.
 * The function validates the provided class names and ensures they are compatible with
 * `THREE.BufferGeometry` and `THREE.Material`. If validation fails, it logs an error and returns -1.
 * Otherwise, it creates a mesh, assigns it a unique ID, and stores it in the `MESHES` map.
 *
 * @param geometryClass - The name of the geometry class from the `THREE` library (e.g., "BoxGeometry").
 * @param geometryParams - A JSON string representing the parameters array to pass to the geometry class constructor.
 * @param materialClass - The name of the material class from the `THREE` library (e.g., "MeshBasicMaterial").
 * @param materialParams - A JSON string representing the parameters array to pass to the material class constructor.
 * @returns The unique ID of the created mesh, or -1 if an error occurs during validation.
 */
export function createObject(
    geometryClass: string,
    geometryParams: string,
    materialClass: string,
    materialParams: string,
): number {
    // @ts-ignore
    let geometryClassInstance = THREE[geometryClass];
    // @ts-ignore
    let materialClassInstance = THREE[materialClass];

    // @ifdef ASSERTIONS
    if (!geometryClassInstance) {
        console.error(`Geometry class ${geometryClass} not found.`);
        return -1;
    }

    if (geometryClassInstance.prototype instanceof THREE.BufferGeometry === false) {
        console.error(`Material class ${materialClass} is not a Material.`);
        return -1;
    }

    if (!materialClassInstance) {
        console.error(`Material class ${materialClass} not found.`);
        return -1;
    }

    if (materialClassInstance.prototype instanceof THREE.Material === false) {
        console.error(`Geometry class ${geometryClass} is not a BufferGeometry.`);
        return -1;
    }
    // @endif

    try {
        const geometry: THREE.BufferGeometry = new geometryClassInstance(...JSON.parse(geometryParams));
        const material: THREE.Material = new materialClassInstance(...JSON.parse(materialParams));
        const mesh: THREE.Object3D = new THREE.Mesh(geometry, material);

        const id = __nextObjId;
        __OBJECTS.set(__nextObjId, mesh);
        __nextObjId++;
        return id;
    } catch (error) {
        console.error(`Error creating object: ${error}`);
        return -1;
    }
}

/**
 * Loads a texture from the specified path and stores it in the TEXTURES map.
 * If the texture is already loaded, it returns -1 to indicate that the texture is already present.
 * If the texture is not loaded, it uses the THREE.TextureLoader to load the texture asynchronously.
 */
export function loadTexture(path: string): number {
    if (__TEXTURES.has(path)) {
        return -1;
    }

    textureLoader.loadAsync(path)
        .then((texture: THREE.Texture) => {
            __TEXTURES.set(path, texture);
        })
        .catch((error) => {
            console.error(`Failed to load texture from path ${path}:`, error);
        });

    return 0;
}

/**
 * Creates a sprite using the specified texture path and divides it into a grid of columns and rows.
 *
 * @param texturePath - The path to the texture image file.
 * @param columns - The number of columns in the sprite grid (default is 4).
 * @param rows - The number of rows in the sprite grid (default is 4).
 * @returns The unique ID of the created sprite, or -1 if the texture is not loaded.
 */
export function createSprite(
    texturePath: string,
    columns: number = 4,
    rows: number = 4,
): number {
    if (!__TEXTURES.has(texturePath)) {
        console.error(`Texture ${texturePath} not loaded.`);
        return -1;
    }

    const texture = __TEXTURES.get(texturePath);
    if (!texture) {
        console.error(`Texture ${texturePath} not found.`);
        return -1;
    }

    texture.repeat.set(1 / columns, 1 / rows);

    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture.clone(), 
        transparent: true
    });
    const sprite: THREE.Object3D = new THREE.Sprite(spriteMaterial);
    
    sprite.userData = { columns, rows };

    const id = __nextObjId;
    __OBJECTS.set(__nextObjId, sprite);
    __nextObjId++;

    return id;
}

/**
 * Sets the position of an object in the 3D scene.
 * @param id - The unique ID of the object to set the position for.
 * @param x - The x-coordinate of the position.
 * @param y - The y-coordinate of the position.
 * @param z - The z-coordinate of the position.
 * @returns 0 if the position was set successfully, or -1 if the object with the given ID was not found.
 */
export function setPosition(
    id: number,
    x: number,
    y: number,
    z: number
): number {
    const object = __OBJECTS.get(id);
    if (!object) {
        console.error(`Object with ID ${id} not found.`);
        return -1;
    }

    object.position.set(x, y, z);
    return 0;
}

/**
 * Sets the rotation of an object in the 3D scene.
 * @param id - The unique ID of the object to set the rotation for.
 * @param x - The x-component of the rotation (in radians).
 * @param y - The y-component of the rotation (in radians).
 * @param z - The z-component of the rotation (in radians).
 * @returns 0 if the rotation was set successfully, or -1 if the object with the given ID was not found.
 */
export function setRotation(
    id: number,
    x: number,
    y: number,
    z: number
): number {
    const object = __OBJECTS.get(id);
    if (!object) {
        console.error(`Object with ID ${id} not found.`);
        return -1;
    }

    object.rotation.set(x, y, z);
    return 0;
}

/**
 * Sets the scale of an object in the 3D scene.
 * @param id - The unique ID of the object to set the scale for.
 * @param x - The x-component of the scale.
 * @param y - The y-component of the scale.
 * @param z - The z-component of the scale.
 * @return 0 if the scale was set successfully, or -1 if the object with the given ID was not found.
 */
export function setScale(
    id: number,
    x: number,
    y: number,
    z: number
): number {
    const object = __OBJECTS.get(id);
    if (!object) {
        console.error(`Object with ID ${id} not found.`);
        return -1;
    }

    object.scale.set(x, y, z);
    return 0;
}

export function addObjectToScene(id: number): number {
    const object = __OBJECTS.get(id);
    if (!object) {
        console.error(`Object with ID ${id} not found.`);
        return -1;
    }

    __scene.add(object);
    return 0;
}

/**
 * Removes an object from the 3D scene.
 * @param id - The unique ID of the object to remove.
 * @returns 0 if the object was removed successfully, or -1 if the object with the given ID was not found.
 */
export function removeObjectFromScene(id: number): number {
    const object = __OBJECTS.get(id);
    if (!object) {
        console.error(`Object with ID ${id} not found.`);
        return -1;
    }

    __scene.remove(object);
    return 0;
}

/**
 * Sets the offset for a sprite animation frame.
 * This function updates the texture offset of a sprite to display a specific frame
 * in a grid of frames defined by the number of columns and rows in the sprite texture.
 * It calculates the offset based on the frame's position in the grid.
 * 
 * @param id - The unique ID of the sprite object.
 * @param frameX - The x-coordinate of the frame in the grid (e.g. if given texture contains 10 sprites in each row then this value can be between 0 and 9).
 * @param frameY - The y-coordinate of the frame in the grid (e.g. if given texture contains 10 sprites in each column then this value can be between 0 and 9)
 * @returns 0 if the offset was set successfully, or -1 if the sprite with the given ID was not found or has no texture.
 */
export function setSpriteAnimationOffset(
    id: number,
    frameX: number,
    frameY: number
): number {
    const object = __OBJECTS.get(id);
    if (!object || !(object instanceof THREE.Sprite)) {
        console.error(`Object with ID ${id} is not a sprite or not found.`);
        return -1;
    }

    const texture = (object.material as THREE.SpriteMaterial).map;
    if (!texture) {
        console.error(`Sprite with ID ${id} has no texture.`);
        return -1;
    }

    const { rows, columns } = texture.userData;
    texture.offset.x = texture.width * (frameX / columns);
    texture.offset.y = texture.height * (frameY / rows);

    return 0;
}

type Exports = {
    step(): void;
}

/**
 * @param wasmModule The WebAssembly module to run. it should export a `step` function which is called in the render loop.
 * @param imports Additional imports to pass to the WebAssembly module.
 * @param threeRenderLoopOpts Options for the Three.js render loop
 * @returns A promise that resolves to the WebAssembly instance.
 * @throws Will throw an error if the WebAssembly module fails to instantiate or if the `step` function is not found.
 * @throws Will throw an error if the Three.js scene, camera, or renderer is not initialized.
 */
export async function runWasmModule(
    wasmModule: WebAssembly.Module,
    imports: Record<string, any> = {},
    threeRenderLoopOpts = { fps: 60 } // Default to 60 FPS
): Promise<WebAssembly.Instance> {
    imports.addObjectToScene = addObjectToScene;
    imports.removeObjectFromScene = removeObjectFromScene;

    imports.setPosition = setPosition;
    imports.setRotation = setRotation;
    imports.setScale = setScale;
    imports.setSpriteAnimationOffset = setSpriteAnimationOffset;

    imports.createObject = createObject;
    imports.createSprite = createSprite;

    imports.loadTexture = loadTexture;

    console.log("Running WebAssembly module with imports:", imports);

    const mod: WebAssembly.Instance = await WebAssembly.instantiate(wasmModule, imports);

    if (!mod || !mod.exports) {
        throw new Error("Failed to instantiate WebAssembly module.");
    }

    if (mod.exports.step === undefined || typeof mod.exports.step !== 'function') {
        throw new Error("WASM module does not export a 'step' function.");
    }

    const { step } = mod.exports as Exports;

    // Ensure that all required THREE.js components are initialized
    if (!__scene || !__camera || !__renderer) {
        throw new Error("THREE.js scene, camera, or renderer is not initialized.");
    }

    const renderLoop = () => {
        step();
        __renderer.render(__scene, __camera);
        requestAnimationFrame(renderLoop);
    };

    renderLoop();

    console.log("Render loop has started. Yeehaw!");

    return mod;
}