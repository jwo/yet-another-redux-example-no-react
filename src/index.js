import {createStore, combineReducers} from 'redux'

const validUsername = "jwo"
const validPassword = "12345678"

function launchCodesReducer(state="01234", action){
  return state;
}

function userReducer(state={}, action){
  if (action.type === 'LOGIN'){
    // state.username = action.user.username
    return action.user
  } else if (action.type === 'LOGOUT'){
    return {}
  }
  return state;
}

function appetizersReducer(state=[], action){
  if (action.type === 'RECEIVE_APPETIZERS') {
    const appetizers = []
    for (var i = 0; i < action.appetizers.length; i++) {
      const price = parseFloat(action.appetizers[i].price, 10)
      if (price <= 5) {
        appetizers.push(action.appetizers[i])
      }
    }

    return appetizers;
  }
  return state;
}

function loadingReducer(state=false, action){
  if (action.type === 'START_FETCH'){
    return true
  } else if (action.type === 'END_FETCH'){
    return false;
  }
  return state;
}

// reducer
// createStore (passing it the reducer)
const reducer = combineReducers({
  user: userReducer,
  launchCodes: launchCodesReducer,
  appetizers: appetizersReducer,
  loading: loadingReducer
})
const store = createStore(reducer)

// subscribes to an update
store.subscribe( () => {
  console.log(store.getState())
  render()
})

function handleSignOut(){
  store.dispatch({type: 'LOGOUT'})
}

function fetchAppetizers(){
  store.dispatch({type: 'START_FETCH'})
  fetch("http://tiny-lasagna-server.herokuapp.com/collections/reactthaimenu/5976af4df10cc80004c1bfe4")
  .then( r => r.json() )
  .then( json => {
    const appetizers = json.Appetizers;
    // this.setState({appetizers: appetizers})
    store.dispatch({type: 'RECEIVE_APPETIZERS', appetizers: appetizers})
    store.dispatch({type: 'END_FETCH'})
  })
}
function handleFormSubmission(event){
  event.preventDefault();
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  if ((username === validUsername) && (password === validPassword)){
    store.dispatch({type: 'LOGIN', user: {username}})

    fetchAppetizers()

  } else {
    alert("SORRY YO")
  }

}

function render(){
  const main = document.querySelector("#main");
  const state = store.getState()
  if (state.user.username){
    let html = `
      <h1>LAUNCH CODE: ${state.launchCodes}</h1>
      <button class="sign-out">Sign Out</button>

      <h2>CHEAP APPETIZERS</h2>
      ${state.appetizers.map( a => {
        return `<h3>${a.dish} : ${a.price}</h3>`
      }).join(' ')}

    `

    if (state.loading === true){
      html = html += `<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...`
    }

    main.textContent = ''
    main.insertAdjacentHTML('beforeEnd', html)
    document.querySelector("button.sign-out").addEventListener('click', handleSignOut)


  } else {

    const html = `
      <form>
        <div>
          <input type='text' id='username' placeholder="USERNAME">
        </div>

        <div>
          <input type='password' id='password' placeholder="SECURE PASSWORD">
        </div>

        <div>
          <input type='submit' value="SECURELY LOGIN">
        </div>

      </form>
    `
    main.textContent = ''
    main.insertAdjacentHTML('beforeEnd', html)
    document.querySelector("form").addEventListener('submit', handleFormSubmission)
  }
}

// dispatches actions
store.dispatch({type: "@@INIT"})
