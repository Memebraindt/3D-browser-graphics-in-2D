// engine.js

const CONSTANTS = {
    BACKGROUND: "#101010",
    FOREGROUND: "#50FF50",
    POINT_SIZE: 20,
    LINE_WIDTH: 3,
    FPS: 60,
    WIDTH: 800,
    HEIGHT: 800
};

// Настройка Canvas
const game = document.getElementById("game");
game.width = CONSTANTS.WIDTH;
game.height = CONSTANTS.HEIGHT;
const ctx = game.getContext("2d");

// --- Графические функции ---

function clearCanvas(opacity = 1.0) {
    // Если opacity = 1, мы полностью закрашиваем старый кадр (обычный режим)
    // Если opacity = 0.1, мы слегка затемняем старое, создавая шлейф
    
    // Используем rgba(16, 16, 16, opacity) так как BACKGROUND = #101010
    ctx.fillStyle = `rgba(16, 16, 16, ${opacity})`;
    ctx.fillRect(0, 0, game.width, game.height);
}

function drawLine(p1, p2, color = CONSTANTS.FOREGROUND) {
    // Не рисуем линии, если точки ушли за спину наблюдателя (z <= 0 при проекции)
    // Но так как у нас простая проекция, просто рисуем координаты экрана
    ctx.lineWidth = CONSTANTS.LINE_WIDTH;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

// --- Математика и Проекции ---

function toScreen(p) {
    return {
        x: (p.x + 1) / 2 * game.width,
        y: (1 - (p.y + 1) / 2) * game.height,
    };
}

function project(p) {
    // Защита от деления на ноль
    const z = p.z === 0 ? 0.001 : p.z;
    return {
        x: p.x / z,
        y: p.y / z,
    };
}

// Трансформации
const Math3D = {
    translateZ: ({x, y, z}, dz) => ({x, y, z: z + dz}),
    
    rotateY: ({x, y, z}, angle) => { // Бывший rotate_x_to_z (вращение вокруг Y)
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return { x: x*c - z*s, y, z: x*s + z*c };
    },
    
    rotateX: ({x, y, z}, angle) => { // Бывший rotate_y_to_z (вращение вокруг X)
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return { x, y: y*c - z*s, z: y*s + z*c };
    },
    
    rotateZ: ({x, y, z}, angle) => { // Бывший rotate_x_to_y (вращение вокруг Z)
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return { x: x*c - y*s, y: x*s + y*c, z };
    }
};

/**
 * Универсальная функция отрисовки фигуры.
 * @param {Object} shape Объект с vs (вершины) и fs (грани)
 * @param {Function} transformFn Функция, которая принимает вершину и возвращает трансформированную вершину
 */
function drawMesh(shape, transformFn) {
    for (const f of shape.fs) {
        for (let i = 0; i < f.length; ++i) {
            const idxA = f[i];
            const idxB = f[(i + 1) % f.length];
            
            // Берем оригинальные вершины
            const vA = shape.vs[idxA];
            const vB = shape.vs[idxB];

            // Применяем переданную логику трансформации (вращение, сдвиг)
            const transA = transformFn(vA);
            const transB = transformFn(vB);

            // Проецируем и переводим в координаты экрана
            const screenA = toScreen(project(transA));
            const screenB = toScreen(project(transB));

            drawLine(screenA, screenB);
        }
    }
}