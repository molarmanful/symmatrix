class Cell {
  constructor(env, type, x, y){
    this.env = env
    this.type = type
    this.x = x
    this.y = y
  }

  act(){
    
  }

  get neighbors(){
    let g = this.env.getpx
    let x = this.x
    let y = this.y
    return [
      g(x - 1, y - 1), g(x, y - 1), g(x + 1, y - 1),
      g(x - 1, y    ),              g(x + 1, y    ),
      g(x - 1, y + 1), g(x, y + 1), g(x + 1, y + 1)
    ].filter(a=> a.some(aa=> aa > 0))
  }
}

export default Cell
