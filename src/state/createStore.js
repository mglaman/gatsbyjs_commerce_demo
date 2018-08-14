import { createStore as reduxCreateStore } from 'redux'

function getCurrentCartData () {
  const currentCart = (typeof localStorage === 'object') ? localStorage.getItem('cartData') : null
  return currentCart ? JSON.parse(currentCart) : []
}

const reducer = (state, action) => {
  if (action.type === `ADD_TO_CART`) {
    // Clone the state.
    const newState = {
      ...state,
    }
    // Combine values and adjust quantity.

    const cartItem = {
      quantity: 1,
      id: action.payload.uuid,
      product: action.payload,
    }
    let existingItemFound = false

    newState.items = newState.items.map((item => {
      if (item.id === cartItem.id) {
        existingItemFound = true
        item.quantity++
      }
      return item
    }))
    if (!existingItemFound) {
      newState.items.push(cartItem)
    }
    localStorage.setItem('cartData', JSON.stringify(newState.items))
    return newState
  }
  else if (action.type === `UPDATE_CART_ITEM`) {
    // Clone the state.
    const newState = {
      ...state,
    }
    const target = action.event.target;
    const orderItem = target.dataset.orderItem;
    const quantity = parseInt(target.value) || 0;

    newState.items = newState.items.map(item => {
      if (item.id === orderItem) {
        item.quantity = quantity;
      }
      return item
    });
    // @todo Filter when there is a timeout.
    // newState.items = newState.items.filter(item => item.quantity > 0);
    localStorage.setItem('cartData', JSON.stringify(newState.items))
    return newState;
  }
  else if (action.type === `REMOVE_CART_ITEM`) {
    // Clone the state.
    const newState = {
      ...state,
    }
    const target = action.event.target;
    const orderItem = target.dataset.orderItem;

    newState.items = newState.items.filter(item => item.id !== orderItem);
    localStorage.setItem('cartData', JSON.stringify(newState.items))
    debugger;

    return newState;
  }
  return state
}

const initialState = {
  items: getCurrentCartData(),
}

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore
