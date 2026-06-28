import { Html } from '@react-three/drei';
import { useSceneStore } from '../../../store/sceneStore';
import styles from './Annotations.module.css';

export default function Annotations() {
  const setMode = useSceneStore((state) => state.setMode);

  return (
    <>
      {/* Marker for Warrior */}
      <Html position={[-1.5, 1, 0]}>
        <button 
          className={styles.marker} 
          onClick={() => setMode('warrior')}
          title="Warrior Focus"
        >
          8
        </button>
      </Html>

      {/* Marker for Dragon */}
      <Html position={[2, 1.5, 0]}>
        <button 
          className={styles.marker} 
          onClick={() => setMode('dragon')}
          title="Dragon Focus"
        >
          7
        </button>
      </Html>
    </>
  );
}
