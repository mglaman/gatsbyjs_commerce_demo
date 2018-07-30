import { createStore as reduxCreateStore } from "redux"

function getCurrentCartData() {
    const currentCart = (typeof localStorage === 'object') ? localStorage.getItem('cartData') : null;
    return currentCart ? JSON.parse(currentCart) : [];
}

const reducer = (state, {type, payload}) => {
    if (type === `ADD_TO_CART`) {
        const newState = Object.assign({}, state, {
            items: state.items,
        });
        newState.items.push(payload);
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
