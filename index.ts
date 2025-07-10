// SPDX-License-Identifier: MIT
// Copyright (c) 2025, Maciej Wasilewski

import * as THREE from 'three';

export const createContext = () => {
    /** 3D OBJECTS */
    const __OBJECTS = new Map<number, THREE.Object3D>();
    let __nextObjId = 0;
    const __TEXTURES = new Map<number, THREE.Texture>();
    const __LOADED_TEXTURES = new Set<string>();

    /** THREE.JS MAIN OBJECTS */
    let __camera: THREE.PerspectiveCamera;
    let __scene: THREE.Scene;
    let __renderer: THREE.WebGLRenderer;

    /** LOADERS */
    const utf8Decoder = new TextDecoder("utf-8");
    const textureLoader = new THREE.TextureLoader();

    /** BINDINGS */
    function createObject(geometry: GeometryClass, material: MaterialClass): number {
        const geometryClass = GeometryClass[geometry];
        const materialClass = MaterialClass[material];

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
            console.error(`Geometry class ${geometryClass} is not a BufferGeometry.`);
            return -1;
        }

        if (!materialClassInstance) {
            console.error(`Material class ${materialClass} not found.`);
            return -1;
        }

        if (materialClassInstance.prototype instanceof THREE.Material === false) {
            console.error(`Material class ${materialClass} is not a Material.`);
            return -1;
        }
        // @endif

        try {
            const geometry: THREE.BufferGeometry = new geometryClassInstance();
            const material: THREE.Material = new materialClassInstance();
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
     * This function should be called before wasm module is run.
     * 
     * Loads a texture from the specified path and stores it in the TEXTURES map.
     * If the texture is already loaded, it returns -1 to indicate that the texture is already present.
     * If the texture is not loaded, it uses the THREE.TextureLoader to load the texture asynchronously.
     * 
     * @param path - The path to the texture file.
     * @param rows - The number of rows in the texture grid (optional)
     * @param columns - The number of columns in the texture grid (optional)
     */
    async function addTexture(id: number, path: string, rows?: number, columns?: number): Promise<number> {
        if (__LOADED_TEXTURES.has(path)) {
            console.warn(`Texture ${path} is already loaded.`);
            return -1;
        }

        if (__TEXTURES.has(id)) {
            console.warn(`Texture with ID ${id} already exists.`);
            return -1;
        }

        console.log(`Loading texture from ${path} with id ${id}`);

        const texture = await textureLoader.loadAsync(path);
        
        if (rows || columns) {
            texture.userData.rows = rows;
            texture.userData.columns = columns;
        }

        __TEXTURES.set(id, texture);
        __LOADED_TEXTURES.add(path);

        return id;
    }

    function createSprite(textureId: number): number {
        const texture = __TEXTURES.get(textureId);

        if (!texture) {
            console.error(`Texture ${textureId} not found.`);
            return -1;
        }

        if (texture.userData.rows || texture.userData.columns) {
            texture.repeat.set(1 / texture.userData.columns, 1 / texture.userData.rows);
        }

        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture.clone(),
            transparent: true
        });
        const sprite: THREE.Object3D = new THREE.Sprite(spriteMaterial);

        sprite.userData = { ...texture.userData };

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
    function setPosition(
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
    function setRotation(
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
    function setScale(
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

    function addObjectToScene(id: number): number {
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
    function removeObjectFromScene(id: number): number {
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
    function setSpriteAnimationOffset(
        id: number,
        frameX: number,
        frameY: number
    ): number {
        const object = __OBJECTS.get(id);
        if (!object || !(object instanceof THREE.Sprite)) {
            console.error(`Object with ID ${id} is not a sprite or not found.`);
            return -1;
        }

        const texture = object.material.map;
        if (!texture) {
            console.error(`Sprite with ID ${id} has no texture.`);
            return -1;
        }

        const { rows, columns } = texture.userData;

        if (!rows || !columns) {
            console.error(`Texture of Object ${id} is not animated (has no rows/cols)`)
            return -1;
        }

        texture.offset.x = texture.width * (frameX / columns);
        texture.offset.y = texture.height * (frameY / rows);

        return 0;
    }

    /** TODO: docs */
    /**
     * Sets the position of the camera in the 3D scene.
     * 
     * @param x - The x-coordinate of the camera's position.
     * @param y - The y-coordinate of the camera's position.
     * @param z - The z-coordinate of the camera's position.
     * @returns 0 if the position was set successfully, or -1 if the camera is not initialized.
     */
    function setCameraPosition(
        x: number, y: number, z: number,
    ): number {
        if (!__camera) {
            return -1
        }

        __camera.position.set(x, y, z)

        return 0;
    }


    /**
     * Sets the camera to look at a specific point in the 3D scene.
     * 
     * @param x - The x-coordinate of the point to look at.
     * @param y - The y-coordinate of the point to look at.
     * @param z - The z-coordinate of the point to look at.
     * @returns 0 if the camera was set to look at the point successfully, or -1 if the camera is not initialized.
     */
    function cameraLookAt(
        x: number, y: number, z: number,
    ) {
        if (!__camera) {
            return -1;
        }

        __camera.lookAt(x, y, z);

        return 0;
    }

    function init(
        camera: THREE.PerspectiveCamera,
        scene: THREE.Scene,
        renderer: THREE.WebGLRenderer
    ) {
        __camera = camera;
        __scene = scene;
        __renderer = renderer;
    }

    return {
        createObject,
        createSprite,
        addTexture,
        setPosition,
        setRotation,
        setScale,
        addObjectToScene,
        removeObjectFromScene,
        setSpriteAnimationOffset,
        setCameraPosition,
        cameraLookAt,
        init,
        __OBJECTS,
        __TEXTURES,
        __LOADED_TEXTURES,
        textureLoader
    }

}

/** CLASSES */
export enum MaterialClass {
    MeshBasicMaterial = 1001,
    MeshLambertMaterial = 1002,
    MeshPhongMaterial = 1003,
    MeshStandardMaterial = 1004,
    MeshPhysicalMaterial = 1005,
    MeshToonMaterial = 1006,
    MeshDepthMaterial = 1007,
    MeshNormalMaterial = 1008,
    LineBasicMaterial = 1010,
    LineDashedMaterial = 1011,
    PointsMaterial = 1012,
}

export enum GeometryClass {
    BoxGeometry = 2001,
    SphereGeometry = 2002,
    PlaneGeometry = 2003,
    CylinderGeometry = 2004,
    ConeGeometry = 2005,
    TorusGeometry = 2006,
}