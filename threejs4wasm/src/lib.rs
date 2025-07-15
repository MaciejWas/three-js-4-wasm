#[repr(i32)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MaterialClass {
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

#[repr(i32)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum GeometryClass {
    BoxGeometry = 2001,
    SphereGeometry = 2002,
    PlaneGeometry = 2003,
    CylinderGeometry = 2004,
    ConeGeometry = 2005,
    TorusGeometry = 2006,
}

#[repr(C)]
pub struct TwoI16 {
    pub x: i16,
    pub y: i16,
}

// External JavaScript functions provided in your JS runtime environment
unsafe extern "C" {
    pub fn createObject(geometry: GeometryClass, material: MaterialClass) -> i32;
    pub fn createSprite(texture_id: i32) -> i32;
    pub fn setPosition(object_id: i32, x: f32, y: f32, z: f32) -> i32;
    pub fn setRotation(object_id: i32, x: f32, y: f32, z: f32) -> i32;
    pub fn setScale(object_id: i32, x: f32, y: f32, z: f32) -> i32;
    pub fn setBg(color: i32) -> i32;
    pub fn addObjectToScene(object_id: i32) -> i32;
    pub fn removeObjectFromScene(object_id: i32) -> i32;
    pub fn setSpriteAnimationOffset(object_id: i32, frame_x: i32, frame_y: i32) -> i32;
    pub fn setCameraPosition(x: f32, y: f32, z: f32) -> i32;
    pub fn cameraLookAt(x: f32, y: f32, z: f32) -> i32;

    pub fn getKeysPressed() -> KeysPressed;
    pub fn getMouseMovement() -> TwoI16;

    pub fn render() -> i32;
}

#[repr(C)]
#[derive(Clone, Copy)]
pub struct KeysPressed(u32);

impl KeysPressed {
    #[inline(always)]
    pub fn wsad_pressed(&self) -> bool {
        (self.0 & 0b0000_0000_0000_1111) != 0
    }

    #[inline(always)]
    pub fn a_pressed(&self) -> bool {
        (self.0 & 0b0000_0000_0000_0001) != 0
    }

    #[inline(always)]
    pub fn s_pressed(&self) -> bool {
        (self.0 & 0b0000_0000_0000_0010) != 0
    }

    #[inline(always)]
    pub fn d_pressed(&self) -> bool {
        (self.0 & 0b0000_0000_0000_0100) != 0
    }

    #[inline(always)]
    pub fn w_pressed(&self) -> bool {
        (self.0 & 0b0000_0000_0000_1000) != 0
    }
}

pub mod ctx {
    use crate::KeysPressed;

    pub fn create_object(geometry: super::GeometryClass, material: super::MaterialClass) -> i32 {
        unsafe { super::createObject(geometry, material) }
    }
    pub fn create_sprite(texture_id: i32) -> i32 {
        unsafe { super::createSprite(texture_id) }
    }
    pub fn set_position(object_id: i32, x: f32, y: f32, z: f32) -> i32 {
        unsafe { super::setPosition(object_id, x, y, z) }
    }
    pub fn set_rotation(object_id: i32, x: f32, y: f32, z: f32) -> i32 {
        unsafe { super::setRotation(object_id, x, y, z) }
    }
    pub fn set_scale(object_id: i32, x: f32, y: f32, z: f32) -> i32 {
        unsafe { super::setScale(object_id, x, y, z) }
    }
    pub fn set_bg(color: i32) -> i32 {
        unsafe { super::setBg(color) }
    }
    pub fn add_object_to_scene(object_id: i32) -> i32 {
        unsafe { super::addObjectToScene(object_id) }
    }
    pub fn remove_object_from_scene(object_id: i32) -> i32 {
        unsafe { super::removeObjectFromScene(object_id) }
    }
    pub fn set_sprite_animation_offset(object_id: i32, frame_x: i32, frame_y: i32) -> i32 {
        unsafe { super::setSpriteAnimationOffset(object_id, frame_x, frame_y) }
    }
    pub fn set_camera_position(x: f32, y: f32, z: f32) -> i32 {
        unsafe { super::setCameraPosition(x, y, z) }
    }
    pub fn camera_look_at(x: f32, y: f32, z: f32) -> i32 {
        unsafe { super::cameraLookAt(x, y, z) }
    }
    pub fn render() -> i32 {
        unsafe { super::render() }
    }
    pub fn get_keys_pressed() -> KeysPressed {
        unsafe { super::getKeysPressed() }
    }
    pub fn get_mouse_movement() -> super::TwoI16 {
        unsafe { super::getMouseMovement() }
    }
}
