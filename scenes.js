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
        drawProgress: 0,
        speed: 0.2,
        dz: 4.0 // Камеру чуть дальше, так как разнос может быть большим
    },
    
    // Получаем элементы управления один раз (или можно искать их каждый кадр, но это медленнее)
    inputs: {
        offset: document.getElementById('input-offset'),
        radius: document.getElementById('input-radius'),
        arc: document.getElementById('input-arc'),
        // Элементы для отображения цифр
        lblOffset: document.getElementById('val-offset'),
        lblRadius: document.getElementById('val-radius'),
        lblArc: document.getElementById('val-arc'),
    },

    update: function(dt) {
        // Обновляем цифры в UI (чтобы пользователь видел значение)
        if(this.inputs.offset) {
            this.inputs.lblOffset.innerText = this.inputs.offset.value;
            this.inputs.lblRadius.innerText = this.inputs.radius.value;
            this.inputs.lblArc.innerText = this.inputs.arc.value;
        }

        // Анимация прогресса отрисовки
        this.state.drawProgress += dt * this.state.speed;
        if (this.state.drawProgress > 1.6) {
            this.state.drawProgress = 0;
        }
    },

    draw: function() {
        const { drawProgress, dz } = this.state;
        
        // 1. Считываем текущие настройки слайдеров
        const offset = parseFloat(this.inputs.offset.value);
        const radius = parseFloat(this.inputs.radius.value);
        const arcDeg = parseFloat(this.inputs.arc.value);

        // 2. Генерируем фигуру на лету!
        const fullShape = generateVoynichDynamic(offset, radius, arcDeg);

        // 3. Отключаем вращение (оставляем только сдвиг по Z, чтобы видеть фигуру)
        const transformFn = (v) => {
            return Math3D.translateZ(v, dz);
        };

        // 4. Логика частичной отрисовки (как и раньше)
        const totalPoints = fullShape.fs[0].length; 
        const visibleCount = Math.max(2, Math.floor(totalPoints * Math.min(1, drawProgress)));
        const partialPath = fullShape.fs[0].slice(0, visibleCount);
        
        const partialShape = {
            vs: fullShape.vs,
            fs: [partialPath]
        };

        ctx.strokeStyle = "#FFD700"; 
        drawMesh(partialShape, transformFn);
    }
};