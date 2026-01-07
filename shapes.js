// shapes.js

const CUBE = {
    vs: [
        {x:-1, y:-1, z:-1}, {x: 1, y:-1, z:-1},
        {x: 1, y: 1, z:-1}, {x:-1, y: 1, z:-1},
        {x:-1, y:-1, z: 1}, {x: 1, y:-1, z: 1},
        {x: 1, y: 1, z: 1}, {x:-1, y: 1, z: 1},
    ],
    fs: [
        [0,1,2,3], [4,5,6,7], [0,1,5,4],
        [1,2,6,5], [2,3,7,6], [3,0,4,7]
    ]
};

const PYRAMID = {
    vs: [
        {x: 0, y: 1, z: 0},   // Вершина
        {x:-1, y:-1, z:-1},   // Основание...
        {x: 1, y:-1, z:-1},
        {x: 1, y:-1, z: 1},
        {x:-1, y:-1, z: 1}
    ],
    fs: [
        [1, 2, 3, 4], // Основание
        [0, 1, 2],    // Боковые грани
        [0, 2, 3],
        [0, 3, 4],
        [0, 4, 1]
    ]
};

/**
 * Генерирует фигуру Войнича динамически
 * @param {number} offset - Смещение центров дуг от начала координат
 * @param {number} radius - Радиус каждой дуги
 * @param {number} arcDegrees - Длина дуги в градусах (180 = полуокружность)
 */

function generateVoynichDynamic(offset, radius, arcDegrees) {
    const vs = [];
    const segments = 40; 
    
    // Переводим градусы размаха дуги в радианы
    const spread = arcDegrees * (Math.PI / 180); 
    const halfSpread = spread / 2;

    function addArc(cx, cy, r, centerAngle) {
        // centerAngle - это угол, куда "смотрит" горб дуги
        // Start и End считаем от центрального угла +/- половина размаха
        // Обратите внимание: порядок start/end определяет направление рисования
        // Чтобы сохранить направление рисования как у вас было (против часовой или по часовой),
        // нужно аккуратно задать знаки.
        
        // Для вашей логики рисования (чтобы линия шла последовательно),
        // нам нужно определить start и end так, чтобы конец одной дуги был близок к началу другой.
        
        // Левая дуга (центр слева, горб влево). Базовый угол PI (180 deg)
        // Нижняя дуга (центр снизу, горб вниз). Базовый угол 1.5 PI (270 deg)
        // Правая дуга (центр справа, горб вправо). Базовый угол 0 (0 deg)
        // Верхняя дуга (центр сверху, горб вверх). Базовый угол 0.5 PI (90 deg)

        const start = centerAngle + halfSpread;
        const end = centerAngle - halfSpread;

        for (let i = 0; i <= segments; i++) {
            const theta = start + (end - start) * (i / segments);
            vs.push({
                x: cx + Math.cos(theta) * r,
                y: cy + Math.sin(theta) * r,
                z: 0 
            });
        }
    }

    // 1. Левая (смещена влево по X)
    // Горб смотрит влево (PI)
    addArc(-offset, 0, radius, Math.PI);

    // 2. Нижняя (смещена вниз по Y)
    // Горб смотрит вниз (3/2 PI)
    addArc(0, -offset, radius, 3 * Math.PI / 2);

    // 3. Правая (смещена вправо по X)
    // Горб смотрит вправо (0)
    addArc(offset, 0, radius, 0);

    // 4. Верхняя (смещена вверх по Y)
    // Горб смотрит вверх (PI/2)
    addArc(0, offset, radius, Math.PI / 2);

    const path = [];
    for (let i = 0; i < vs.length; i++) {
        path.push(i);
    }
    
    return { vs, fs: [path] };
}