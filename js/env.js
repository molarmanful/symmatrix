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
      if(cell.id == undefined){
        cell.id = this.id++
      }
      if(!this.cells.length) this.cells.push(cell)
      else {
        let i = this.cells.findIndex(a=> a.energy < cell.energy)
        if(i < 0) this.cells.push(cell)
        else this.cells.splice(i, 0, cell)
      }
    })
  }

  gen(){}

  step(){
    this.cells.map(cell=>{
      let i = this.cells.findIndex(a=> a.id == cell.id)
      this.clearpx(cell.x, cell.y)
      if(cell.life && cell.energy){
        cell.act()
        this.add(this.cells.splice(i, 1)[0])
      }
      else {
        this.cells.splice(i, 1)
      }
    })
    console.clear()
    console.log(this.cells)
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

  findcell(x, y){
    return this.cells.find(cell=> cell.x == x && cell.y == y)
  }
}

export default Env
