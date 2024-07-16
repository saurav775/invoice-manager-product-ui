import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "invoice_manager_dashboard_ui/store";
import App from "./App";
import { PRODUCT_ROOT, DEVELOPMENT } from "invoice_manager_customer_ui/constants";

const ProductElement = (
  <Provider store={store}>
    <App />
  </Provider>
);

// if (process.env.NODE_ENV === DEVELOPMENT) {
//   const rootNode = document.getElementById(PRODUCT_ROOT);
//   const root = ReactDOM.createRoot(rootNode);
//   if (rootNode) {
//     root.render(ProductElement);
//   }
// }

const ProductsPage = () => {
  return ProductElement;
};

export default ProductsPage;
