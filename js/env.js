import {Cell, Animal, Plant} from './cell.js'

class Env {
  constructor(canvas, width = 100, height = 100){
    this.ctx = canvas.getContext('2d')
    this.width = canvas.width = width
    this.height = canvas.height = height
    this.cells = []
    this.id = 0
  }

  display(){
    return Promise.all(this.cells.map(async cell=>{
      cell.display()
    }))
  }

  add(...cells){
    cells.map(cell=>{
      if(cell){
        if(cell.id == undefined){
          cell.id = this.id++
        }
        let i = this.cells.findIndex(a=> cell.energy <= a.energy)
        if(~i) this.cells.splice(i, 0, cell)
        else this.cells.push(cell)
      }
    })
  }

  gen(n, cells){
    Array.from(Array(this.width), (_, x)=>{
      Array.from(Array(this.height), (_, y)=>{
        let pick = Cell.randpick(cells.flatMap(a=>
          Array(a[0]).fill(a.slice(1))
        ))
        if(pick.length) this.add(new pick[0](this, x, y, pick[1]))
      })
    })
  }

  step(){
    this.clearall()
    this.cells.map(cell=>{
      let i = this.indatid(cell.id)
      if(~i){
        if(cell.life > 0 && cell.energy > 0){
          cell.act()
          this.add(...this.cells.splice(this.indatid(cell.id), 1))
        }
        else {
          this.cells.splice(i, 1)
        }
      }
    })
    this.display()
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
