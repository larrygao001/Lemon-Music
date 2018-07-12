import {createStore} from "redux"
import reducer from "./reducers"

 //Create store
const store = createStore(reducer);
export default store