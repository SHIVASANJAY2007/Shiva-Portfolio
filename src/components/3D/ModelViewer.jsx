import { Suspense, useState } from "react";
import { useModelLoader, useModelProgress } from "../../hooks/useModelLoader";
import { Html } from "@react-three/drei";

function LoadingOverlay() {
  const { progress } = useModelProgress();
  return (
    <Html center>
      <div style={{
        color: '#FF0055',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        background: 'rgba(255,255,255,0.9)',
        padding: '10px 20px',
        borderRadius: '20px',
        border: '1px solid #FF0055',
        boxShadow: '0 4px 12px rgba(255,0,85,0.2)'
      }}>
        Loading model… {Math.round(progress)}%
      </div>
    </Html>
  );
}

function ModelInner({ modelKey, onError }) {
  try {
    const { gltf } = useModelLoader(modelKey);
    return <primitive object={gltf.scene} />;
  } catch (err) {
    onError?.(err);
    return null;
  }
}

export default function ModelViewer({ modelKey }) {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <Html center>
        <div style={{ color: 'red', background: 'white', padding: '10px', borderRadius: '8px' }}>
          Couldn't load this model. <button onClick={() => setError(null)}>Retry</button>
        </div>
      </Html>
    );
  }

  return (
    <Suspense fallback={<LoadingOverlay />}>
      <ModelInner modelKey={modelKey} onError={setError} />
    </Suspense>
  );
}
