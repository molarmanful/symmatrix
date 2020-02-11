import Env from './env.js'
import {Cell, Plant, Animal} from './cell.js'

let w = 50
let h = 50

let presets = {}
presets.empty = [200]
presets.plant =
  [50, Plant, {
    type: '#00ff00',
    energy: 4,
    life: 12,
    eff: 2
  }],
presets.herb =
  [10, Animal, {
    type: '#0000ff',
    energy: 8,
    life: 40,
    eff: 2,
    sight: 10,
    prey: [presets.plant[2].type],
    destr: [presets.plant[2].type]
  }],
presets.carn =
  [1, Animal, {
    type: '#ff0000',
    energy: 24,
    life: 72,
    eff: 1,
    sight: 20,
    prey: [presets.herb[2].type],
    destr: [presets.herb[2].type, presets.plant[2].type]
  }]

window.ENV = new Env(out, w, h)

onload = _=>{
  ENV.gen(50, Object.keys(presets).map(a=> presets[a]))

  for(let i in presets){
    pre.innerHTML += `<option>${i}</option>`
  }

  ENV.display()

  let play = false
  let loop = async _=>{
    if(play){
      await ENV.step()
      requestAnimationFrame(loop)
    }
  }

  onkeydown = e=>{
    if(e.key == ' '){
      play = !play
      if(play) requestAnimationFrame(loop)
      // ENV.step()
    }
  }

  out.onclick = e=>{
    let x = e.x - out.offsetLeft
    let y = e.y - out.offsetTop
    ENV.cells.map(cell=>{
      if(cell.x == x && cell.y == y) ENV.delid(cell.id)
    })
    let preset = presets[pre.value].slice(1)
    if(preset.length) ENV.add(new preset[0](ENV, x, y, preset[1]))
    ENV.clearall()
    ENV.display()
  }
}
