import * as THREE from "three";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000,
);
scene.add(camera);
camera.position.z = 4 ;
/**
 * MESH => is the combination of {Shape & Material}
 */

const newGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
});

/**
 * Now we will create a new cube using the THREE.Mesh(pass geometry , pass material );
 * and add it into the scene..
 */

const cube = new THREE.Mesh(newGeometry, cubeMaterial);
scene.add(cube);

/**
 * Now lets create the light ..
 * and add it to the scene..
 */

const light = new THREE.DirectionalLight(0xFFFFFF,1);
scene.add(light);
light.position.y = 5;
light.position.z = 5
/**
 * Now lets create the renderer 
 * it is used to do the calculation of all the elements in the virtual world
 */


const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight)

document.body.appendChild(renderer.domElement);


function animate(){
    cube.rotation.y += 0.1;
    cube.rotation.x += 0.1;
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);