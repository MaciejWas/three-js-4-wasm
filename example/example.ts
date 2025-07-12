import { createContext, GeometryClass, MaterialClass } from '../index';

const ctxt = createContext();
ctxt.init(document.getElementById('app')!);
ctxt.setBg(0x000000);
const objectId = ctxt.createObject(
    GeometryClass.BoxGeometry,
    MaterialClass.MeshBasicMaterial
);
ctxt.addObjectToScene(objectId);
ctxt.setCameraPosition(0, 0, 5);

let rot = 0.0;
function animate() {
    requestAnimationFrame(animate);
    ctxt.setRotation(objectId, rot, rot, 0);
    rot += 0.01;
    ctxt.render();
}

animate();