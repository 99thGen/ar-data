// main.js (усиленная отладка)
document.addEventListener("DOMContentLoaded", () => {
  console.log("main.js: DOM готов");
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
    showError("Кнопка Start не найдена");
    return;
  }

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

      // Проверка наличия MindARThree
      if (!window.MINDAR?.IMAGE?.MindARThree) {
        throw new Error("MindARThree не загружен (проверь import map)");
      }
      console.log("MindARThree доступен");

      const MindARThree = window.MINDAR.IMAGE.MindARThree;

      // Проверка доступности .mind файла (опционально)
      console.log("Загружаем .mind файл:", "https://99thgen.github.io/ar-data/targets/target1.mind");

      const mindarThree = new MindARThree({
        container: container,
        imageTargetSrc: "https://99thgen.github.io/ar-data/targets/target1.mind",
        maxTrack: 1,
      });
      console.log("MindARThree экземпляр создан");

      const { renderer, scene, camera } = mindarThree;
      console.log("Получены renderer, scene, camera");

      const anchor = mindarThree.addAnchor(0);
      console.log("Anchor добавлен");

      // Загрузка оверлея
      console.log("Загружаем overlay.png...");
      const textureLoader = new THREE.TextureLoader();
      const texture = await textureLoader.load("https://99thgen.github.io/ar-data/assets/overlay.png");
      console.log("Overlay загружен");

      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);
      anchor.group.add(plane);
      console.log("Плоскость добавлена в anchor");

      // Запуск
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
      // Возвращаем кнопку на случай ошибки
      startButton.style.display = "block";
      if (loadingScreen) loadingScreen.style.display = "flex";
    }
  });
});
