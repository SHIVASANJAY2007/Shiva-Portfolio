# HEAD_TRACKING.md

# Feature: Knight Head Tracking (GitHub-style Cursor Follow)

## Objective

Implement a realistic head tracking system for the Knight 3D model.

The effect should be subtle and premium, similar to the GitHub homepage where the mascot appears to look toward the user's cursor.

Only the **head** should rotate.
The rest of the body must remain completely still.

---

# Expected Behaviour

- The Knight stands idle.
- As the user moves the mouse:
  - The head smoothly turns left and right.
  - The head slightly looks up and down.
- Movement should feel natural.
- No sudden snapping.
- Rotation must smoothly interpolate.
- When the cursor stops, the head slowly settles into position.
- When the cursor leaves the window, the head should smoothly return to its neutral pose.

---

# Rotation Limits

Never allow the head to rotate unnaturally.

Horizontal (Yaw)

- Minimum: -20°
- Maximum: +20°

Vertical (Pitch)

- Minimum: -10°
- Maximum: +10°

Do NOT rotate the neck beyond these limits.

---

# Animation Rules

Movement must use interpolation (lerp or damping).

Avoid:

- Instant rotation
- Jitter
- High sensitivity

Target feel:

- Heavy armored knight
- Smooth
- Premium
- Slight delay
- Natural inertia

---

# Cursor Mapping

Convert cursor position into normalized coordinates.

Mouse X

Left edge  -> -1

Center     -> 0

Right edge -> +1

Mouse Y

Top    -> +1

Center -> 0

Bottom -> -1

Map these values to the allowed head rotations.

---

# Implementation Steps

## Step 1

Load the GLB model.

---

## Step 2

Traverse the scene.

Locate the head bone.

Possible names include:

- Head
- Head001
- mixamorigHead
- Bip001_Head

Never hardcode a single name.

Search all bones.

---

## Step 3

Store a reference to the head bone.

---

## Step 4

Track mouse movement.

Listen for:

mousemove

Store normalized X and Y values.

---

## Step 5

Inside the render loop:

Calculate:

Target Yaw

Target Pitch

Clamp both values.

---

## Step 6

Smoothly interpolate the current rotation toward the target rotation.

Use:

- THREE.MathUtils.lerp()
- or MathUtils.damp()

Never directly assign rotations.

---

## Step 7

When mouse leaves the page:

Return target rotation to:

Yaw = 0

Pitch = 0

Again, interpolate smoothly.

---

# Performance

The implementation must:

- Use only one mouse listener.
- Avoid creating new Vector3 objects every frame.
- Avoid unnecessary allocations.
- Update only the head bone.
- Maintain 60 FPS.

---

# Visual Quality

The movement should resemble:

- GitHub homepage mascot
- AAA game idle NPC
- Premium landing pages

It should never feel robotic.

---

# Optional Enhancements

If possible, also support:

- Idle breathing animation.
- Tiny random micro head adjustments every 8–15 seconds.
- Occasional blink animation if the model supports it.
- Smooth easing when returning to the neutral pose.

---

# Constraints

DO NOT

- Rotate the entire model.
- Rotate the camera.
- Rotate the body.
- Affect existing idle animations.
- Break skeletal animations.
- Cause animation jitter.

---

# Success Criteria

✓ Cursor movement results in smooth head tracking.

✓ Body remains stationary.

✓ Head rotation is limited.

✓ Motion feels natural.

✓ No snapping.

✓ No jitter.

✓ Works alongside existing animations.

✓ Performance remains smooth.

The final result should feel like the Knight is aware of the visitor and subtly watching the cursor, similar to modern interactive landing pages.