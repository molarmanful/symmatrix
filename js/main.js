import Env from './env.js'
import Cell from './cell.js'

onload = _=>{
  let ENV = new Env(out)
  ENV.init()
  setInterval(_=>{
    ENV.step()
  }, 100)
}
