// SPDX-License-Identifier: MIT
// Copyright (c) 2025, Maciej Wasilewski

import * as THREE from 'three';
/**
 * Creates a context for the Three.js library, providing methods to create and manipulate 3D objects, textures, and scenes.
 */
export const createContext = () => {
    /** 3D OBJECTS */
    const __OBJECTS = new Map<number, THREE.Object3D>();
    const __TEXTURES = new Map<number, THREE.Texture>();
    const __LOADED_TEXTURES = new Set<string>();

    /** COUNTERS */
    let __nextObjId = 0;

    /** THREE.JS MAIN OBJECTS */
    let __camera: THREE.PerspectiveCamera;
    let __scene: THREE.Scene;
    let __renderer: THREE.WebGLRenderer;

    /** LOADERS */
    const utf8Decoder = new TextDecoder("utf-8");
    const textureLoader = new THREE.TextureLoader();

    /** INPUT HANDLING */

    /** Bitmask. Every bit is some key */
    let keysPressed: number = 0;

    /** u32 (i16 + i16). First number is X dir, second number is Y dir */
    let mouseMovementX: number = 0;
    let mouseMovementY: number = 0;

    function packU16sToU32(low: number, high: number) {
        return (high << 16) | (low & 0xFFFF);
    }

    function onMouseMove(ev: MouseEvent) {
        mouseMovementX += ev.movementX;
        mouseMovementY += ev.movementY;
    }

    function onKeyUp(ev: KeyboardEvent) {
        const pressed: number = keys[ev.key];
        // remove the value from the keysPressed bitmask
        if (pressed) {
            keysPressed &= ~pressed;
        }
    }

    function onKeyDown(ev: KeyboardEvent) {
        const pressed: number = keys[ev.key];
        // add the value to the keysPressed bitmask
        if (pressed) {
            keysPressed |= pressed;
        }
    }

    function initInputListeners() {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
    }


    function getKeysPressed(): number {
        return keysPressed;
    }

    /**
     * Returns the mouse movement since the last call to this function.
     * The value is a packed u32 where the first 16 bits represent the X movement
     * and the next 16 bits represent the Y movement.
     * 
     * This function resets the mouse movement value to zero after retrieving it.
     */
    function getMouseMovement(): number {
        const ret = packU16sToU32(mouseMovementX, mouseMovementY);
        mouseMovementX = 0;
        mouseMovementY = 0;
        return ret;
    }

    /* BINDINGS */

    /** Initialized a THREE.Mesh object. It is not added to scene by default.
     * @param geometry - The type of geometry to use for the object, specified by GeometryClass enum.
     * @param material - The type of material to use for the object, specified by MaterialClass enum.
     * @returns The ID of the created object, or -1 if an error occurred.
     */
    function createObject(geometry: GeometryClass, material: MaterialClass): number {
        const geometryClass = GeometryClass[geometry];
        const materialClass = MaterialClass[material];

        // @ts-ignore
        let geometryClassInstance = THREE[geometryClass];
        // @ts-ignore
        let materialClassInstance = THREE[materialClass];

        try {
            const geometry: THREE.BufferGeometry = new geometryClassInstance();
            const material: THREE.Material = new materialClassInstance({ color: 0xffffff });
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
     * This function is not meant to be called from WASM.
     * 
     * Loads a texture from the specified path and stores it in the TEXTURES map.
     * 
     * @param path - The URL to the texture file.
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

        if ((rows && !columns) || (!rows && columns)) {
            console.warn(`Either both rows and columns must be specified or none of them.`);
            return -1;
        }

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

        texture.offset.set(frameX / columns, frameY / rows);

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

    /**
     * Initializes the Three.js context with a renderer, scene, and camera.
     * @param target - The HTML element to attach the renderer's canvas to.
     */
    function init(
        target: HTMLElement,
    ) {
        __camera = new THREE.PerspectiveCamera(75, target.clientWidth / target.clientHeight, 0.1, 1000);
        __scene = new THREE.Scene();
        __renderer = new THREE.WebGLRenderer({ antialias: true });

        __renderer.setSize(target.clientWidth, target.clientHeight);
        target.appendChild(__renderer.domElement);
    }

    /** 
     * Sets the background color of the scene.
     */
    function setBg(color: number) {
        if (!__scene) {
            console.error("Scene is not initialized.");
            return -1;
        }
        __scene.background = new THREE.Color(color);
        return 0;
    }

    function render() {
        if (!__renderer || !__scene || !__camera) {
            console.error("Renderer, scene, or camera is not initialized.");
            return -1;
        }

        __renderer.render(__scene, __camera);

        return 0;
    }

    return {
        createObject,
        createSprite,
        addTexture,
        setPosition,
        setRotation,
        setScale,
        setBg,
        addObjectToScene,
        removeObjectFromScene,
        setSpriteAnimationOffset,
        // camera
        setCameraPosition,
        cameraLookAt,
        init,
        // input
        getKeysPressed,
        getMouseMovement,
        initInputListeners,
        // rendering
        render,
        __OBJECTS,
        __TEXTURES,
        __LOADED_TEXTURES,
        textureLoader,

        createWasmEnv() {
            const exports: any = {};
            exports.createObject = createObject;
            exports.createSprite = createSprite;
            exports.setPosition = setPosition;
            exports.setRotation = setRotation;
            exports.setScale = setScale;
            exports.setBg = setBg;
            exports.addObjectToScene = addObjectToScene;
            exports.removeObjectFromScene = removeObjectFromScene;
            exports.setSpriteAnimationOffset = setSpriteAnimationOffset;
            exports.setCameraPosition = setCameraPosition;
            exports.cameraLookAt = cameraLookAt;
            exports.getKeysPressed = getKeysPressed;
            exports.getMouseMovement = getMouseMovement;
            return exports
        }
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

/** INPUT */
const keys: Record<string, number> = {
    w: 1 << 0,
    a: 1 << 1,
    s: 1 << 2,
    d: 1 << 3,
    space: 1 << 4,
}
