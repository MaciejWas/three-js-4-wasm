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
    pub fn render() -> i32;
}

pub mod ctx {
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
}
