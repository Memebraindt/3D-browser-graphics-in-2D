const BACKGROUNDCOLOR = "#101010"
const FOREGROUNDCOLOR = "#50FF50"
const POINTSIZE = 20
const LINEWIDTH = 3

console.log(game)
game.width = 800
game.height = 800
const ctx = game.getContext("2d")
console.log(ctx)

function clear() {
    ctx.fillStyle = BACKGROUNDCOLOR
    ctx.fillRect(0, 0, game.width, game.height)
}

function point({x, y}, s){
    ctx.fillStyle = FOREGROUNDCOLOR
    ctx.fillRect(x - s/2, y - s/2, s, s)
}

function line(p1, p2) {
    ctx.lineWidth = LINEWIDTH
    ctx.strokeStyle = FOREGROUNDCOLOR
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function screen(p){
    return {
            x: (p.x + 1)/2*game.width,
            y: (1 - (p.y + 1)/2)*game.height,
        }
}

function project({x, y, z}) {
    return {
        x: x/z,
        y: y/z,
    }
}

const FPS = 60;

function translate_z({x, y, z}, dz) {
    return {x, y, z: z + dz};
}

function rotate_x_to_z({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x*c - z*s,
        y,
        z: x*s + z*c,
    };
}

function rotate_y_to_z({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x,
        y: y*c - z*s,
        z: y*s + z*c,
    };
}

function rotate_x_to_y({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x*c - y*s,
        y: x*s + y*c,
        z,
    };
}


let dz = 1.0;
let angle = 0;
clear()

function frame() {
    const dt = 1/FPS;
    // dz -= 1*dt;
    angle += (Math.PI*dt/20);
    clear()
    for (const v of vs) {
        point(screen(project(translate_z(rotate_x_to_z(v, angle), dz))), POINTSIZE)
    }
    for (const f of fs) {
        for (let i = 0; i < f.length; ++i) {
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            line(screen(project(translate_z(rotate_x_to_z(a, angle), dz))),
                 screen(project(translate_z(rotate_x_to_z(b, angle), dz))))

            line(screen(project(translate_z(rotate_x_to_z(a, -angle), dz))),
                 screen(project(translate_z(rotate_x_to_z(b, -angle), dz))))


            line(screen(project(translate_z(rotate_y_to_z(a, angle), dz))),
                 screen(project(translate_z(rotate_y_to_z(b, angle), dz))))

            line(screen(project(translate_z(rotate_y_to_z(a, -angle), dz))),
                 screen(project(translate_z(rotate_y_to_z(b, -angle), dz))))

            
            line(screen(project(translate_z(rotate_x_to_y(a, angle), dz))),
                 screen(project(translate_z(rotate_x_to_y(b, angle), dz))))

            line(screen(project(translate_z(rotate_x_to_y(a, -angle), dz))),
                 screen(project(translate_z(rotate_x_to_y(b, -angle), dz))))
        }
    }
    setTimeout(frame, 1000/FPS);
}
setTimeout(frame, 1000/FPS);
