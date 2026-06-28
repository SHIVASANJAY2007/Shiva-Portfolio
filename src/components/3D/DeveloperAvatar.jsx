import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';

export const DeveloperAvatar = () => {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/fortnite-miles-morales.glb');
  const { actions } = useAnimations(animations, group);

  const tuned = useMemo(() => {
    return {
      // Keep emissive glow from nuking the look under Bloom
      eyeEmissiveIntensity: 1.4,
      eyeEmissiveColor: new THREE.Color('#ffffff'),
      // Target model framing (world units) inside the Hero canvas
      targetModelHeight: 3.6,
      // Slight downward nudge for “standing” feel
      yOffset: -0.15,
    };
  }, []);

  // Auto-fit model scale/position based on its bounding box
  useLayoutEffect(() => {
    if (!scene) return;

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    if (size.lengthSq() === 0) return;

    // Normalize: move model so it's centered at origin
    scene.position.x += -center.x;
    scene.position.y += -center.y;
    scene.position.z += -center.z;

    const currentHeight = size.y || 1;
    const scale = tuned.targetModelHeight / currentHeight;

    if (group.current) {
      group.current.scale.setScalar(scale);
      group.current.position.y = tuned.yOffset;
    }
  }, [scene, tuned]);

  // Traverse and tune materials (robust to different material name schemes)
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const material = child.material;

      // Some GLTFs use arrays of materials
      const materials = Array.isArray(material) ? material : [material];

      materials.forEach((m) => {
        if (!m) return;

        // Face / hood / “normal” materials: keep balanced metallic/roughness
        if (m.name === 'M_MED_FearlessFlightHero_FaceAcc') {
          if ('roughness' in m) m.roughness = 0.45;
          if ('metalness' in m) m.metalness = 0.25;
          return;
        }

        // Eyes/face accent: glow only when emissive is supported
        // Heuristic: default material often holds unassigned eye meshes, but
        // we also match by name keywords for robustness.
        const name = (m.name || '').toLowerCase();
        const likelyEyes =
          name.includes('eye') ||
          name.includes('eyes') ||
          name.includes('visor') ||
          name.includes('faceacc') ||
          m.name === 'DefaultMaterial';

        if (likelyEyes && 'emissive' in m && m.emissive) {
          m.emissive = tuned.eyeEmissiveColor;
          // Cap emissive intensity to avoid “washed/flat” look under Bloom
          m.emissiveIntensity = tuned.eyeEmissiveIntensity;
          if ('roughness' in m) m.roughness = 0.12;
          if ('metalness' in m) m.metalness = 0.12;
          // Let it bypass tone mapping so Bloom can catch the true intensity
          m.toneMapped = false;
          // Don't force color to white; keep the original albedo for detail.
          return;
        }

        // Body suit balance
        if (m.name === 'M_MED_FearlessFlightHero_Body') {
          if ('roughness' in m) m.roughness = 0.45;
          if ('metalness' in m) m.metalness = 0.25;
        }
      });
    });
  }, [scene, tuned]);

  useEffect(() => {
    const idleAction = actions?.['FearlessFlight_Male_idle'];
    if (!idleAction) return;

    idleAction.reset().fadeIn(0.5).play();
    return () => idleAction.fadeOut(0.5);
  }, [actions]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/models/fortnite-miles-morales.glb');
export default DeveloperAvatar;
