#![allow(unused_unsafe)]
#![allow(non_snake_case)]

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
#[derive(Clone, Copy, Default, PartialEq, Eq)]
pub struct TwoI16 {
    pub x: i16,
    pub y: i16,
}
impl From<i32> for TwoI16 {
    fn from(value: i32) -> Self {
        TwoI16 {
            x: (value & 0xFFFF) as i16,
            y: ((value >> 16) & 0xFFFF) as i16,
        }
    }
}

// External JavaScript functions provided in your JS runtime environment
#[cfg(target_arch = "wasm32")]
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
    pub fn getKeysPressed() -> i32;
    pub fn getMouseMovement() -> i32;
    pub fn render() -> i32;
}

mod test {
    #![allow(unused)]

    use super::*;
    // a macro which takes a function name and returns a test function
    pub fn createObject(geometry: GeometryClass, material: MaterialClass) -> i32 {
        0
    }
    pub fn createSprite(texture_id: i32) -> i32 {
        0
    }
    pub fn setPosition(object_id: i32, x: f32, y: f32, z: f32) -> i32 {
        0
    }
    pub fn setRotation(object_id: i32, x: f32, y: f32, z: f32) -> i32 {
        0
    }
    pub fn setScale(object_id: i32, x: f32, y: f32, z: f32) -> i32 {
        0
    }
    pub fn setBg(color: i32) -> i32 {
        0
    }
    pub fn addObjectToScene(object_id: i32) -> i32 {
        0
    }
    pub fn removeObjectFromScene(object_id: i32) -> i32 {
        0
    }
    pub fn setSpriteAnimationOffset(object_id: i32, frame_x: i32, frame_y: i32) -> i32 {
        0
    }
    pub fn setCameraPosition(x: f32, y: f32, z: f32) -> i32 {
        0
    }
    pub fn cameraLookAt(x: f32, y: f32, z: f32) -> i32 {
        0
    }
    pub fn getKeysPressed() -> i32 {
        0
    }
    pub fn getMouseMovement() -> i32 {
        0
    }
    pub fn render() -> i32 {
        0
    }
}

#[cfg(not(target_arch = "wasm32"))]
use test::*;

#[repr(C)]
#[derive(Clone, Copy, Default, PartialEq, Eq)]
pub struct KeysSet(pub i32);

impl From<i32> for KeysSet {
    fn from(value: i32) -> Self {
        KeysSet(value)
    }
}

impl KeysSet {
    pub const A: i32 = 0b0000_0000_0000_0001;
    pub const S: i32 = 0b0000_0000_0000_0010;
    pub const D: i32 = 0b0000_0000_0000_0100;
    pub const W: i32 = 0b0000_0000_0000_1000;
    pub const SPACE: i32 = 0b0000_0000_0001_0000;

    #[inline(always)]
    pub fn diff(&self, other: &KeysSet) -> KeysSet {
        KeysSet(self.0 & !other.0)
    }

    pub fn and(&self, other: &KeysSet) -> KeysSet {
        KeysSet(self.0 & other.0)
    }

    pub fn or(&self, other: &KeysSet) -> KeysSet {
        KeysSet(self.0 | other.0)
    }

    pub fn any(&self) -> bool {
        self.0 != 0
    }

    #[inline(always)]
    pub fn wsad(&self) -> bool {
        (self.0 & 0b0000_0000_0000_1111) != 0
    }

    #[inline(always)]
    pub fn a(&self) -> bool {
        (self.0 & Self::A) != 0
    }

    #[inline(always)]
    pub fn s(&self) -> bool {
        (self.0 & Self::S) != 0
    }

    #[inline(always)]
    pub fn d(&self) -> bool {
        (self.0 & Self::D) != 0
    }

    #[inline(always)]
    pub fn w(&self) -> bool {
        (self.0 & Self::W) != 0
    }

    #[inline(always)]
    pub fn space(&self) -> bool {
        (self.0 & 0b0000_0000_0001_0000) != 0
    }
}

impl core::fmt::Debug for KeysSet {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        write!(f, "KeysSet({:016b})", self.0)
    }
}

pub mod ctx {
    use crate::KeysSet;

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
    pub fn get_keys_pressed() -> KeysSet {
        unsafe { super::getKeysPressed().into() }
    }
    pub fn get_mouse_movement() -> super::TwoI16 {
        unsafe { super::getMouseMovement().into() }
    }
}
