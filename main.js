import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js";

const startButton = document.getElementById("startButton");
const loadingScreen = document.getElementById("loading");

startButton.addEventListener("click", startAR);

async function startAR() {

  loadingScreen.style.display = "none";

  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "./targets/target1.mind",
  });

  const {renderer, scene, camera} = mindarThree;

  const anchor = mindarThree.addAnchor(0);

  const textureLoader = new THREE.TextureLoader();
  const texture = await textureLoader.loadAsync("./assets/overlay.png");

  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });

  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, 0);

  anchor.group.add(plane);

  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}