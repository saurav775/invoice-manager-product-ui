const { ModuleFederationPlugin } = require("webpack").container;
const { merge } = require("webpack-merge");
const path = require("path");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

const domain = process.env.CUSTOMER_PRODUCTION_DOMAIN;

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.[name].[contenthash].js",
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "invoice_manager_product_ui",
        filename: "remoteEntry.js",
        remotes: {
          invoice_manager_dashboard_ui:
            "invoice_manager_dashboard_ui@http://localhost:3000/remoteEntry.js",
          invoice_manager_customer_ui:
            "invoice_manager_customer_ui@http://localhost:3001/remoteEntry.js",
          invoice_manager_product_ui:
            "invoice_manager_product_ui@http://localhost:3002/remoteEntry.js",
        },
        exposes: {
          "./ProductsPage": "./src/Bootstrap",
          "./ProductForm": "./src/components/ProductForm",
          "./actions/productActions": "./src/store/actions/products.actions",
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};
