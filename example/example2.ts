// Basic THREE.js scene. It loads a sprite available at /sprite.png
// import * as THREE from "three";

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.getElementById("app")!.appendChild(renderer.domElement);

// const textureLoader = new THREE.TextureLoader();
// let sprite: THREE.Sprite;
// const spriteTexture = textureLoader.load("/example/image.png", (spriteTexture) => {
//     const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });
//     sprite = new THREE.Sprite(spriteMaterial);
//     sprite.scale.set(1, 1, 1); // Set the scale of the sprite
//     scene.add(sprite);


//     camera.position.z = 5;
//     function animate() {
//         requestAnimationFrame(animate);
//         sprite.position.x += 0.01; // Example animation
//         spriteTexture.offset.x += 0.01; // Example animation
//         renderer.render(scene, camera);
//     }
//     animate();
// });

import { createContext } from '../index';

async function main() {
    const ctxt = createContext();
    ctxt.init(document.getElementById('app')!);
    ctxt.setBg(0x000000);
    
    await ctxt.addTexture(123, '/example/image.png');
    const objId = ctxt.createSprite(123)
    ctxt.addObjectToScene(objId);

    ctxt.setCameraPosition(0, 0, 5);
    
    ctxt.render();
    console.log('done')
}

main()
