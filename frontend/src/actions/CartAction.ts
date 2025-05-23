// cartActions.ts
import { CartProduct, ADD_TO_CART, UPDATE_QUANTITY, REMOVE_ITEM, CLEAR_CART, AddToCartAction, UpdateQuantityAction, RemoveItemAction, ClearCartAction, SET_CART, SetCartAction, RemoveSelectedProductsAction } from "./types";

export const addToCart = (product: CartProduct): AddToCartAction => ({
  type: ADD_TO_CART,
  payload: product, // Directly use product as the payload
});

export const updateQuantity = (product_id: string, quantity: number): UpdateQuantityAction => ({
  type: UPDATE_QUANTITY,
  payload: { product_id, quantity },
});

export const removeItem = (product_id: string): RemoveItemAction => ({
  type: REMOVE_ITEM,
  payload: { product_id },
});

export const removeSelectedProductsFromCart = (selectedItems: string[]):RemoveSelectedProductsAction => {
  return {
      type: 'REMOVE_SELECTED_PRODUCTS',
      payload: selectedItems,
  };
};


export const clearCart = (): ClearCartAction => ({
  type: CLEAR_CART,
});
export const setCart = (cart: { list: CartProduct[], total: number }): SetCartAction => ({
    type: SET_CART,
    payload: cart,
});
