import axios from 'axios'
import api from './api'

export default {
  init(window) {
    global.api = api
    global.win = window
    global.clientApi = axios
  }
}