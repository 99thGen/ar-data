// ar-loader.js (версия для внешнего хостинга)
window.arLoader = (function() {
    let sdk = null;
    
    async function initSDK(targetInfo, apiKey) {
        if (!targetInfo || !apiKey) return;
        
        try {
            // Скрываем загрузку
            setTimeout(() => {
                const loading = document.getElementById('loading');
                if (loading) loading.style.display = 'none';
            }, 1000);
            
            const config = {
                apiKey: apiKey,
                mode: 'image-tracking',
                container: document.getElementById('camera-placeholder'),
                onTargetFound: (targetName) => {
                    console.log('Target found');
                    const messageEl = document.getElementById('message');
                    if (messageEl) {
                        messageEl.innerText = targetInfo.message || '❤️';
                        messageEl.style.display = 'block';
                    }
                },
                onTargetLost: () => {
                    const messageEl = document.getElementById('message');
                    if (messageEl) messageEl.style.display = 'none';
                },
                onError: (error) => {
                    console.error(error);
                }
            };
            
            sdk = new WebARStudio.WebAREngine(config);
            await sdk.addImageTarget(targetInfo.image, targetInfo.id);
            await sdk.start();
        } catch (e) {
            console.error(e);
        }
    }
    
    return {
        initSDK: initSDK
    };
})();