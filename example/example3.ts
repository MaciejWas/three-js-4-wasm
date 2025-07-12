// Basic THREE.js scene. It loads a sprite animation available at /sprite.png.
// The sprite animation contains 2 columns and 2 rows of images. 
import * as THREE from "three";

async function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("app")!.appendChild(renderer.domElement);
    const textureLoader = new THREE.TextureLoader();
    let sprite: THREE.Sprite;
    const spriteTexture = await textureLoader.loadAsync("/example/image.png");
    const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });
    sprite = new THREE.Sprite(spriteMaterial);

    spriteTexture.repeat.set(0.5, 0.5); // Set the repeat to match 2x2 grid

    sprite.scale.set(1, 1, 1); // Set the scale of the sprite
    scene.add(sprite);

    camera.position.z = 5;

    let idx = 0;
    setInterval(() => {
        idx = idx + 1;
    }, 1000)

    function animate() {
        requestAnimationFrame(animate);
        const [x, y] = [[0.0, 0.0], [0.0, 0.5], [0.5, 0.0], [0.5, 0.5]][idx % 4];
        spriteTexture.offset.set(x, y); // Update the offset for animation
        renderer.render(scene, camera);
    }
    animate();
}

main()