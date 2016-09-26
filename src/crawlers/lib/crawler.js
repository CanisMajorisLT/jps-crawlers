import Core from './core'
import api from './api'

export default  crawlerName => new Core(crawlerName, api);