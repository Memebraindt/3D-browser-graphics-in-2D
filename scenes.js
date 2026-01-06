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

const Scene4 = {
    state: {
        angle: 0,
        drawProgress: 0, // От 0 до 1 (0% до 100% пути)
        speed: 0.2,      // Скорость рисования
        dz: 3.5          // Отдаление камеры
    },
    update: function(dt) {
        // Медленное вращение для 3D эффекта
        this.state.angle += dt * 0.5;

        // Анимация рисования линии
        // Если прогресс < 1, увеличиваем его. Если >= 1, сбрасываем (зацикливаем для красоты)
        this.state.drawProgress += dt * this.state.speed;
        if (this.state.drawProgress > 1.6) { // 1.2 чтобы была пауза, когда фигура полная
            this.state.drawProgress = 0;
        }
    },
    draw: function() {
        const { angle, drawProgress, dz } = this.state;
        // angle = 0;
        // Трансформация: вращаем и отодвигаем
        const transformFn = (v) => {
            let res = Math3D.rotateY(v, angle); // Вращаем как монету
            res = Math3D.rotateZ(res, Math.sin(angle * 0.5) * 0.2); // Немного покачиваем
            return Math3D.translateZ(res, dz);
        };

        // --- МАГИЯ ОТРИСОВКИ ЧАСТИ ФИГУРЫ ---
        
        // 1. Берем полную фигуру
        const fullShape = VOYNICH_SHAPE;
        
        // 2. Вычисляем, сколько точек нужно нарисовать сейчас
        // Всего точек в пути
        const totalPoints = fullShape.fs[0].length; 
        // Сколько рисуем (минимум 2 точки, максимум все)
        const visibleCount = Math.max(2, Math.floor(totalPoints * Math.min(1, drawProgress)));
        
        // 3. Создаем временную фигуру, у которой путь обрезан
        const partialPath = fullShape.fs[0].slice(0, visibleCount);
        
        const partialShape = {
            vs: fullShape.vs,
            fs: [partialPath] // Передаем только часть пути
        };

        // 4. Рисуем
        // Меняем цвет на золотистый/пергаментный для стиля манускрипта, если хотите
        ctx.strokeStyle = "#FFD700"; 
        drawMesh(partialShape, transformFn);
    }
};