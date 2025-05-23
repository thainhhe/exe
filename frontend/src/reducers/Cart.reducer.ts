import { ADD_TO_CART, CLEAR_CART, REMOVE_ITEM, UPDATE_QUANTITY, CartActionTypes, CartProduct, SET_CART, REMOVE_SELECTED_PRODUCTS } from "../actions/types";

interface CartState {
    list: CartProduct[];
    total: number;
}

// Function to get the initial state from localStorage or create a new one
const getInitialState = (): CartState => {
    const savedState = localStorage.getItem('cart');
    return savedState ? JSON.parse(savedState) : { list: [], total: 0 };
};

const updateLocalStorage = (list: CartProduct[], total: number) => {
    localStorage.setItem('cart', JSON.stringify({ list, total }));
};

const cartReducer = (state: CartState = getInitialState(), action: CartActionTypes): CartState => {
    switch (action.type) {
        case ADD_TO_CART: {
            const { product_id, quantity } = action.payload;
            const existingProductIndex = state.list.findIndex(product => product.product_id === product_id);
            let updatedList;

            if (existingProductIndex !== -1) {
                updatedList = state.list.map((product, index) =>
                    index === existingProductIndex ? { ...product, quantity: product.quantity + quantity } : product
                );
            } else {
                updatedList = [...state.list, action.payload];
            }

            const total = updatedList.reduce((sum, product) => sum + product.quantity, 0);
            updateLocalStorage(updatedList, total);

            return { ...state, list: updatedList, total };
        }

        case UPDATE_QUANTITY: {
            const updatedList = state.list.map(product =>
                product.product_id === action.payload.product_id ? { ...product, quantity: action.payload.quantity } : product
            );
            const total = updatedList.reduce((sum, product) => sum + product.quantity, 0);
            updateLocalStorage(updatedList, total);
            return { ...state, list: updatedList, total };
        }

        case REMOVE_ITEM: {
            const updatedList = state.list.filter(product => product.product_id !== action.payload.product_id);
            const total = updatedList.reduce((sum, product) => sum + product.quantity, 0);
            updateLocalStorage(updatedList, total);
            return { ...state, list: updatedList, total };
        }

        case REMOVE_SELECTED_PRODUCTS: {
            const updatedList = state.list.filter(item => !action.payload.includes(item.product_id)); // Remove selected products
            const total = updatedList.reduce((sum, product) => sum + product.quantity, 0);
            updateLocalStorage(updatedList, total);
            return { ...state, list: updatedList, total };
        }

        case CLEAR_CART: {
            localStorage.removeItem('cart');
            return { list: [], total: 0 };
        }

        case SET_CART: {
            return {
                ...state,
                list: action.payload.list,
                total: action.payload.total,
            };
        }

        default:
            return state;
    }
};

export default cartReducer;