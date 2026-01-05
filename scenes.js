// scenes.js

// --- Сцена 1: Простой Куб ---
const Scene1 = {
    state: {
        angle: 0,
        dz: 2.5 // Чуть отодвинем, чтобы влезало
    },
    update: function(dt) {
        this.state.angle += (Math.PI * dt / 10);
    },
    draw: function() {
        const { angle, dz } = this.state;
        
        const transformations = [
            (v) => Math3D.translateZ(Math3D.rotateY(v, angle), dz),
        ];

        transformations.forEach(transformFn => {
            drawMesh(CUBE, transformFn);
        });
    }
};


// --- Сцена 2: Пирамида с простым вращением ---
const Scene2 = {
    state: {
        angleX: 0,
        angleY: 0,
        dz: 3.0
    },
    update: function(dt) {
        this.state.angleX += dt * 0.5;
        this.state.angleY += dt * 1.0;
    },
    draw: function() {
        const { angleX, angleY, dz } = this.state;

        // Комбинированное вращение
        const transformFn = (v) => {
            let res = Math3D.rotateX(v, angleX);
            res = Math3D.rotateY(res, angleY);
            res = Math3D.translateZ(res, dz);
            return res;
        };

        drawMesh(PYRAMID, transformFn);
    }
};

// --- Сцена 3: Хаос Куб ---
const Scene3 = {
    state: {
        angle: 0,
        dz: 2.5 // Чуть отодвинем, чтобы влезало
    },
    update: function(dt) {
        this.state.angle += (Math.PI * dt / 20);
    },
    draw: function() {
        const { angle, dz } = this.state;
        
        // Список всех видов вращений, которые мы хотим видеть одновременно
        // Передаем lambda-функцию, которая описывает цепочку превращений для каждой вершины
        const transformations = [
            (v) => Math3D.translateZ(Math3D.rotateY(v, angle), dz),
            (v) => Math3D.translateZ(Math3D.rotateY(v, -angle), dz),
            (v) => Math3D.translateZ(Math3D.rotateX(v, angle), dz),
            (v) => Math3D.translateZ(Math3D.rotateX(v, -angle), dz),
            (v) => Math3D.translateZ(Math3D.rotateZ(v, angle), dz),
            (v) => Math3D.translateZ(Math3D.rotateZ(v, -angle), dz),
        ];

        // Рисуем куб 6 раз с разными трансформациями // ФорЫЧ
        transformations.forEach(transformFn => {
            drawMesh(CUBE, transformFn);
        });
    }
};
