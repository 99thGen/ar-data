// main.js (теперь как модуль)
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const loadingScreen = document.getElementById("loading");
  const errorDiv = document.getElementById("error-message");

  function showError(msg) {
    if (errorDiv) {
      errorDiv.style.display = "block";
      errorDiv.innerText = "❌ " + msg;
    }
    console.error(msg);
  }

  startButton.addEventListener("click", async () => {
    try {
      loadingScreen.style.display = "none";
      startButton.style.display = "none";

      const container = document.getElementById("ar-container");
      if (!container) throw new Error("Контейнер AR не найден");

      // Проверяем, что MindARThree доступен (он должен быть в window.MINDAR)
      if (!window.MINDAR?.IMAGE?.MindARThree) {
        throw new Error("MindARThree не загружен. Проверь подключение скрипта.");
      }

      const MindARThree = window.MINDAR.IMAGE.MindARThree;

      const mindarThree = new MindARThree({
        container: container,
        imageTargetSrc: "https://99thgen.github.io/ar-data/targets/target1.mind",
        maxTrack: 1,
      });

      const { renderer, scene, camera } = mindarThree;

      const anchor = mindarThree.addAnchor(0);

      const textureLoader = new THREE.TextureLoader();
      const texture = await textureLoader.load("https://99thgen.github.io/ar-data/assets/overlay.png");

      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);

      anchor.group.add(plane);

      await mindarThree.start();

      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });

    } catch (error) {
      showError(error.message);
      startButton.style.display = "block";
      loadingScreen.style.display = "flex";
    }
  });
});
