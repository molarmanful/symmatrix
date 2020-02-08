class Env {
  constructor(canvas, width = 100, height = 100){
    this.ctx = canvas.getContext('2d')
    this.width = canvas.width = width
    this.height = canvas.height = height
    this.cells = []
  }

  init(cells){
    this.cells = cells
  }

  step(){
    
  }

  getpx(x, y){
    return this.ctx.getImageData(x, y, 1, 1).data
  }

  setpx(x, y, cell){
    
  }
}

export default Env
