class Cell {
  constructor(env, x, y, type, energy, life){
    this.env = env
    this.x = x
    this.y = y
    this.type = type
    this.energy = 1
    this.benergy = energy
    this.life = life
    this.blife = life
  }

  display(){
    this.env.setpx(this.x, this.y, this.type, this.energy / (this.benergy * 2))
  }

  act(){
    this.life -= 1
  }

  get neighbors(){
    let x = this.x
    let y = this.y
    let nb = []
    for(let i of [-1, 0, 1]){
      let xi = x + i
      if(xi >= 0 && xi < this.env.width){
        for(let j of [-1, 0, 1]){
          let yj = y + j
          if((i || j) && yj >= 0 && yj < this.env.height){
            nb.push({x: xi, y: yj, cell: this.env.findcell(xi, yj)})
          }
        }
      }
    }
    return nb
  }

  findempty(){
    return this.neighbors.find(nb=> !nb.cell)
  }

  move(){}

  dup(){}
}

class Plant extends Cell {
  constructor(env, x, y, type, energy, life, eff){
    super(env, x, y, type, energy, life)
    this.eff = eff
  }

  act(){
    this.energy += this.eff
    if(this.energy >= 2 * this.benergy) this.dup()
    super.act()
    this.display()
  }

  dup(){
    let empty = this.findempty()
    if(empty){
      this.energy -= this.benergy
      this.env.add(new this.constructor(this.env, empty.x, empty.y, this.type, this.benergy, this.blife, this.eff))
    }
  }
}

export {Cell, Plant}
