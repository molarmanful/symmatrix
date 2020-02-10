import Env from './env.js'
import {Cell, Plant, Animal} from './cell.js'

let w = 11
let h = 11
window.ENV = new Env(out, w, h)

onload = _=>{
  ENV.add(
    new Plant(ENV, 0 | w / 2, 0 | h / 2, {
      type: '#00ff00',
      energy: 3,
      life: 10,
      eff: 1
    }),
    new Plant(ENV, 0 | w / 2 + 5, 0 | h / 2, {
      type: '#00ff00',
      energy: 3,
      life: 10,
      eff: 1
    }),
    new Plant(ENV, 0 | w / 2 - 5, 0 | h / 2, {
      type: '#00ff00',
      energy: 3,
      life: 10,
      eff: 1
    }),
    new Plant(ENV, 0 | w / 2, 0 | h / 2 + 5, {
      type: '#00ff00',
      energy: 3,
      life: 10,
      eff: 1
    }),
    new Plant(ENV, 0 | w / 2, 0 | h / 2 - 5, {
      type: '#00ff00',
      energy: 3,
      life: 10,
      eff: 1
    }),
    new Animal(ENV, 0 | w / 2 + 5, 0 | h / 2 + 5, {
      type: '#ff0000',
      energy: 20,
      life: 100,
      eff: 1,
      sight: 10
    }),
    new Animal(ENV, 0 | w / 2 + 5, 0 | h / 2 - 5, {
      type: '#ff0000',
      energy: 20,
      life: 100,
      eff: 1,
      sight: 10
    }),
    new Animal(ENV, 0 | w / 2 - 5, 0 | h / 2 + 5, {
      type: '#ff0000',
      energy: 20,
      life: 100,
      eff: 1,
      sight: 10
    }),
    new Animal(ENV, 0 | w / 2 - 5, 0 | h / 2 - 5, {
      type: '#ff0000',
      energy: 20,
      life: 100,
      eff: 1,
      sight: 10
    })
  )

  ENV.cells.map(cell=> cell.display())

  let play = false
  async function loop(){
    while(play){
      await new Promise(r=> setTimeout(r, 100))
      ENV.step()
    }
  }

  onkeydown = e=>{
    if(e.key == ' '){
      // play = !play
      // if(play) loop(play)
      ENV.step()
    }
  }
}
