import Env from './env.js'
import {Cell, Plant, Animal} from './cell.js'

let w = 50
let h = 50
window.ENV = new Env(out, w, h)

onload = _=>{
  ENV.gen(100, [
    [3, Plant, {
      type: '#00ff00',
      energy: 4,
      life: 10,
      eff: 2
    }],
    [2, Animal, {
      type: '#0000ff',
      energy: 10,
      life: 40,
      eff: 1,
      sight: 10,
      prey: ['#00ff00'],
      destr: ['#00ff00']
    }],
    [1, Animal, {
      type: '#ff0000',
      energy: 20,
      life: 60,
      eff: 1,
      sight: 50,
      prey: ['#0000ff'],
      destr: ['#0000ff', '#00ff00']
    }]
  ])

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
      play = !play
      if(play) loop(play)
      // ENV.step()
    }
  }

  out.onclick = e=>{
    console.log(e.x, e.y, ENV.cells.filter(cell=> cell.x == e.x - out.offsetLeft && cell.y == e.y - out.offsetTop))
  }
}
