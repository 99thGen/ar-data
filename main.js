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

      // --- Получаем id из URL ---
      const urlParams = new URLSearchParams(window.location.search);
      const targetId = urlParams.get('id') || '1'; // по умолчанию 1
      console.log("Запрошена точка с id:", targetId);

      // --- Загружаем data.json ---
      const dataUrl = "https://99thgen.github.io/ar-data/data.json?" + Date.now(); // антикеш
      const response = await fetch(dataUrl);
      if (!response.ok) throw new Error("Не удалось загрузить data.json");
      const data = await response.json();
      console.log("data.json загружен");

      // --- Ищем нужную цель ---
      const targetInfo = data.targets.find(t => t.id == targetId);
      if (!targetInfo) throw new Error(`Точка с id ${targetId} не найдена`);

      const mindUrl = "https://99thgen.github.io/ar-data/" + targetInfo.mind;
      const overlayUrl = "https://99thgen.github.io/ar-data/" + targetInfo.image;
      console.log("mind файл:", mindUrl);
      console.log("overlay файл:", overlayUrl);

      // --- Проверяем наличие MindAR ---
      if (!window.MINDAR?.IMAGE?.MindARThree) {
        throw new Error("MindARThree не загружен (проверь import map)");
      }
      console.log("MindARThree доступен");

      const MindARThree = window.MINDAR.IMAGE.MindARThree;

      // ========== НАСТРОЙКИ СТАБИЛЬНОСТИ ==========
      const mindarThree = new MindARThree({
        container: container,
        imageTargetSrc: mindUrl,
        maxTrack: 1,
        filterMinCF: 0.0002,
        filterBeta: 400,
        warmupTolerance: 10,
        missTolerance: 8
      });
      console.log("MindARThree экземпляр создан с настройками стабильности");

      const { renderer, scene, camera } = mindarThree;
      const anchor = mindarThree.addAnchor(0);
      console.log("Anchor добавлен");

      // --- Загружаем оверлей ---
      const img = new Image();
      img.crossOrigin = "Anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Не удалось загрузить оверлей"));
        img.src = overlayUrl;
      });
      console.log("Оверлей загружен, размеры:", img.width, img.height);

      const texture = new THREE.CanvasTexture(img);
      texture.colorSpace = THREE.SRGBColorSpace;

      const aspect = img.width / img.height;
      const geometry = new THREE.PlaneGeometry(1, 1 / aspect);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        toneMapped: false,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);
      anchor.group.add(plane);
      console.log("Плоскость добавлена в anchor с пропорциями", aspect);

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
