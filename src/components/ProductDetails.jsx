import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import TableUI from "invoice_manager_customer_ui/TableUI";
import Loader from "invoice_manager_customer_ui/Loader";
import { toggleRightDrawer } from "invoice_manager_customer_ui/actions/rightDrawerActions";
import { togglePopup } from "invoice_manager_customer_ui/actions/popupActions";
import {
  getProducts,
  setSelectedProduct,
  deleteProduct,
} from "invoice_manager_product_ui/actions/productActions";
import {
  EDIT,
  DELETE,
  SECONDARY,
  RED,
  ARE_YOU_SURE_PRODUCT_DELETION,
} from "invoice_manager_customer_ui/constants";

const ProductDetails = (props) => {
  const {
    getProducts,
    products,
    isLoading,
    toggleRightDrawer,
    setSelectedProduct,
    togglePopup,
    deleteProduct,
  } = props;

  useEffect(() => {
    getProducts();
  }, []);

  const columns = Object.keys(products?.[0] || {});

  const handleEditClick = (event, row) => {
    toggleRightDrawer(true);
    setSelectedProduct(row);
  };

  const handleDeleteClick = (event, row) => {
    const { product_name, product_id } = row;

    const handleProductDeletion = () => {
      deleteProduct(product_id);
    };

    togglePopup(
      true,
      ARE_YOU_SURE_PRODUCT_DELETION,
      `${DELETE} (${product_name})`,
      handleProductDeletion
    );
  };

  const actions = [
    {
      label: EDIT,
      handleClick: handleEditClick,
      variant: SECONDARY,
    },
    {
      label: DELETE,
      handleClick: handleDeleteClick,
      variant: RED,
    },
  ];

  if (isLoading) return <Loader fixedLoader />;
  return <TableUI rows={products} columns={columns} actions={actions} />;
};

const mapStateToProps = ({ products }) => ({
  products: products.products,
  isLoading: products.isLoading,
});

const mapDispatchToProps = {
  getProducts,
  toggleRightDrawer,
  setSelectedProduct,
  togglePopup,
  deleteProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
