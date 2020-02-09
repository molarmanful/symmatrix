import Env from './env.js'
import {Cell, Plant} from './cell.js'

window.ENV = new Env(out, innerWidth, innerHeight)

onload = _=>{
  ENV.add(
    new Plant(ENV, innerWidth / 2, innerHeight / 2, '#00ff00', 3, 10, 1)
  )

  ENV.cells.map(a=> a.display())

  // onkeydown = e=>{
  //   if(e.key == ' '){
  //     ENV.step()
  //   }
  // }

  async function loop(){
    while(true){
      await new Promise(r=> setTimeout(r, 100))
      ENV.step()
    }
  }
  loop()
}
