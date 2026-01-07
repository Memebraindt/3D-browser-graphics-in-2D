// scenes.js

// --- Сцена 1: Куб ---
const Scene1 = {
    state: { angle: 0 },
    update: function(dt, globals) {
        // Используем глобальный множитель скорости
        this.state.angle += (Math.PI * dt / 10) * globals.speed;
    },
    draw: function(globals) {
        const { angle } = this.state;
        const dz = globals.dz; // Берем глобальный Z
        
        drawMesh(CUBE, (v) => Math3D.translateZ(Math3D.rotateY(v, angle), dz));
    }
};

// --- Сцена 2: Пирамида ---
const Scene2 = {
    state: { angleX: 0, angleY: 0 },
    update: function(dt, globals) {
        this.state.angleX += (dt * 0.5) * globals.speed;
        this.state.angleY += (dt * 1.0) * globals.speed;
    },
    draw: function(globals) {
        const { angleX, angleY } = this.state;
        const dz = globals.dz;

        const transformFn = (v) => {
            let res = Math3D.rotateX(v, angleX);
            res = Math3D.rotateY(res, angleY);
            return Math3D.translateZ(res, dz);
        };
        drawMesh(PYRAMID, transformFn);
    }
};

// --- Сцена 3: Хаос Куб ---
const Scene3 = {
    state: { angle: 0 },
    update: function(dt, globals) {
        this.state.angle += (Math.PI * dt / 20) * globals.speed;
    },
    draw: function(globals) {
        const { angle } = this.state;
        const dz = globals.dz;

        const transformations = [
            (v) => Math3D.translateZ(Math3D.rotateY(v, angle), dz),
            (v) => Math3D.translateZ(Math3D.rotateY(v, -angle), dz),
            (v) => Math3D.translateZ(Math3D.rotateX(v, angle), dz),
            (v) => Math3D.translateZ(Math3D.rotateX(v, -angle), dz),
            (v) => Math3D.translateZ(Math3D.rotateZ(v, angle), dz),
            (v) => Math3D.translateZ(Math3D.rotateZ(v, -angle), dz),
        ];

        transformations.forEach(fn => drawMesh(CUBE, fn));
    }
};

// --- Сцена 4: Voynich Shape (Без вращения, динамическая) ---
const Scene4 = {
    state: {
        drawProgress: 0,
        drawSpeed: 0.3 // Скорость анимации отрисовки самой линии
    },
    
    // Элементы управления, специфичные для сцены
    inputs: {
        offset: document.getElementById('input-offset'),
        radius: document.getElementById('input-radius'),
        arc: document.getElementById('input-arc'),
        // Лейблы
        lblOffset: document.getElementById('val-offset'),
        lblRadius: document.getElementById('val-radius'),
        lblArc: document.getElementById('val-arc'),
    },

    update: function(dt, globals) {
        // Обновляем текст в UI
        if(this.inputs.offset) {
            this.inputs.lblOffset.innerText = this.inputs.offset.value;
            this.inputs.lblRadius.innerText = this.inputs.radius.value;
            this.inputs.lblArc.innerText = this.inputs.arc.value;
        }

        // Анимация рисования линии (зависит от внутренней скорости, а не вращения)
        this.state.drawProgress += dt * this.state.drawSpeed;
        if (this.state.drawProgress > 1.6) {
            this.state.drawProgress = 0;
        }
    },

    draw: function(globals) {
        const { drawProgress } = this.state;
        const dz = globals.dz; 

        // 1. Считываем настройки
        const offset = parseFloat(this.inputs.offset.value);
        const radius = parseFloat(this.inputs.radius.value);
        const arcDeg = parseFloat(this.inputs.arc.value);

        // 2. Генерируем
        const fullShape = generateVoynichDynamic(offset, radius, arcDeg);

        // 3. Только сдвиг по Z, без вращения!
        const transformFn = (v) => Math3D.translateZ(v, dz);

        // 4. Частичная отрисовка
        const totalPoints = fullShape.fs[0].length; 
        const visibleCount = Math.max(2, Math.floor(totalPoints * Math.min(1, drawProgress)));
        const partialPath = fullShape.fs[0].slice(0, visibleCount);
        
        // Цвет золотистый
        ctx.strokeStyle = "#FFD700"; 
        drawMesh({ vs: fullShape.vs, fs: [partialPath] }, transformFn);
    }
};