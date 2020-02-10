class Cell {
  constructor(env, x, y, opts){
    this.env = env
    this.x = x
    this.y = y
    this.type = opts.type
    this.energy = 1
    this.benergy = opts.energy
    this.life = opts.life
    this.blife = opts.life
    this.eff = opts.eff
    this.sight = opts.sight
  }

  display(){
    let opacity = this.energy / this.benergy
    this.env.setpx(this.x, this.y, this.type, opacity > 1 ? 1 : opacity)
  }

  act(){
    this.life -= 1
    this.display()
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
            nb.push({
              x: xi,
              y: yj,
              cell: this.env.cells[this.env.indatpos(xi, yj)]
            })
          }
        }
      }
    }
    return nb
  }

  static randpick(xs){
    return xs.length ? xs[0 | Math.random() * xs.length] : {}
  }

  static dist(x1, y1, x2, y2){
    return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** .5
  }

  near(xs){
    return xs.sort((a, b)=>
      Cell.dist(this.x, this.y, a.x, a.y) - Cell.dist(this.x, this.y, b.x, b.y)
    )
  }

  randempty(){
    return Cell.randpick(this.neighbors.filter(nb=> !nb.cell))
  }

  randnb(){
    return Cell.randpick(this.neighbors.filter(nb=> nb.cell))
  }

  randmove(){
    let empty = this.randempty()
    if(Object.keys(empty).length){
      this.x = empty.x
      this.y = empty.y
    }
    this.energy -= this.eff
  }

  dup(){}
}

class Plant extends Cell {
  constructor(env, x, y, opts){
    super(env, x, y, opts)
  }

  display(){
    let opacity = this.energy / (this.benergy * 2)
    this.env.setpx(this.x, this.y, this.type, opacity > 1 ? 1 : opacity)
  }

  act(){
    this.energy += this.eff
    if(this.energy >= 2 * this.benergy) this.dup()
    super.act()
  }

  dup(){
    let empty = this.randempty()
    if(Object.keys(empty).length){
      this.energy -= this.benergy
      this.env.add(new this.constructor(this.env, empty.x, empty.y, {
        type: this.type,
        energy: this.benergy,
        life: this.blife,
        eff: this.eff
      }))
    }
  }
}

class Animal extends Cell {
  constructor(env, x, y, opts){
    super(env, x, y, opts)
    this.energy = this.benergy
  }

  act(){
    let mate = this.randmate().cell
    let food = this.randfood().cell
    if(mate && this.energy >= this.benergy) this.dup(mate.id)
    else if(food) this.eat(food.id)
    else if(this.energy > this.eff) this.randmove()
    else this.energy = 0
    super.act()
  }

  randfood(){
    return Cell.randpick(
      this.neighbors.filter(nb=>
        nb.cell && nb.cell.type != this.type && nb.cell.energy > 0
      )
    )
  }

  nearestfood(){
    return Cell.near(
      this.env.cells.filter(cell=>
        cell.type != this.type && cell.energy > 0
      )[0]
    )
  }

  randmate(){
    return Cell.randpick(
      this.neighbors.filter(nb=>
        nb.cell && nb.cell.type == this.type && nb.cell.energy >= nb.cell.benergy
      )
    )
  }

  nearestmate(){
    return Cell.near(
      this.env.cells.filter(cell=>
        cell.type == this.type && cell.energy >= cell.benergy
      )[0]
    )
  }

  eat(id){
    let food = this.env.cells[this.env.indatid(id)]
    if(food.energy < this.eff){
      this.energy += food.energy
      food.energy = 0
    }
    else {
      this.energy += this.eff
      food.energy -= this.eff
    }
  }

  breakfood(){}

  dup(id){
    let mate = this.env.cells[this.env.indatid(id)]
    let empty = this.randempty()
    if(Object.keys(empty).length){
      this.energy -= this.benergy
      mate.energy -= mate.benergy
      this.env.add(new this.constructor(this.env, empty.x, empty.y, {
        type: this.type,
        energy: this.benergy,
        life: this.blife,
        eff: this.eff
      }))
    }
  }
}

export {Cell, Plant, Animal}
