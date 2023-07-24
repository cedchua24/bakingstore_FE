import React, { Component, useState, useEffect } from "react";
import { BrowserRouter as Router, Redirect, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import NavBar from "./components/Navigation/NavBar";
import NavBar2 from "./components/Navigation/NavBar2";
import AddProduct from "./components/Product/AddProduct";
import EditProduct from "./components/Product/EditProduct";
import Brand from "./components/Brand/Brand";
import EditBrand from "./components/Brand/EditBrand";
import AddCategory from "./components/Category/AddCategory";
import EditCategory from "./components/Category/EditCategory";
import UserRegistration from "./components/User/UserRegistration";
import UserLogin from "./components/User/UserLogin";
import Logout from "./components/User/Logout";
import Home from "./components/Home/Home";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import Supplier from "./components/Supplier/Supplier";
import EditSupplier from "./components/Supplier/EditSupplier";
import OrderSupplierTransaction from "./components/OrderSupplierTransaction/OrderSupplierTransaction";
import SupplierTransactionListV2 from "./components/OrderSupplierTransaction/SupplierTransactionListV2";
import EditOrderSupplierTransaction from "./components/OrderSupplierTransaction/EditOrderSupplierTransaction";
import AddProductOrderSupplierTransaction from "./components/OrderSupplierTransaction/AddProductOrderSupplierTransaction";
import BranchStock from "./components/OrderSupplierTransaction/BranchStock";
import FinalizeOrder from "./components/OrderSupplierTransaction/FinalizeOrder";
import CompletedOrder from "./components/OrderSupplierTransaction/CompletedOrder";
import CompletedCustomerOrder from "./components/OrderCustomerList/CompletedCustomerOrder";
import UpdateCustomerOrder from "./components/OrderCustomerList/UpdateCustomerOrder";
import Stock from "./components/Stock/Stock";
import EditStock from "./components/Stock/EditStock";
import ViewTransaction from "./components/Stock/ViewTransaction";

import MarkUpPrice from "./components/MarkUpPrice/MarkUpPrice";

import OrderCustomerTransaction from "./components/OrderCustomerTransaction/OrderCustomerTransaction";
import OrderCustomerList from "./components/OrderCustomerList/OrderCustomerList";

import Warehouse from "./components/Warehouse/Warehouse";
import WarehouseStock from "./components/Warehouse/WarehouseStock";
import EditWarehouse from "./components/Warehouse/EditWarehouse";

import Shop from "./components/Shop/Shop";
import EditShop from "./components/Shop/EditShop";


import ShopOrderTransaction from "./components/ShopOrderTransaction/ShopOrderTransaction";
import AddProductShopOrderTransaction from "./components/ShopOrderTransaction/AddProductShopOrderTransaction";
import FinalizeShopOrder from "./components/ShopOrderTransaction/FinalizeShopOrder";
import CustomerOrderTransactionList from "./components/ShopOrderTransaction/CustomerOrderTransactionList";
import ShorOrderTransactionList from "./components/ShopOrderTransaction/ShorOrderTransactionList";
import CompletedShopOrderTransaction from "./components/ShopOrderTransaction/CompletedShopOrderTransaction";

import CustomerOrderTransaction from "./components/CustomerTransaction/CustomerOrderTransaction";
import AddProductCustomerOrderTransaction from "./components/CustomerTransaction/AddProductCustomerOrderTransaction";
// import AddProductCustomerOrderTransaction from "./components/customerOrderTransaction/AddProductCustomerOrderTransaction";
// import FinalizeShopOrder from "./components/ShopOrderTransaction/FinalizeShopOrder";
// import ShorOrderTransactionList from "./components/ShopOrderTransaction/ShorOrderTransactionList";
// import CompletedShopOrderTransaction from "./components/ShopOrderTransaction/CompletedShopOrderTransaction";

import ProductTransactionList from "./components/Product/ProductTransactionList";






// class App extends Component {
const App = () => {

  const [items, setItems] = useState('');

  // useEffect(() => {
  //   const items = JSON.parse(localStorage.getItem('auth_token'));


  //   setItems(items);
  // }, []);

  return (
    <div>
      <NavBar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/addProduct" element={<AddProduct />} />
          <Route exact path="/editProduct/:id" element={<EditProduct />} />

          <Route path="/addBrand" element={<Brand />} />
          <Route exact path="/editBrand/:id" element={<EditBrand />} />

          <Route path="/supplier" element={<Supplier />} />
          <Route exact path="/editSupplier/:id" element={<EditSupplier />} />


          <Route path="/addCategory" element={<AddCategory />} />
          <Route exact path="/editCategory/:id" element={<EditCategory />} />

          {/* <Route path="/OrderSupplierTransaction" element={<OrderSupplierTransaction />} /> */}
          <Route exact path="/editOrderSupplierTransaction/:id" element={<EditOrderSupplierTransaction />} />.
          <Route exact path="/addProductOrderSupplierTransaction/:id" element={<AddProductOrderSupplierTransaction />} />
          <Route exact path="/branchStock/:id" element={<BranchStock />} />

          <Route exact path="/finalizeOrder/:id" element={<FinalizeOrder />} />
          <Route exact path="/completedOrder/:id" element={<CompletedOrder />} />

          <Route path="/addStock" element={<Stock />} />
          <Route exact path="/editStock/:id" element={<EditStock />} />
          <Route exact path="/viewTransaction/:id" element={<ViewTransaction />} />

          <Route exact path="/markUpPrice/" element={<MarkUpPrice />} />

          <Route exact path="/orderCustomerTransaction/" element={<OrderCustomerTransaction />} />
          <Route exact path="/orderCustomerList/" element={<OrderCustomerList />} />
          <Route exact path="/completedCustomerOrder/:id" element={<CompletedCustomerOrder />} />
          <Route exact path="/updateCustomerOrder/:id" element={<UpdateCustomerOrder />} />

          <Route path="/warehouse" element={<Warehouse />} />
          <Route exact path="/warehouseStock/:id" element={<WarehouseStock />} />

          <Route path="/shop" element={<Shop />} />
          <Route exact path="/editShop/:id" element={<EditShop />} />

          <Route exact path="/productTransactionList/:id" element={<ProductTransactionList />} />


          <Route
            exact
            path="/orderSupplierTransaction"
            element={
              localStorage.getItem('auth_token')
                // items !== null
                ? <OrderSupplierTransaction />
                : <UserLogin />
            }
          />
          <Route
            exact
            path="/shopOrderTransaction"
            element={
              localStorage.getItem('auth_token')
                // items !== null
                ? <ShopOrderTransaction />
                : <UserLogin />
            }
          />
          <Route exact path="/shopOrderTransaction/addProductShopOrderTransaction/:id" element={<AddProductShopOrderTransaction />} />
          <Route exact path="/shopOrderTransaction/shorOrderTransactionList/" element={<ShorOrderTransactionList />} />
          <Route exact path="/shopOrderTransaction/customerOrderTransactionList/" element={<CustomerOrderTransactionList />} />
          <Route exact path="/shopOrderTransaction/finalizeShopOrder/:id" element={<FinalizeShopOrder />} />
          <Route exact path="/shopOrderTransaction/completedShopOrderTransaction/:id" element={<CompletedShopOrderTransaction />} />
          <Route
            exact
            path="/customerOrderTransaction"
            element={
              localStorage.getItem('auth_token')
                // items !== null
                ? <CustomerOrderTransaction />
                : <UserLogin />
            }
          />
          <Route exact path="/customerOrderTransaction/addProductCustomerOrderTransaction/:id" element={<AddProductCustomerOrderTransaction />} />
          {/* <Route exact path="/customerOrderTransaction/addProductCustomerTransaction/:id" element={<AddProductCustomerTransaction />} /> */}
          <Route
            exact
            path="/supplierTransactionList"
            element={
              localStorage.getItem('auth_token')
                ? <SupplierTransactionListV2 />
                : <UserLogin />
            }
          />
          <Route
            exact
            path="/login"
            element={
              localStorage.getItem('auth_token')
                ? <Home />
                : <UserLogin />
            }
          />
          <Route
            exact
            path="/userRegistration"
            element={
              localStorage.getItem('auth_token')
                ? <Home />
                : <UserRegistration />
            }
          />
          {/* <Route exact path="/addUser" element={<UserRegistration />} /> */}
          {/* <Route exact path="/login" element={<UserLogin />} /> */}
          <Route exact path="/logout" element={<Logout />} />

          {/* <AdminPrivateRoute path="/admin" name="Admin" /> */}
          <Route exact path="/admin" element={<AdminPrivateRoute />} />


        </Routes>
      </div>
    </div>
  );
}
export default App;