import * as THREE from 'three';
export declare function init(camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer): void;
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
export declare function createObject(geometryClass: string, geometryParams: string, materialClass: string, materialParams: string): number;
/**
 * Loads a texture from the specified path and stores it in the TEXTURES map.
 * If the texture is already loaded, it returns -1 to indicate that the texture is already present.
 * If the texture is not loaded, it uses the THREE.TextureLoader to load the texture asynchronously.
 */
export declare function loadTexture(path: string): number;
/**
 * Creates a sprite using the specified texture path and divides it into a grid of columns and rows.
 *
 * @param texturePath - The path to the texture image file.
 * @param columns - The number of columns in the sprite grid (default is 4).
 * @param rows - The number of rows in the sprite grid (default is 4).
 * @returns The unique ID of the created sprite, or -1 if the texture is not loaded.
 */
export default function createSprite(texturePath: string, columns?: number, rows?: number): number;
/**
 * Sets the position of an object in the 3D scene.
 * @param id - The unique ID of the object to set the position for.
 * @param x - The x-coordinate of the position.
 * @param y - The y-coordinate of the position.
 * @param z - The z-coordinate of the position.
 * @returns 0 if the position was set successfully, or -1 if the object with the given ID was not found.
 */
export declare function setPosition(id: number, x: number, y: number, z: number): number;
/**
 * Sets the rotation of an object in the 3D scene.
 * @param id - The unique ID of the object to set the rotation for.
 * @param x - The x-component of the rotation (in radians).
 * @param y - The y-component of the rotation (in radians).
 * @param z - The z-component of the rotation (in radians).
 * @returns 0 if the rotation was set successfully, or -1 if the object with the given ID was not found.
 */
export declare function setRotation(id: number, x: number, y: number, z: number): number;
/**
 * Sets the scale of an object in the 3D scene.
 * @param id - The unique ID of the object to set the scale for.
 * @param x - The x-component of the scale.
 * @param y - The y-component of the scale.
 * @param z - The z-component of the scale.
 * @return 0 if the scale was set successfully, or -1 if the object with the given ID was not found.
 */
export declare function setScale(id: number, x: number, y: number, z: number): number;
export declare function addObjectToScene(id: number): number;
/**
 * Removes an object from the 3D scene.
 * @param id - The unique ID of the object to remove.
 * @returns 0 if the object was removed successfully, or -1 if the object with the given ID was not found.
 */
export declare function removeObjectFromScene(id: number): number;
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
export declare function setSpriteAnimationOffset(id: number, frameX: number, frameY: number): number;
/**
 * @param wasmModule The WebAssembly module to run. it should export a `step` function which is called in the render loop.
 * @param imports Additional imports to pass to the WebAssembly module.
 * @param threeRenderLoopOpts Options for the Three.js render loop
 * @returns A promise that resolves to the WebAssembly instance.
 * @throws Will throw an error if the WebAssembly module fails to instantiate or if the `step` function is not found.
 * @throws Will throw an error if the Three.js scene, camera, or renderer is not initialized.
 */
export declare function runWasmModule(wasmModule: WebAssembly.Module, imports?: Record<string, any>, threeRenderLoopOpts?: {
    fps: number;
}): Promise<WebAssembly.Instance>;
