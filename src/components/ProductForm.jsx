import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import RightDrawer from "invoice_manager_customer_ui/RightDrawer";
import Button from "invoice_manager_customer_ui/Button";
import {
  SECONDARY,
  NEW_PRODUCT,
  CANCEL,
  SAVE,
  PRODUCT_NAME,
  PRODUCT_RATE,
  PRODUCT_DESCRIPTION,
  ENTER_PRODUCT_NAME,
  ENTER_PRODUCT_RATE,
  ENTER_PRODUCT_DESCRIPTION,
  SUBMIT,
  EDIT_PRODUCT,
} from "invoice_manager_customer_ui/constants";
import {
  saveProduct,
  setSelectedProduct,
} from "invoice_manager_product_ui/actions/productActions";
import { toggleRightDrawer } from "invoice_manager_customer_ui/actions/rightDrawerActions";
import useForm from "invoice_manager_customer_ui/hooks/useForm";

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

const productValidationTypes = {
  product_name: "min:3|max:50|special_chars|required",
  product_rate_per_item: "required",
  product_description: "max:255|required",
};

const ProductForm = (props) => {
  const {
    isOpen,
    toggleRightDrawer,
    saveProduct,
    selectedProduct,
    setSelectedProduct,
  } = props;
  const [formRef, formErrors, handleChange, handleFormSubmit] = useForm(
    productValidationTypes
  );

  const {
    product_id: selectedProductId,
    product_name: selectedProductName = "",
    product_rate_per_item: selectedProductRatePerItem = "",
    product_description: selectedProductDescription = "",
  } = selectedProduct;

  const handleCancelClick = () => {
    toggleRightDrawer(false);
    setSelectedProduct({});
  };

  const handleProductFormSubmit = (event) => {
    handleFormSubmit(event, (formData) => {
      const product_name = formData.get("product_name");
      const product_rate_per_item = formData.get("product_rate_per_item");
      const product_description = formData.get("product_description");
      if (selectedProductId)
        saveProduct(
          product_name,
          product_rate_per_item,
          product_description,
          selectedProductId
        );
      else
        saveProduct(product_name, product_rate_per_item, product_description);
    });
  };

  useEffect(() => {
    formRef?.current?.reset();
  }, [isOpen]);

  const {
    product_name: product_name_error,
    product_rate_per_item: product_rate_per_item_error,
    product_description: product_description_error,
  } = formErrors;

  const drawerTitle = selectedProductId ? EDIT_PRODUCT : NEW_PRODUCT;

  return (
    <RightDrawer title={drawerTitle} isOpen={isOpen}>
      <form onSubmit={handleProductFormSubmit} ref={formRef}>
        <div className="form-input-wrp">
          <div className="form-element">
            <label htmlFor="product_name">{PRODUCT_NAME}</label>
            <input
              type="text"
              name="product_name"
              placeholder={ENTER_PRODUCT_NAME}
              autoComplete="off"
              onChange={handleChange}
              defaultValue={selectedProductName}
            />
            {!!product_name_error && <span>{product_name_error}</span>}
          </div>
          <div className="form-element">
            <label htmlFor="product_rate_per_item">{PRODUCT_RATE}</label>
            <input
              type="number"
              name="product_rate_per_item"
              step=".01"
              placeholder={ENTER_PRODUCT_RATE}
              autoComplete="off"
              onChange={handleChange}
              defaultValue={selectedProductRatePerItem}
            />
            {!!product_rate_per_item_error && (
              <span>{product_rate_per_item_error}</span>
            )}
          </div>
          <div className="form-element">
            <label htmlFor="product_description">{PRODUCT_DESCRIPTION}</label>
            <input
              type="text"
              name="product_description"
              placeholder={ENTER_PRODUCT_DESCRIPTION}
              autoComplete="off"
              onChange={handleChange}
              defaultValue={selectedProductDescription}
            />
            {!!product_description_error && (
              <span>{product_description_error}</span>
            )}
          </div>
        </div>
        <div className="form-actions-wrp">
          <Button
            label={CANCEL}
            handleClick={handleCancelClick}
            variant={SECONDARY}
          />
          <Button label={SAVE} type={SUBMIT} />
        </div>
      </form>
    </RightDrawer>
  );
};

ProductForm.propTypes = propTypes;

const mapStateToProps = ({ products, rightDrawer }) => ({
  selectedProduct: products.selectedProduct,
  isOpen: rightDrawer.isOpen,
});

const mapDispatchToProps = {
  saveProduct,
  toggleRightDrawer,
  setSelectedProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);
