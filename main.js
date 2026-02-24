import * as THREE from 'three';

(function() {
  console.log("main.js: начало выполнения");

  const startButton = document.getElementById("startButton");
  const loadingScreen = document.getElementById("loading");
  const errorDiv = document.getElementById("error-message");

  function showError(msg) {
    console.error("showError:", msg);
    if (errorDiv) {
      errorDiv.style.display = "block";
      errorDiv.innerText = "❌ " + msg;
    }
  }

  if (!startButton) {
    showError("Кнопка Start не найдена. Возможно, страница ещё не загрузилась.");
    return;
  }

  console.log("main.js: кнопка найдена, навешиваем обработчик");

  startButton.addEventListener("click", async () => {
    console.log("Клик по кнопке Start");
    try {
      // Скрываем элементы
      if (loadingScreen) loadingScreen.style.display = "none";
      startButton.style.display = "none";
      console.log("Элементы скрыты");

      const container = document.getElementById("ar-container");
      if (!container) throw new Error("Контейнер AR не найден");
      console.log("Контейнер найден");

      if (!window.MINDAR?.IMAGE?.MindARThree) {
        throw new Error("MindARThree не загружен (проверь import map)");
      }
      console.log("MindARThree доступен");

      const MindARThree = window.MINDAR.IMAGE.MindARThree;

      const mindarThree = new MindARThree({
        container: container,
        imageTargetSrc: "https://99thgen.github.io/ar-data/targets/target1.mind",
        maxTrack: 1,
      });
      console.log("MindARThree экземпляр создан");

      const { renderer, scene, camera } = mindarThree;
      const anchor = mindarThree.addAnchor(0);
      console.log("Anchor добавлен");

      // Используем THREE из импорта
      const textureLoader = new THREE.TextureLoader();
      const texture = await textureLoader.load("https://99thgen.github.io/ar-data/assets/overlay.png");
      console.log("Overlay загружен");

      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);
      anchor.group.add(plane);
      console.log("Плоскость добавлена в anchor");

      console.log("Запускаем mindarThree.start()...");
      await mindarThree.start();
      console.log("start() выполнен успешно");

      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
      console.log("Анимационный цикл запущен");

    } catch (error) {
      showError(error.message);
      console.error("Полная ошибка:", error);
      startButton.style.display = "block";
      if (loadingScreen) loadingScreen.style.display = "flex";
    }
  });

  console.log("main.js: обработчик навешен, ждём клика");
})();
