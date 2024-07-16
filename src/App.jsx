import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "invoice_manager_customer_ui/Button";
import ProductForm from "invoice_manager_product_ui/ProductForm";
import Snackbar from "invoice_manager_customer_ui/Snackbar";
import Popup from "invoice_manager_customer_ui/Popup";
import { toggleRightDrawer } from "invoice_manager_customer_ui/actions/rightDrawerActions";
import ProductDetails from "./components/ProductDetails";
import {
  ADD,
  PRIMARY,
  PRODUCTS_PAGE,
} from "invoice_manager_customer_ui/constants";
import "./style/_productPage.scss"

const App = (props) => {
  const { toggleRightDrawer, snackBarIsOpen, popupIsOpen } = props;
  const handleAddClick = () => {
    toggleRightDrawer(true);
  };
  return (
    <div className="product-page-wrp">
      <div className="product-header">
        <h1>{PRODUCTS_PAGE}</h1>
        <Button handleClick={handleAddClick} label={ADD} variant={PRIMARY} />
      </div>
      <ProductDetails />
      <ProductForm />
      {snackBarIsOpen && <Snackbar />}
      {popupIsOpen && <Popup />}
    </div>
  );
};

const mapStateToProps = ({ snackBar, popup }) => ({
  snackBarIsOpen: snackBar.isOpen,
  popupIsOpen: popup.isOpen,
});

const mapDispatchToProps = {
  toggleRightDrawer,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
