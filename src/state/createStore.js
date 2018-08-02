import { createStore as reduxCreateStore } from "redux"

function getCurrentCartData() {
    const currentCart = (typeof localStorage === 'object') ? localStorage.getItem('cartData') : null;
    return currentCart ? JSON.parse(currentCart) : [];
}

const reducer = (state, {type, payload}) => {
    if (type === `ADD_TO_CART`) {
        // Clone the state.
        const newState = {
            ...state,
        };
        // Combine values and adjust quantity.

        const cartItem = {
            quantity: 1,
            id: payload.uuid,
            product: payload,
        };
        let existingItemFound = false;

        newState.items = newState.items.map((item => {
            if (item.id === cartItem.id) {
                existingItemFound = true;
                item.quantity++;
            }
            return item;
        }));
        if (!existingItemFound) {
            newState.items.push(cartItem);
        }
        localStorage.setItem('cartData', JSON.stringify(newState.items));
        return newState;
    }
    return state
};

const initialState = {
    items: getCurrentCartData()
};

const createStore = () => reduxCreateStore(reducer, initialState);
export default createStore
