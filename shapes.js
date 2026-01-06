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

function generateVoynichShape() {
    const vs = [];
    const segments = 40; // Детализация одной дуги

    // Вспомогательная функция для добавления дуги
    // cx, cy - центр окружности
    // r - радиус
    // startAngle, endAngle - углы в радианах
    function addArc(cx, cy, r, startAngle, endAngle) {
        for (let i = 0; i <= segments; i++) {
            const theta = startAngle + (endAngle - startAngle) * (i / segments);
            vs.push({
                x: cx + Math.cos(theta) * r,
                y: cy + Math.sin(theta) * r,
                z: 0 // Фигура плоская, но мы будем её вращать
            });
        }
    }

    // 1. Левая полуокружность (выгнута влево)
    // Центр (-1, 0), идет от y=1 до y=-1
    addArc(-1.11, 0, 1, 5 * Math.PI / 2, 3 * Math.PI / 2);

    // 2. Нижняя полуокружность (выгнута вниз)
    // Центр (0, -1), идет от x=-1 до x=1
    addArc(0, -1.11, 1, Math.PI, 0);

    // 3. Правая полуокружность (выгнута вправо)
    // Центр (1, 0), идет от y=-1 до y=1
    addArc(1.11, 0, 1, 3 * Math.PI / 2, Math.PI / 2);

    // 4. Верхняя полуокружность (выгнута вверх)
    // Центр (0, 1), идет от x=1 до x=-1
    addArc(0, 1.11, 1, 2 * Math.PI, Math.PI);

    // Формируем грани (faces). Так как это одна сплошная линия,
    // мы просто соединяем точку 0 с 1, 1 с 2 и т.д.
    const path = [];
    for (let i = 0; i < vs.length; i++) {
        path.push(i);
    }
    
    // Возвращаем объект фигуры. fs - это массив массивов, здесь один длинный путь
    return { vs, fs: [path] };
}

const VOYNICH_SHAPE = generateVoynichShape();