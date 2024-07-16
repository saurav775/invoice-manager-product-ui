import {
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  SAVE_PRODUCT_REQUEST,
  SAVE_PRODUCT_SUCCESS,
  SAVE_PRODUCT_FAILURE,
  TOGGLE_PRODUCT_LOADER,
  SET_SELECTED_PRODUCT,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
} from "invoice_manager_dashboard_ui/actionTypes";
import { toggleRightDrawer } from "invoice_manager_customer_ui/actions/rightDrawerActions";
import { toggleSnackbar } from "invoice_manager_customer_ui/actions/snackBarActions";
import { togglePopup } from "invoice_manager_customer_ui/actions/popupActions";
import {
  BASE_URL_V1,
  PRODUCT_NAME_ALREADY_EXISTS,
  ERROR,
  INFO,
} from "invoice_manager_customer_ui/constants";

export const toggleProductLoader = (isLoading) => (dispatch) => {
  dispatch({ type: TOGGLE_PRODUCT_LOADER, payload: { isLoading } });
};

export const setSelectedProduct = (productData) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_PRODUCT,
    payload: {
      productData,
    },
  });
};

export const getProducts = () => async (dispatch) => {
  dispatch({ type: GET_PRODUCTS_REQUEST });
  try {
    const response = await fetch(`${BASE_URL_V1}/product`);
    const transformedResponse = await response.json();
    dispatch({ type: GET_PRODUCTS_SUCCESS, payload: transformedResponse });
  } catch (error) {
    console.error(error);
    dispatch({ type: GET_PRODUCTS_FAILURE, error });
  }
};

export const saveProduct =
  (product_name, product_rate_per_item, product_description, product_id = "") =>
  async (dispatch) => {
    dispatch({ type: SAVE_PRODUCT_REQUEST });
    dispatch(toggleRightDrawer(false));
    dispatch(setSelectedProduct({}));
    try {
      const requestBody = {
        product_name,
        product_rate_per_item,
        product_description,
      };
      if (product_id) {
        requestBody.product_id = product_id;
      }
      const saveProductUrl = product_id
        ? `${BASE_URL_V1}/product/${product_id}`
        : `${BASE_URL_V1}/product`;
      const saveProductMethod = product_id ? "PUT" : "POST";

      const response = await fetch(saveProductUrl, {
        method: saveProductMethod,
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message, payload } = await response.json();

      if (message === PRODUCT_NAME_ALREADY_EXISTS) {
        dispatch(toggleSnackbar(true, message, ERROR));
        dispatch(toggleProductLoader(false));
      } else {
        dispatch({
          type: SAVE_PRODUCT_SUCCESS,
          payload: {
            productData: {
              product_id: product_id || payload?.product_id,
              product_name,
              product_rate_per_item,
              product_description,
            },
            isEditing: !!product_id,
          },
        });
        dispatch(toggleSnackbar(true, message, INFO));
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: SAVE_PRODUCT_FAILURE, error });
      dispatch(toggleSnackbar(true, error, ERROR));
    }
  };

export const deleteProduct = (product_id) => async (dispatch) => {
  dispatch({ type: DELETE_PRODUCT_REQUEST });
  dispatch(togglePopup(false));
  try {
    const response = await fetch(`${BASE_URL_V1}/product/${product_id}`, {
      method: "DELETE",
    });
    const { message } = await response.json();
    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: { product_id } });
    dispatch(toggleSnackbar(true, message, INFO));
  } catch (error) {
    console.error(error);
    dispatch({ type: DELETE_PRODUCT_FAILURE, error });
    dispatch(toggleSnackbar(true, error, ERROR));
  }
};
