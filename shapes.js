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
        {x: 0, y: 1, z: 0},
        {x:-1, y:-1, z:-1},
        {x: 1, y:-1, z:-1},
        {x: 1, y:-1, z: 1},
        {x:-1, y:-1, z: 1}
    ],
    fs: [
        [1, 2, 3, 4], [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1]
    ]
};

function generateVoynichDynamic(offset, radius, arcDegrees) {
    const vs = [];
    const segments = 40; 
    const spread = arcDegrees * (Math.PI / 180); 
    const halfSpread = spread / 2;

    function addArc(cx, cy, r, centerAngle) {
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
    // Левая, Нижняя, Правая, Верхняя
    addArc(-offset, 0, radius, Math.PI);
    addArc(0, -offset, radius, 3 * Math.PI / 2);
    addArc(offset, 0, radius, 0);
    addArc(0, offset, radius, Math.PI / 2);

    const path = [];
    for (let i = 0; i < vs.length; i++) {
        path.push(i);
    }
    return { vs, fs: [path] };
}