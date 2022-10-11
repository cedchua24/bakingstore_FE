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
import FinalizeOrder from "./components/OrderSupplierTransaction/FinalizeOrder";
import CompletedOrder from "./components/OrderSupplierTransaction/CompletedOrder";
import CompletedCustomerOrder from "./components/OrderCustomerList/CompletedCustomerOrder";
import Stock from "./components/Stock/Stock";
import EditStock from "./components/Stock/EditStock";
import ViewTransaction from "./components/Stock/ViewTransaction";

import MarkUpPrice from "./components/MarkUpPrice/MarkUpPrice";

import OrderCustomerTransaction from "./components/OrderCustomerTransaction/OrderCustomerTransaction";
import OrderCustomerList from "./components/OrderCustomerList/OrderCustomerList";



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

          <Route exact path="/finalizeOrder/:id" element={<FinalizeOrder />} />
          <Route exact path="/completedOrder/:id" element={<CompletedOrder />} />

          <Route path="/addStock" element={<Stock />} />
          <Route exact path="/editStock/:id" element={<EditStock />} />
          <Route exact path="/viewTransaction/:id" element={<ViewTransaction />} />

          <Route exact path="/markUpPrice/" element={<MarkUpPrice />} />

          <Route exact path="/orderCustomerTransaction/" element={<OrderCustomerTransaction />} />
          <Route exact path="/orderCustomerList/" element={<OrderCustomerList />} />
          <Route exact path="/completedCustomerOrder/:id" element={<CompletedCustomerOrder />} />

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