const startButton = document.getElementById("startButton");
const loadingScreen = document.getElementById("loading");

startButton.addEventListener("click", startAR);

async function startAR() {
  // Скрываем кнопку и экран загрузки
  loadingScreen.style.display = "none";
  startButton.style.display = "none";

  const container = document.getElementById("ar-container");

  // Инициализация MindAR
  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: container,
    imageTargetSrc: "https://99thgen.github.io/ar-data/targets/target1.mind"
  });

  const {renderer, scene, camera} = mindarThree;

  // Привязка overlay к target
  const anchor = mindarThree.addAnchor(0);

  const textureLoader = new THREE.TextureLoader();
  const texture = await textureLoader.load("https://99thgen.github.io/ar-data/assets/overlay.png");

  const geometry = new THREE.PlaneGeometry(1, 1); // Размер overlay
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, 0); // Центр над таргетом

  anchor.group.add(plane);

  // Запуск MindAR
  await mindarThree.start();

  // Анимация
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
