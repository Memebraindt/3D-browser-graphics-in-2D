// index.js
let currentScene = Scene1;
const voynichControls = document.getElementById('voynich-controls');

// Функция обновления видимости контролов
function updateUI() {
    if (currentScene === Scene4) { // Теперь Scene4 вместо Scene3
        voynichControls.style.display = 'block';
    } else {
        voynichControls.style.display = 'none';
    }
}

const radios = document.querySelectorAll('input[name="scene"]');
radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'scene1') {
            currentScene = Scene1;
        } else if (e.target.value === 'scene2') {
            currentScene = Scene2;
        } else if (e.target.value === 'scene3') {
            currentScene = Scene2;
        } else if (e.target.value === 'scene4') { // Ваша новая сцена
            Scene4.state.drawProgress = 0; 
            currentScene = Scene4;
        }
        updateUI(); // Вызываем при смене
    });
});

// Вызываем один раз при старте
updateUI();

// Игровой цикл
function frame() {
    const dt = 1 / CONSTANTS.FPS;

    // ЛОГИКА ШЛЕЙФА:
    // Если галочка стоит, мы очищаем экран лишь на 10% (0.1), 
    // оставляя 90% предыдущего изображения.
    // Если галочка не стоит, очищаем на 100% (1.0).
    const opacity = trailCheckbox.checked ? 0.1 : 1.0;

    // 1. Очистка (с учетом режима)
    clearCanvas(opacity);

    // 2. Обновление логики текущей сцены
    if (currentScene && currentScene.update) {
        currentScene.update(dt);
    }

    // 3. Отрисовка
    if (currentScene && currentScene.draw) {
        // Небольшой хак: если включен шлейф, можно делать линии тоньше, 
        // чтобы рисунок был более детальным
        ctx.lineWidth = trailCheckbox.checked ? 1 : CONSTANTS.LINE_WIDTH;
        
        currentScene.draw();
    }
    setTimeout(frame, 1000 / CONSTANTS.FPS);
}

// Запуск
frame();