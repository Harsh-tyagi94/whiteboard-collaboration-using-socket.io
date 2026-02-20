const canvas = document.getElementById('canvas')

canvas.width = 0.96*window.innerWidth
canvas.height = 0.96*window.innerHeight

var io = io.connect('http://localhost:3000/')

const ctx = canvas.getContext('2d')

let x,y;
let mouse_press = false;

window.onmousedown = (e) => {
    ctx.moveTo(x, y)
    io.emit('down', {x, y})
    mouse_press = true
}

window.onmouseup = (e) => {
    mouse_press = false
}

io.on('ondraw', ({x, y}) => {
    ctx.lineTo(x, y)
    ctx.strokeStyle = "brown"
    ctx.lineWidth = 4
    ctx.stroke()
})

io.on('ondown', ({x,y}) => {
    ctx.moveTo(x, y)
})

window.onmousemove = (e) => {
    x = e.clientX
    y = e.clientY

    if(mouse_press) {
        io.emit('draw', {x, y})
        ctx.lineTo(x, y)
        ctx.strokeStyle = "brown"
        ctx.lineWidth = 4
        ctx.stroke()
    }
}