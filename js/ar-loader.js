// ar-loader.js для MindAR
window.arLoader = (function() {
    let currentController = null;

    async function loadTarget(targetId, baseUrl) {
        try {
            // Загружаем data.json
            const response = await fetch(baseUrl + 'data.json?' + Date.now());
            const data = await response.json();

            const targetInfo = data.targets.find(t => t.id == targetId);
            if (!targetInfo) {
                throw new Error('Точка с id ' + targetId + ' не найдена');
            }

            // Полный URL изображения-триггера
            const targetImageUrl = baseUrl + targetInfo.image;

            // Показываем индикатор загрузки компиляции
            const loadingEl = document.getElementById('loading');
            loadingEl.innerText = 'Компилируем изображение...';

            // Инициализируем MindAR
            // @ts-ignore (MindAR будет доступен глобально)
            const MindAR = window.MindARImage;
            const controller = new MindAR({
                imageTargets: [ targetImageUrl ], // массив целей
                filterMinCF: 0.75, // порог уверенности
                filterBeta: 1000
            });

            currentController = controller;

            // Получаем HTML-элемент, куда будет выводиться видео
            const videoContainer = document.getElementById('camera-placeholder');
            controller.on('ready', () => {
                loadingEl.style.display = 'none'; // убираем загрузку
            });

            controller.on('targetFound', () => {
                const messageEl = document.getElementById('message');
                messageEl.innerText = targetInfo.message || '❤️';
                messageEl.style.display = 'block';
            });

            controller.on('targetLost', () => {
                document.getElementById('message').style.display = 'none';
            });

            // Запускаем
            await controller.start(videoContainer);

        } catch (e) {
            console.error(e);
            document.getElementById('loading').innerText = 'Ошибка: ' + e.message;
        }
    }

    return {
        loadTarget: loadTarget
    };
})();