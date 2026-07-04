import { NodeIO } from '@gltf-transform/core';

async function analyze() {
  const io = new NodeIO();
  try {
    const document = await io.read('https://huggingface.co/datasets/Shiva-Asta/portfolio-assets/resolve/main/knight.glb');
    const root = document.getRoot();
    
    const meshes = root.listMeshes();
    let triangles = 0;
    
    for (const mesh of meshes) {
      for (const prim of mesh.listPrimitives()) {
        const indices = prim.getIndices();
        if (indices) {
          triangles += indices.getCount() / 3;
        } else {
          const position = prim.getAttribute('POSITION');
          if (position) {
            triangles += position.getCount() / 3;
          }
        }
      }
    }
    
    console.log(`Meshes/Draw Calls: ${meshes.length}`);
    console.log(`Triangles: ${triangles}`);
  } catch(e) {
    console.error(e);
  }
}

analyze();
