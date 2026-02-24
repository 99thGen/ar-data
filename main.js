// main.js
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
      // Скрываем загрузку и кнопку
      loadingScreen.style.display = "none";
      startButton.style.display = "none";

      const container = document.getElementById("ar-container");
      if (!container) throw new Error("Контейнер AR не найден");

      // Проверяем, что библиотека загрузилась правильно
      if (!window.MINDAR?.IMAGE?.MindARThree) {
        throw new Error("MindARThree не загружен. Проверь подключение скрипта.");
      }

      const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: container,
        imageTargetSrc: "https://99thgen.github.io/ar-data/targets/target1.mind",
        maxTrack: 1,
      });

      const { renderer, scene, camera } = mindarThree;

      // Добавляем якорь для первой цели (индекс 0)
      const anchor = mindarThree.addAnchor(0);

      // Загружаем картинку, которая появится поверх таргета
      const textureLoader = new THREE.TextureLoader();
      const texture = await textureLoader.load("https://99thgen.github.io/ar-data/assets/overlay.png");

      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0); // немного приподнимем над поверхностью

      anchor.group.add(plane);

      // Запускаем MindAR
      await mindarThree.start();
      
      // Запускаем анимацию рендеринга
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });

    } catch (error) {
      showError(error.message);
      // Вернём кнопку, чтобы можно было попробовать снова
      startButton.style.display = "block";
      loadingScreen.style.display = "flex";
    }
  });
});
