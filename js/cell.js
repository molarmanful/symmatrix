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
    this.prey = opts.prey
    this.destr = opts.destr
  }

  display(){
    this.env.setpx(this.x, this.y, this.type, Math.min(this.energy / this.benergy, 1))
  }

  act(){
    this.life--
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

  near(xs, x, y){
    return xs.filter(a=>{
      let dist = Cell.dist(this.x, this.y, a.x, a.y)
      return dist <= this.sight && dist > 0
    }).sort((a, b)=>
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
    if(Object.keys(empty).length) this.move(empty.x, empty.y)
  }

  nearmove(x, y){
    let empties = this.neighbors.filter(nb=> !nb.cell)
    if(empties.length){
      let nempty = empties.sort((a, b)=>
        Cell.dist(x, y, a.x, a.y) - Cell.dist(x, y, b.x, b.y)
      )[0]
      this.move(nempty.x, nempty.y)
    }
  }

  move(x, y){
    this.x = x
    this.y = y
    this.energy -= this.eff
  }

  dup(){}
}

class Plant extends Cell {
  constructor(env, x, y, opts){
    super(env, x, y, opts)
  }

  display(){
    this.env.setpx(this.x, this.y, this.type, Math.min(this.energy / (this.benergy * 2), 1))
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
    this.energy = this.benergy - 1
  }

  act(){
    let nmate = this.nearestmate()
    let nfood = this.nearestfood()
    let mate = this.randmate().cell
    let food = this.randfood().cell
    if(food) this.eat(food.id)
    if(this.energy >= this.benergy){
      if(mate) this.dup(mate.id)
      else if(nmate) this.neardestroy(nmate.x, nmate.y)
      else this.randdestroy()
    }
    else if(!food){
      if(nfood) this.neardestroy(nfood.x, nfood.y)
      else this.randmove()
    }
    super.act()
  }

  isfood(cell){
    return !!this.prey.find(type=> type == cell.type)
  }

  randfood(){
    return Cell.randpick(
      this.neighbors.filter(nb=>
        nb.cell && this.isfood(nb.cell) && nb.cell.energy > 0
      )
    )
  }

  nearestfood(){
    return this.near(
      this.env.cells.filter(cell=>
        this.isfood(cell) && cell.energy > 0
      )
    )[0]
  }

  randmate(){
    return Cell.randpick(
      this.neighbors.filter(nb=>
        nb.cell && nb.cell.type == this.type && nb.cell.energy >= nb.cell.benergy
      )
    )
  }

  nearestmate(){
    return this.near(
      this.env.cells.filter(cell=>
        cell.type == this.type && cell.energy >= cell.benergy
      )
    )[0]
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

  destroy(near){
    if(near.cell){
      if(this.isdestr(near.cell)){
        this.energy += Math.min(this.eff, near.cell.energy)
      }
      this.env.delid(near.cell.id)
    }
    this.move(near.x, near.y)
  }

  isdestr(cell){
    return this.destr.find(type=> type == cell.type)
  }

  randdestroy(){
    let near = Cell.randpick(this.neighbors.filter(nb=>
      (nb.cell && this.isdestr(nb.cell) && this.energy >= nb.cell.energy) || !nb.cell
    ))
    if(near) this.destroy(near)
  }

  neardestroy(x, y){
    let near = this.neighbors.filter(nb=>
      (nb.cell && this.isdestr(nb.cell) && this.energy >= nb.cell.energy) || !nb.cell
    ).sort((a, b)=>
      Cell.dist(x, y, a.x, a.y) - Cell.dist(x, y, b.x, b.y)
    )[0]
    if(near) this.destroy(near)
  }

  dup(id){
    let mate = this.env.cells[this.env.indatid(id)]
    let empty = this.randempty()
    if(Object.keys(empty).length){
      this.energy -= 1
      mate.energy -= mate.benergy
      this.env.add(new this.constructor(this.env, empty.x, empty.y, {
        type: this.type,
        energy: this.benergy,
        life: this.blife,
        eff: this.eff,
        sight: this.sight,
        prey: this.prey,
        destr: this.destr
      }))
    }
  }
}

export {Cell, Plant, Animal}
