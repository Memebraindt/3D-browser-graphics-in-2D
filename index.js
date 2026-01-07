// index.js

// 1. Ссылки на UI элементы
const trailCheckbox = document.getElementById('trailMode');
const voynichControls = document.getElementById('voynich-controls');

// Глобальные слайдеры
const globalDzInput = document.getElementById('global-dz');
const globalSpeedInput = document.getElementById('global-speed');
const lblGlobalDz = document.getElementById('val-global-dz');
const lblGlobalSpeed = document.getElementById('val-global-speed');

let currentScene = Scene1;

// 2. Управление переключением сцен
function updateUI() {
    // Показываем панель Войнича только для сцены 4
    if (currentScene === Scene4) {
        voynichControls.classList.remove('hidden');
    } else {
        voynichControls.classList.add('hidden');
    }
}

const radios = document.querySelectorAll('input[name="scene"]');
radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'scene1') currentScene = Scene1;
        else if (val === 'scene2') currentScene = Scene2;
        else if (val === 'scene3') currentScene = Scene3;
        else if (val === 'scene4') {
            Scene4.state.drawProgress = 0;
            currentScene = Scene4;
        }
        updateUI();
    });
});

// Инициализация UI
updateUI();

// 3. Главный игровой цикл
function frame() {
    const dt = 1 / CONSTANTS.FPS;

    // --- Чтение глобальных настроек ---
    // Читаем значения слайдеров каждый кадр (или можно через addEventListener)
    const globalParams = {
        dz: parseFloat(globalDzInput.value),
        speed: parseFloat(globalSpeedInput.value)
    };

    // Обновляем цифры в UI
    lblGlobalDz.innerText = globalParams.dz;
    lblGlobalSpeed.innerText = globalParams.speed;


    // --- Логика Шлейфа ---
    const opacity = trailCheckbox && trailCheckbox.checked ? 0.1 : 1.0;
    clearCanvas(opacity);

    // --- Обновление и Отрисовка ---
    if (currentScene) {
        // Передаем глобальные параметры в сцену
        if (currentScene.update) {
            currentScene.update(dt, globalParams);
        }
        
        if (currentScene.draw) {
            // Тонкие линии для режима шлейфа выглядят лучше
            ctx.lineWidth = (trailCheckbox && trailCheckbox.checked) ? 1 : CONSTANTS.LINE_WIDTH;
            
            currentScene.draw(globalParams);
        }
    }

    setTimeout(frame, 1000 / CONSTANTS.FPS);
}

// Старт
frame();