import Env from './env.js'
import {Cell, Plant, Animal} from './cell.js'

window.ENV = new Env(out, innerWidth, innerHeight)

onload = _=>{
  ENV.add(
    new Plant(ENV, 0 | innerWidth / 2, 0 | innerHeight / 2, '#00ff00', 3, 10, 1),
    new Plant(ENV, 0 | innerWidth / 2 - 4, 0 | innerHeight / 2 - 4, '#00ff00', 3, 10, 1),
    new Plant(ENV, 0 | innerWidth / 2 + 4, 0 | innerHeight / 2 - 4, '#00ff00', 3, 10, 1),
    new Plant(ENV, 0 | innerWidth / 2 - 4, 0 | innerHeight / 2 + 4, '#00ff00', 3, 10, 1),
    new Plant(ENV, 0 | innerWidth / 2 + 4, 0 | innerHeight / 2 + 4, '#00ff00', 3, 10, 1),
    new Animal(ENV, 0 | innerWidth / 2 + 4, 0 | innerHeight / 2, '#ff0000', 20, 100, 1),
    new Animal(ENV, 0 | innerWidth / 2 - 4, 0 | innerHeight / 2, '#ff0000', 20, 100, 1),
    new Animal(ENV, 0 | innerWidth / 2, 0 | innerHeight / 2 + 4, '#ff0000', 20, 100, 1),
    new Animal(ENV, 0 | innerWidth / 2, 0 | innerHeight / 2 - 4, '#ff0000', 20, 100, 1)
  )

  ENV.cells.map(a=> a.display())

  let play = false
  async function loop(){
    while(play){
      await new Promise(r=> setTimeout(r, 100))
      ENV.step()
    }
  }

  onkeydown = e=>{
    if(e.key == ' '){
      play = !play
      if(play) loop(play)
      //ENV.step()
    }
  }
}
