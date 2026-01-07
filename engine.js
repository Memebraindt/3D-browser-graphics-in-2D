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

const game = document.getElementById("game");
game.width = CONSTANTS.WIDTH;
game.height = CONSTANTS.HEIGHT;
const ctx = game.getContext("2d");

function clearCanvas(opacity = 1.0) {
    ctx.fillStyle = `rgba(16, 16, 16, ${opacity})`;
    ctx.fillRect(0, 0, game.width, game.height);
}

function drawLine(p1, p2, color = CONSTANTS.FOREGROUND) {
    ctx.lineWidth = CONSTANTS.LINE_WIDTH;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function toScreen(p) {
    return {
        x: (p.x + 1) / 2 * game.width,
        y: (1 - (p.y + 1) / 2) * game.height,
    };
}

function project(p) {
    const z = p.z === 0 ? 0.001 : p.z;
    return { x: p.x / z, y: p.y / z };
}

const Math3D = {
    translateZ: ({x, y, z}, dz) => ({x, y, z: z + dz}),
    rotateY: ({x, y, z}, angle) => { 
        const c = Math.cos(angle); const s = Math.sin(angle);
        return { x: x*c - z*s, y, z: x*s + z*c };
    },
    rotateX: ({x, y, z}, angle) => { 
        const c = Math.cos(angle); const s = Math.sin(angle);
        return { x, y: y*c - z*s, z: y*s + z*c };
    },
    rotateZ: ({x, y, z}, angle) => { 
        const c = Math.cos(angle); const s = Math.sin(angle);
        return { x: x*c - y*s, y: x*s + y*c, z };
    }
};

function drawMesh(shape, transformFn) {
    for (const f of shape.fs) {
        for (let i = 0; i < f.length; ++i) {
            const vA = shape.vs[f[i]];
            const vB = shape.vs[f[(i + 1) % f.length]];
            drawLine(toScreen(project(transformFn(vA))), toScreen(project(transformFn(vB))));
        }
    }
}