# three-js-4-wasm
THREE.js pseudo-bindings. This is a very thin wrapper around THREE.js which can be easily called from wasm.

## Example (not working yet)


```rs
use three_js_4_wasm::ctx;

pub fn main() {
   let obj: i32 = ctx::create_object(BoxGeometry, MeshBasicMaterial);
   ctx::add_to_scene(obj);
   ctx::set_position(obj, 1.0, 2.0, 3.0);
   ctx::set_rotation(obj, -1.0, 2.0, -3.0);
   ctx::set_camera_position(-10.0, -10.0, -10.0);
   ctx::camera_look_at_obj(obj);
}
```
