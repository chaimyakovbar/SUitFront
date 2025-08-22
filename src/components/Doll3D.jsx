import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

// The Doll component with the model
export const Doll = (props) => {
  const modelRef = useRef();
  const { scene } = useGLTF("/models/suit_jacket.glb", true);

  // Set the scale on first render without useEffect
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    return clone;
  }, [scene]);

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      dispose={null}
      scale={[5, 5, 5]}
      {...props}
    />
  );
};

// The second Doll component with a different model
export const Doll2 = (props) => {
  const modelRef = useRef();
  const { scene } = useGLTF("/models/allSuit.glb", true);

  // Set the scale on first render without useEffect
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    return clone;
  }, [scene]);

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      dispose={null}
      scale={[5, 5, 5]}
      {...props}
    />
  );
};

// Preload models
useGLTF.preload("/models/suit_jacket.glb");
useGLTF.preload("/models/allSuit.glb");
