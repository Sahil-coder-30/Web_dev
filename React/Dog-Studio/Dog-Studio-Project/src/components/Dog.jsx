import React, { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Camera, log } from "three/src/Three.Core.js";
import {
  MatcapTexture,
  OrbitControls,
  useAnimations,
  useGLTF,
  useTexture,
} from "@react-three/drei";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Dog = () => {
  useThree(({ camera, scene, gl }) => {
    camera.position.z = 0.52;
    gl.colorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ReinhardToneMapping;
  });

  const model = useGLTF("models/dog.drc.glb");

  const { actions } = useAnimations(model.animations, model.scene);

  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  //   const texture = useTexture({
  //     normalMap : "/dog_normals.jpg",
  //     sampleMatCap : "/matcap/mat-2.png"
  //   })

  const [normalMap, sampleMatCap] = useTexture([
    "/dog_normals.jpg",
    "/matcap/mat-2.png",
    "branches_diffuse.jpeg",
    "branches_normals.jpeg",
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const [BranchMap, BranchNormalMap] = useTexture([
    "branches_diffuse.jpeg",
    "branches_normals.jpeg",
  ]).map((texture) => {
    texture.flipY = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const BranchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: BranchNormalMap,
    map: BranchMap,
  });

  const material = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: sampleMatCap,
  });
  //   texture.normalMap.flipY = false;
  //   texture.sampleMatCap.colorSpace = THREE.SRGBColorSpace

  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = material;
    }
    if (child.name.includes("BRANCHS")) {
      child.material = BranchMaterial;
    }
  });

  const DogModel = useRef(model);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "secion-1",
        endTrigger: "section-4",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: true,
      },
    });


    tl
    .to(DogModel.current.scene.position, {
      z: "-=0.6",
      y:"+=0.1"
    })
    .to(DogModel.current.scene.rotation,{
      x:`+=${Math.PI/15}`
    })
    .to(DogModel.current.scene.position,{
      z:"-0.25"
    },"Third")
    .to(DogModel.current.scene.rotation,{
      y:`-=${Math.PI/0.98}`,
      x:`+=${Math.PI/15}`
    },"Third")
    .to(DogModel.current.scene.position,{
      x:"-=0.4"
    },"Third")


  }, []);

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.2, -0.58, -0.1]}
        rotation={[0, Math.PI / 4.1, 0]}
      />
      {/* <directionalLight intensity={1000} position={[0, 3, 3]} /> */}

      {/* <OrbitControls /> */}
    </>
  );
};

export default Dog;
