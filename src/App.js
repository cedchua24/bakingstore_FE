import React, { Component, useState, useEffect } from "react";
import { BrowserRouter as Router, Redirect, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import NavBar from "./components/Navigation/NavBar";
import NavBar2 from "./components/Navigation/NavBar2";
import AddProduct from "./components/Product/AddProduct";
import ProductList from "./components/Product/ProductList";
import EditProduct from "./components/Product/EditProduct";
import EditSupplierTransaction from "./components/OrderSupplierTransaction/EditSupplierTransaction";

import Brand from "./components/Brand/Brand";
import BrandListV2 from "./components/Brand/BrandListV2";
import EditBrand from "./components/Brand/EditBrand";
import PaymentType from "./components/PaymentType/PaymentType";
import PaymentTypeList from "./components/PaymentType/PaymentTypeList";
import EditPaymentType from "./components/PaymentType/EditPaymentType";
import PoPaymentType from "./components/PaymentType/PoPaymentType";
import PoPaymentTypeList from "./components/PaymentType/PoPaymentTypeList";
import PoEditPaymentType from "./components/PaymentType/PoEditPaymentType";

import AddCategory from "./components/Category/AddCategory";
import CategoryList from "./components/Category/CategoryList";
import EditCategory from "./components/Category/EditCategory";
import UserRegistration from "./components/User/UserRegistration";
import UserLogin from "./components/User/UserLogin";
import Logout from "./components/User/Logout";
import Home from "./components/Home/Home";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import Supplier from "./components/Supplier/Supplier";
import SupplierListV2 from "./components/Supplier/SupplierListV2";
import EditSupplier from "./components/Supplier/EditSupplier";
import SupplierProductList from "./components/Product/SupplierProductList";

import OrderSupplierTransaction from "./components/OrderSupplierTransaction/OrderSupplierTransaction";
import SupplierTransactionListV2 from "./components/OrderSupplierTransaction/SupplierTransactionListV2";
import EditOrderSupplierTransaction from "./components/OrderSupplierTransaction/EditOrderSupplierTransaction";
import ProductSupplier from "./components/ProductSupplier/ProductSupplier";
import ProductSupplierListV2 from "./components/ProductSupplier/ProductSupplierListV2";
import AddProductOrderSupplierTransaction from "./components/OrderSupplierTransaction/AddProductOrderSupplierTransaction";
import BranchStock from "./components/OrderSupplierTransaction/BranchStock";
import FinalizeOrder from "./components/OrderSupplierTransaction/FinalizeOrder";
import ViewOrder from "./components/OrderSupplierTransaction/ViewOrder";
import PaymentOrder from "./components/OrderSupplierTransaction/PaymentOrder";
import CompletedOrder from "./components/OrderSupplierTransaction/CompletedOrder";
import CompletedCustomerOrder from "./components/OrderCustomerList/CompletedCustomerOrder";
import UpdateCustomerOrder from "./components/OrderCustomerList/UpdateCustomerOrder";
import Stock from "./components/Stock/Stock";
import StockWarning from "./components/Stock/StockWarning";
import EditStock from "./components/Stock/EditStock";
import ViewTransaction from "./components/Stock/ViewTransaction";
import ViewStockTransactionList from "./components/Stock/ViewStockTransactionList";

import MarkUpPrice from "./components/MarkUpPrice/MarkUpPrice";
import MarkUpPriceListV2 from "./components/MarkUpPrice/MarkUpPriceListV2";
import MarkUpNewPrice from "./components/MarkUpPrice/MarkUpNewPrice";


import OrderCustomerTransaction from "./components/OrderCustomerTransaction/OrderCustomerTransaction";
import OrderCustomerList from "./components/OrderCustomerList/OrderCustomerList";

import Warehouse from "./components/Warehouse/Warehouse";
import WarehouseListV2 from "./components/Warehouse/WarehouseListV2";
import WarehouseStock from "./components/Warehouse/WarehouseStock";
import EditWarehouse from "./components/Warehouse/EditWarehouse";

import Shop from "./components/Shop/Shop";
import ShopListV2 from "./components/Shop/ShopListV2";
import EditShop from "./components/Shop/EditShop";


import ShopOrderTransaction from "./components/ShopOrderTransaction/ShopOrderTransaction";
import AddProductShopOrderTransaction from "./components/ShopOrderTransaction/AddProductShopOrderTransaction";
import FinalizeShopOrder from "./components/ShopOrderTransaction/FinalizeShopOrder";
import CustomerOrderTransactionList from "./components/ShopOrderTransaction/CustomerOrderTransactionList";
import QuantitySorted from "./components/ShopOrderTransaction/QuantitySorted";
import CustomerSorted from "./components/ShopOrderTransaction/CustomerSorted";
import ReportCustomerSorted from "./components/Reports/ReportCustomerSorted";
import ReportProductSorted from "./components/Reports/ReportProductSorted";
import ProductValueReport from "./components/Reports/ProductValueReport";


import TransactionReportList from "./components/ShopOrderTransaction/TransactionReportList";
import PendingTransactionList from "./components/ShopOrderTransaction/PendingTransactionList";
import CancelTransactionList from "./components/ShopOrderTransaction/CancelTransactionList";
import ShorOrderTransactionList from "./components/ShopOrderTransaction/ShorOrderTransactionList";
import CompletedShopOrderTransaction from "./components/ShopOrderTransaction/CompletedShopOrderTransaction";
import PaymentTypeSales from "./components/ShopOrderTransaction/PaymentTypeSales";
import ReceiptOrder from "./components/ShopOrderTransaction/ReceiptOrder";

import CustomerOrderTransaction from "./components/CustomerTransaction/CustomerOrderTransaction";
import AddProductCustomerOrderTransaction from "./components/CustomerTransaction/AddProductCustomerOrderTransaction";
// import AddProductCustomerOrderTransaction from "./components/customerOrderTransaction/AddProductCustomerOrderTransaction";
// import FinalizeShopOrder from "./components/ShopOrderTransaction/FinalizeShopOrder";
// import ShorOrderTransactionList from "./components/ShopOrderTransaction/ShorOrderTransactionList";
// import CompletedShopOrderTransaction from "./components/ShopOrderTransaction/CompletedShopOrderTransaction";

import ProductTransactionList from "./components/Product/ProductTransactionList";


import ShopBranchReportList from "./components/Reports/ShopBranchReportList";
import Customer from "./components/Customer/Customer";
import CustomerListV2 from "./components/Customer/CustomerListV2";
import EditCustomer from "./components/Customer/EditCustomer";
import CustomerTransactionList from "./components/Customer/CustomerTransactionList";
import CustomerListTransaction from "./components/Customer/CustomerListTransaction";
import CustomerHistory from "./components/Customer/CustomerHistory";
import CustomerProductList from "./components/Customer/CustomerProductList";


import PaymentTermTransaction from "./components/Payment/PaymentTermTransaction";
import ViewPaymentTermTransaction from "./components/Payment/ViewPaymentTermTransaction";
import ViewBankTransactionList from "./components/Payment/ViewBankTransactionList";
import ViewOrderSupplierTransaction from "./components/Payment/ViewOrderSupplierTransaction";
import ViewCreditCardDueList from "./components/Payment/ViewCreditCardDueList";
import ViewChequeDueList from "./components/Payment/ViewChequeDueList";


import EditCreditCardDue from "./components/Payment/EditCreditCardDue";
import PayCreditCard from "./components/Payment/PayCreditCard";
import PromoInstallment from "./components/Payment/PromoInstallment";
import PayCreditCardHistory from "./components/Payment/PayCreditCardHistory";
import CreditCardPayHistory from "./components/Payment/CreditCardPayHistory";
import CreditCardTransactionHistory from "./components/Payment/CreditCardTransactionHistory";




import CreditCardPaymentList from "./components/Payment/CreditCardPaymentList";
import ChequePaymentList from "./components/Payment/ChequePaymentList";

import InstallmentOrder from "./components/Payment/InstallmentOrder";
import InstallmentPaymentList from "./components/Payment/InstallmentPaymentList";
import InstallmentPromo from "./components/Installment/InstallmentPromo";
import AddInstallment from "./components/Installment/AddInstallment";
import InstallmentDetails from "./components/Installment/InstallmentDetails";
import LoanList from "./components/Installment/LoanList";
import UpcomingLoanList from "./components/Installment/UpcomingLoanList";





import PaymentOrderCreditCard from "./components/Payment/PaymentOrderCreditCard";





import ExpensesType from "./components/ExpensesType/ExpensesType";
import EditExpensesType from "./components/ExpensesType/EditExpensesType";

import Expenses from "./components/Expenses/Expenses";
import EditExpenses from "./components/Expenses/EditExpenses";

import ReportList from "./components/Reports/ReportList";
import ReportPurchaseOrder from "./components/Reports/ReportPurchaseOrder";
import PurchaseOrderList from "./components/Reports/PurchaseOrderList";


import ReportExpenses from "./components/Reports/ReportExpenses";
import ReportExpensesView from "./components/Reports/ReportExpensesView";





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
          <Route path="/productList" element={<ProductList />} />
          <Route exact path="/editProduct/:id" element={<EditProduct />} />

          <Route path="/brand" element={<Brand />} />
          <Route path="/brandListV2" element={<BrandListV2 />} />
          <Route exact path="/editBrand/:id" element={<EditBrand />} />

          <Route path="/paymentType" element={<PaymentType />} />
          <Route path="/paymentTypeList" element={<PaymentTypeList />} />
          <Route exact path="/editPaymentType/:id" element={<EditPaymentType />} />

          <Route path="/poPaymentType" element={<PoPaymentType />} />
          <Route path="/poPaymentTypeList" element={<PoPaymentTypeList />} />
          <Route exact path="/poEditPaymentType/:id" element={<PoEditPaymentType />} />

          <Route path="/supplier" element={<Supplier />} />
          <Route path="/supplierListV2" element={<SupplierListV2 />} />
          <Route exact path="/editSupplier/:id" element={<EditSupplier />} />
          <Route exact path="/supplierProductList/:id" element={<SupplierProductList />} />


          <Route path="/productSupplier" element={<ProductSupplier />} />
          <Route path="/productSupplierList" element={<ProductSupplierListV2 />} />

          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/categoryList" element={<CategoryList />} />
          <Route exact path="/editCategory/:id" element={<EditCategory />} />

          {/* <Route path="/OrderSupplierTransaction" element={<OrderSupplierTransaction />} /> */}
          <Route exact path="/editOrderSupplierTransaction/:id" element={<EditOrderSupplierTransaction />} />
          <Route exact path="/addProductOrderSupplierTransaction/:id" element={<AddProductOrderSupplierTransaction />} />
          <Route exact path="/branchStock/:id" element={<BranchStock />} />
          <Route exact path="/editSupplierTransaction/:id" element={<EditSupplierTransaction />} />

          <Route exact path="/finalizeOrder/:id" element={<FinalizeOrder />} />
          <Route exact path="/ViewOrder/:id" element={<ViewOrder />} />
          <Route exact path="/paymentOrder/:id" element={<PaymentOrder />} />
          <Route exact path="/completedOrder/:id" element={<CompletedOrder />} />

          <Route path="/addStock" element={<Stock />} />
          <Route exact path="/editStock/:id" element={<EditStock />} />
          <Route exact path="/stockWarning" element={<StockWarning />} />
          <Route exact path="/viewTransaction/:id" element={<ViewTransaction />} />
          <Route exact path="/viewStockTransactionList/:id" element={<ViewStockTransactionList />} />

          <Route exact path="/markUpPrice/" element={<MarkUpPrice />} />
          <Route exact path="/markUpPriceListV2/" element={<MarkUpPriceListV2 />} />
          <Route exact path="/markUpNewPrice/" element={<MarkUpNewPrice />} />

          <Route exact path="/orderCustomerTransaction/" element={<OrderCustomerTransaction />} />
          <Route exact path="/orderCustomerList/" element={<OrderCustomerList />} />
          <Route exact path="/completedCustomerOrder/:id" element={<CompletedCustomerOrder />} />
          <Route exact path="/updateCustomerOrder/:id" element={<UpdateCustomerOrder />} />

          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/warehouseListV2" element={<WarehouseListV2 />} />
          <Route exact path="/warehouseStock/:id" element={<WarehouseStock />} />

          <Route path="/paymentTermTransaction" element={<PaymentTermTransaction />} />
          <Route path="/viewPaymentTermTransaction/:id" element={<ViewPaymentTermTransaction />} />
          <Route path="/viewBankTransactionList/:id" element={<ViewBankTransactionList />} />
          <Route path="/viewOrderSupplierTransaction/:id" element={<ViewOrderSupplierTransaction />} />
          <Route path="/viewCreditCardDueList" element={<ViewCreditCardDueList />} />
          <Route path="/viewChequeDueList" element={<ViewChequeDueList />} />


          <Route path="/creditCardPaymentList" element={<CreditCardPaymentList />} />
          <Route path="/chequePaymentList" element={<ChequePaymentList />} />

          <Route path="/installmentOrder/:id" element={<InstallmentOrder />} />
          <Route path="/installmentPaymentList" element={<InstallmentPaymentList />} />
          <Route path="/updateCreditCardDue/:id" element={<EditCreditCardDue />} />
          <Route path="/payCreditCard/:id" element={<PayCreditCard />} />
          <Route path="/promoInstallment/:id" element={<PromoInstallment />} />

          <Route path="/payCreditCardHistory/:id" element={<PayCreditCardHistory />} />
          <Route path="/creditCardPayHistory/:id" element={<CreditCardPayHistory />} />
          <Route path="/creditCardTransactionHistory/:id" element={<CreditCardTransactionHistory />} />






          <Route path="/installmentPromo" element={<InstallmentPromo />} />
          <Route path="/addInstallment" element={<AddInstallment />} />
          <Route path="/loanList" element={<LoanList />} />
          <Route path="/upcomingLoanList" element={<UpcomingLoanList />} />


          <Route path="/installmentDetails/:id" element={<InstallmentDetails />} />


          <Route exact path="/paymentOrderCreditCard/:id" element={<PaymentOrderCreditCard />} />



          <Route path="/shop" element={<Shop />} />
          <Route path="/shopListV2" element={<ShopListV2 />} />
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
          <Route exact path="/shopOrderTransaction/quantitySortedList/" element={<QuantitySorted />} />
          <Route exact path="/shopOrderTransaction/customerSortedList/" element={<CustomerSorted />} />


          <Route exact path="/shopOrderTransaction/transactionReportList/" element={<TransactionReportList />} />
          <Route exact path="/shopOrderTransaction/pendingTransactionList/" element={<PendingTransactionList />} />
          <Route exact path="/shopOrderTransaction/cancelTransactionList/" element={<CancelTransactionList />} />
          <Route exact path="/shopOrderTransaction/finalizeShopOrder/:id" element={<FinalizeShopOrder />} />
          <Route exact path="/shopOrderTransaction/completedShopOrderTransaction/:id" element={<CompletedShopOrderTransaction />} />
          <Route exact path="/shopOrderTransaction/paymentTypeSales/:id" element={<PaymentTypeSales />} />
          <Route exact path="/shopOrderTransaction/receiptOrder/:id" element={<ReceiptOrder />} />
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

          <Route exact path="/reports/reportsList" element={<ReportList />} />
          <Route exact path="/reports/reportPurchaseOrder" element={<ReportPurchaseOrder />} />
          <Route exact path="/reports/purchaseOrderList/:id" element={<PurchaseOrderList />} />


          <Route exact path="/reports/shopBranchReportList" element={<ShopBranchReportList />} />
          <Route exact path="/reports/reportExpenses" element={<ReportExpenses />} />
          <Route exact path="/reports/reportExpensesView/:id" element={<ReportExpensesView />} />
          <Route exact path="/reports/reportCustomerSorted/" element={<ReportCustomerSorted />} />
          <Route exact path="/reports/reportProductSorted/" element={<ReportProductSorted />} />
          <Route exact path="/reports/productValueReport/" element={<ProductValueReport />} />


          <Route exact path="/customers/" element={<Customer />} />
          <Route exact path="/customerListV2" element={<CustomerListV2 />} />
          <Route exact path="/customerListTransaction" element={<CustomerListTransaction />} />
          <Route exact path="/customerHistory" element={<CustomerHistory />} />

          <Route exact path="/customers/:id" element={<EditCustomer />} />
          <Route exact path="/customers/customerTransactionList/:id" element={<CustomerTransactionList />} />
          <Route exact path="/customers/customerProductList/:id" element={<CustomerProductList />} />


          <Route exact path="/expensesType/" element={<ExpensesType />} />
          {/* <Route exact path="/customerListV2" element={<CustomerListV2 />} /> */}
          <Route exact path="/expensesType/:id" element={<EditExpensesType />} />

          <Route exact path="/expenses/" element={<Expenses />} />
          {/* <Route exact path="/customerListV2" element={<CustomerListV2 />} /> */}
          <Route exact path="/editExpenses/:id" element={<EditExpenses />} />



        </Routes>
      </div>
    </div>
  );
}
export default App;