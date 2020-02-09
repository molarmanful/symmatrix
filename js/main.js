import Env from './env.js'
import {Cell, Plant} from './cell.js'

window.ENV = new Env(out, innerWidth, innerHeight)

onload = _=>{
  ENV.add(
    new Plant(ENV, 0, 0, '#00ff00', 3, 10, 1)
  )

  ENV.cells.map(a=> a.display())

  onkeydown = e=>{
    if(e.key == ' '){
      ENV.step()
    }
  }
  // setInterval(_=>{
  //   ENV.step()
  // }, 1000)
}
