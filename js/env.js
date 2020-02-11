import {Cell, Animal, Plant} from './cell.js'

class Env {
  constructor(canvas, width = 100, height = 100){
    this.ctx = canvas.getContext('2d')
    this.width = canvas.width = width
    this.height = canvas.height = height
    this.cells = []
    this.id = 0
  }

  add(...cells){
    cells.map(cell=>{
      if(cell){
        if(cell.id == undefined){
          cell.id = this.id++
        }
        if(!this.cells.length) this.cells.push(cell)
        else {
          let i = this.cells.findIndex(a=> a.energy < cell.energy)
          if(i < 0) this.cells.push(cell)
          else this.cells.splice(i, 0, cell)
        }
      }
    })
  }

  gen(n, cells){
    let xs = Array.from(Array(this.width).keys())
    let ys = Array.from(Array(this.height).keys())
    let total = cells.reduce((a, b)=> a + b[0], 0)
    Array.from(Array(n), _=>{
      let x = Cell.randpick(xs)
      let y = Cell.randpick(ys)
      let pick = Cell.randpick(cells.flatMap(a=>
        Array(a[0]).fill(a.slice(1))
      ))
      let cell = new pick[0](this, x, y, pick[1])
      this.add(cell)
      xs.splice(xs.indexOf(x), 1)
      ys.splice(ys.indexOf(y), 1)
    })
  }

  step(){
    this.clearall()
    this.cells.map(cell=>{
      let i = this.indatid(cell.id)
      if(~i){
        if(cell.life > 0 && cell.energy > 0){
          cell.act()
          this.add(this.cells.splice(i, 1)[0])
        }
        else {
          this.cells.splice(i, 1)
        }
      }
    })
    this.cells.map(cell=> cell.display())
  }

  getpx(x, y){
    return this.ctx.getImageData(x, y, 1, 1).data
  }

  setpx(x, y, color, alpha){
    this.ctx.fillStyle = color
    this.ctx.globalAlpha = alpha
    this.ctx.fillRect(x, y, 1, 1)
  }

  clearpx(x, y){
    this.ctx.clearRect(x, y, 1, 1)
  }

  clearall(){
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  indatpos(x, y){
    return this.cells.findIndex(cell=> cell.x == x && cell.y == y)
  }

  indatid(id){
    return this.cells.findIndex(a=> a.id == id)
  }

  delid(id){
    let i = this.indatid(id)
    if(~i){
      this.cells.splice(i, 1)
    }
  }
}

export default Env
