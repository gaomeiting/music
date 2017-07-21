import Vue from "vue";
import Vuex from "vuex";
import * as getters from "./getters";
import * as actions from "./actions";
import state from "./state";
import mutations from "./mutations";
import createLogger from "vuex/dist/logger";


Vue.use(Vuex)
let debug = process.env.NODE_DEV !== 'production'
export default new Vuex.Store({
actions,
getters,
mutations,
state,
strict: debug,
plugins: debug ? [ createLogger() ] : []
})