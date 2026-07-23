import React, { Component, useState, useEffect } from "react";
import { BrowserRouter as Router, Navigate, Redirect, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import NavBar from "./components/Navigation/NavBar";
import NewNavBar from "./components/Navigation/NewNavBar";
import AddProduct from "./components/Product/AddProduct";
import ProductList from "./components/Product/ProductList";
import ProductExpirationList from "./components/Product/ProductExpirationList";
import ProductNoteList from "./components/Product/ProductNoteList";

import ProductSpoilageList from "./components/Spoilage/ProductSpoilageList";
import AddRTS from "./components/ReturnToSeller/AddRTS";
import RTSList from "./components/ReturnToSeller/RTSList";


import SpoilageList from "./components/Spoilage/SpoilageList";


import CreditCardDueSettings from "./components/Settings/CreditCardDueSettings";

import ProductListV2 from "./components/Product/ProductListV2";
import ProductListDisabled from "./components/Product/ProductListDisabled";

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
import BalanceHistory from "./components/PaymentType/BalanceHistory";

import PoEditPaymentType from "./components/PaymentType/PoEditPaymentType";

import AddExpenseTypeV2 from "./components/ExpensesV2/AddExpenseTypeV2";
import ExpenseTypeList from "./components/ExpensesV2/ExpenseTypeList";
import ViewExpenseTypeList from "./components/ExpensesV2/ViewExpenseTypeList";
import ViewExpenseTypeCategoryList from "./components/ExpensesV2/ViewExpenseTypeCategoryList";
import ViewExpenseCategory from "./components/ExpensesV2/ViewExpenseCategory";
import ViewExpense from "./components/ExpensesV2/ViewExpense";
import ViewExpenseTransaction from "./components/ExpensesV2/ViewExpenseTransaction";
import ViewExpenseTransactionDate from "./components/ExpensesV2/ViewExpenseTransactionDate";
import ViewExpenseTransactionApproval from "./components/ExpensesV2/ViewExpenseTransactionApproval";








import AddExpenseCategoryV2 from "./components/ExpensesV2/AddExpenseCategoryV2";
import AddExpenseV2 from "./components/ExpensesV2/AddExpenseV2";
import ExpenseTransaction from "./components/ExpensesV2/ExpenseTransaction";
import EditExpenseTransaction from "./components/ExpensesV2/EditExpenseTransaction";


import AddCheckList from "./components/CheckList/AddCheckList";
import EditCheckList from "./components/CheckList/EditCheckList";
import CheckList from "./components/CheckList/CheckList";


import AddCategory from "./components/Category/AddCategory";
import CategoryList from "./components/Category/CategoryList";
import EditCategory from "./components/Category/EditCategory";
import UserRegistration from "./components/User/UserRegistration";
import UserLogin from "./components/User/UserLogin";
import UserChangePassword from "./components/User/UserChangePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import {
  clearAuthSession,
  hasValidAuthSession,
  scheduleSessionExpiration,
} from "./components/User/authSession";
import Logout from "./components/User/Logout";
import Home from "./components/Home/Home";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import Supplier from "./components/Supplier/Supplier";
import SupplierListV2 from "./components/Supplier/SupplierListV2";
import EditSupplier from "./components/Supplier/EditSupplier";
import SupplierProductList from "./components/Product/SupplierProductList";
import ProductOrderTransactionList from "./components/Product/ProductOrderTransactionList";



import ExpirationEditList from "./components/Product/ExpirationEditList";


import OrderSupplierTransaction from "./components/OrderSupplierTransaction/OrderSupplierTransaction";
import SupplierTransactionListV2 from "./components/OrderSupplierTransaction/SupplierTransactionListV2";
import EditOrderSupplierTransaction from "./components/OrderSupplierTransaction/EditOrderSupplierTransaction";
import ProductSupplier from "./components/ProductSupplier/ProductSupplier";
import ProductSupplierListV2 from "./components/ProductSupplier/ProductSupplierListV2";
import AddProductOrderSupplierTransaction from "./components/OrderSupplierTransaction/AddProductOrderSupplierTransaction";
import BranchStock from "./components/OrderSupplierTransaction/BranchStock";
import FinalizeOrder from "./components/OrderSupplierTransaction/FinalizeOrder";
import SendToSupplier from "./components/OrderSupplierTransaction/SendToSupplier";

import OrderSupplierApproval from "./components/OrderSupplierTransaction/OrderSupplierApproval";
import PrintOrderSupplier from "./components/OrderSupplierTransaction/PrintOrderSupplier";

import ViewOrder from "./components/OrderSupplierTransaction/ViewOrder";
import PaymentOrder from "./components/OrderSupplierTransaction/PaymentOrder";
import CompletedOrder from "./components/OrderSupplierTransaction/CompletedOrder";
import CompletedCustomerOrder from "./components/OrderCustomerList/CompletedCustomerOrder";
import UpdateCustomerOrder from "./components/OrderCustomerList/UpdateCustomerOrder";
import Stock from "./components/Stock/Stock";
import StockWarning from "./components/Stock/StockWarning";
import NoStockWarning from "./components/Stock/NoStockWarning";
import OutOfStockReturn from "./components/Stock/OutOfStockReturn";


import NoStock from "./components/Stock/NoStock";
import StockSupplierWarning from "./components/Stock/StockSupplierWarning";
import StockSupplier from "./components/Stock/StockSupplier";

import ModifiedStock from "./components/Stock/ModifiedStock";

import EditStock from "./components/Stock/EditStock";
import ViewTransaction from "./components/Stock/ViewTransaction";
import ViewOutOfStockHistory from "./components/Stock/ViewOutOfStockHistory";
import ViewStockTransactionList from "./components/Stock/ViewStockTransactionList";
import ViewCustomerNotify from "./components/Stock/ViewCustomerNotify";


import MarkUpPrice from "./components/MarkUpPrice/MarkUpPrice";
import MarkUpPriceListV2 from "./components/MarkUpPrice/MarkUpPriceListV2";
import ViewMarkUpHistory from "./components/MarkUpPrice/ViewMarkUpHistory";
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
import ProductSoldToday from "./components/dashboard/ProductSoldToday";
import EmployeePerformance from "./components/dashboard/EmployeePerformance";
import ProductSoldTodayCheckList from "./components/dashboard/ProductSoldTodayCheckList";
import StaffCheckList from "./components/Employee/StaffCheckList";
import UpdateStaffCheckList from "./components/Employee/UpdateStaffCheckList";


import StartOfDay from "./components/dashboard/StartOfDay";


import CustomerSorted from "./components/ShopOrderTransaction/CustomerSorted";
import PendingDelivery from "./components/ShopOrderTransaction/PendingDelivery";

import ReportCustomerSorted from "./components/Reports/ReportCustomerSorted";
import ReportProductSorted from "./components/Reports/ReportProductSorted";
import ProductValueReport from "./components/Reports/ProductValueReport";
import ReportCategorySales from "./components/Reports/ReportCategorySales";
import ReportProductUnsold from "./components/Reports/ReportProductUnsold";




import TransactionReportList from "./components/ShopOrderTransaction/TransactionReportList";
import PendingTransactionList from "./components/ShopOrderTransaction/PendingTransactionList";
import PendingPickUp from "./components/ShopOrderTransaction/PendingPickUp";
import PendingProduct from "./components/ShopOrderTransaction/PendingProduct";
import ViewPendingProduct from "./components/ShopOrderTransaction/ViewPendingProduct";



import CancelTransactionList from "./components/ShopOrderTransaction/CancelTransactionList";
import ShorOrderTransactionList from "./components/ShopOrderTransaction/ShorOrderTransactionList";
import CompletedShopOrderTransaction from "./components/ShopOrderTransaction/CompletedShopOrderTransaction";
import PrintShopBranch from "./components/ShopOrderTransaction/PrintShopBranch";
import PaymentTypeSales from "./components/ShopOrderTransaction/PaymentTypeSales";
import PaymentTypePrev from "./components/ShopOrderTransaction/PaymentTypePrev";

import ViewDiscount from "./components/ShopOrderTransaction/ViewDiscount";
import ViewDiscountLoss from "./components/ShopOrderTransaction/ViewDiscountLoss";
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
import SearchCustomer from "./components/Customer/SearchCustomer";
import CustomerTransactionList from "./components/Customer/CustomerTransactionList";
import CustomerListTransaction from "./components/Customer/CustomerListTransaction";
import CustomerAds from "./components/Customer/CustomerAds";
import CustomerHistory from "./components/Customer/CustomerHistory";
import CustomerBacklog from "./components/Customer/CustomerBacklog";
import CustomerConvo from "./components/Customer/CustomerConvo";
import CustomerReOrder from "./components/Customer/CustomerReOrder";
import VipCustomer from "./components/VipCustomer/VipCustomer";
import VipCustomerListV2 from "./components/VipCustomer/VipCustomerListV2";
import VipCustomerTransaction from "./components/VipCustomer/VipCustomerTransaction";
import VipCustomerTransactionListV2 from "./components/VipCustomer/VipCustomerTransactionListV2";
import VipCustomerTransactionTemplateList from "./components/VipCustomer/VipCustomerTransactionTemplateList";
import VipTransaction from "./components/VipCustomer/VipTransaction";
import VIPTransactionDebt from "./components/VipCustomer/VIPTransactionDebt";
import VIPTransactionHistory from "./components/VipCustomer/VIPTransactionHistory";
import EditVipCustomer from "./components/VipCustomer/EditVipCustomer";
import VipNote from "./components/VipCustomer/VipNote";
import VipProductTemplate from "./components/VipProduct/VipProductTemplate";
import VipProductTemplateListPage from "./components/VipProduct/VipProductTemplateListPage";
import EditVipProductTemplate from "./components/VipProduct/EditVipProductTemplate";
import VipProduct from "./components/VipProduct/VipProduct";
import VipProductListPage from "./components/VipProduct/VipProductListPage";
import VipProductTransactionTemplateList from "./components/VipProduct/VipProductTransactionTemplateList";
import VipProductTransactionReport from "./components/VipProduct/VipProductTransactionReport";
import VipProductNote from "./components/VipProduct/VipProductNote";


import CustomerProductList from "./components/Customer/CustomerProductList";


import PaymentTermTransaction from "./components/Payment/PaymentTermTransaction";
import ViewPaymentTermTransaction from "./components/Payment/ViewPaymentTermTransaction";
import ViewBankTransactionList from "./components/Payment/ViewBankTransactionList";
import ViewOrderSupplierTransaction from "./components/Payment/ViewOrderSupplierTransaction";
import ViewCreditCardDueList from "./components/Payment/ViewCreditCardDueList";
import ViewPaidCreditCardDueList from "./components/Payment/ViewPaidCreditCardDueList";

import ViewChequeDueList from "./components/Payment/ViewChequeDueList";

import ViewPaidChequeDueList from "./components/Payment/ViewPaidChequeDueList";


import EditCreditCardDue from "./components/Payment/EditCreditCardDue";
import PayCreditCard from "./components/Payment/PayCreditCard";
import PayCheque from "./components/Payment/PayCheque";
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

import ExpensesTransactionList from "./components/ExpensesType/ExpensesTransactionList";



import Expenses from "./components/Expenses/Expenses";
import EditExpenses from "./components/Expenses/EditExpenses";

import ReportList from "./components/Reports/ReportList";
import ReportSales from "./components/Reports/ReportSales";

import ReportBar from "./components/Reports/ReportBar";
import ReportPurchaseOrder from "./components/Reports/ReportPurchaseOrder";
import ReportPurchaseOrderList from "./components/Reports/ReportPurchaseOrderList";
import ReportPurchaseOrderPendingList from "./components/Reports/ReportPurchaseOrderPendingList";
import ReportPurchaseOrderApproval from "./components/Reports/ReportPurchaseOrderApproval";
import ReportPurchaseOrderPendingSupplier from "./components/Reports/ReportPurchaseOrderPendingSupplier";

import PurchaseOrderList from "./components/Reports/PurchaseOrderList";
import ReportSpoilage from "./components/Reports/ReportSpoilage";
import ReportDiscount from "./components/Reports/ReportDiscount";
import ReportDelivery from "./components/Reports/ReportDelivery";
import ReportModifiedStock from "./components/Reports/ReportModifiedStock";

import ReportPendingDelivery from "./components/Reports/ReportPendingDelivery";


import ReportDiscountLoss from "./components/Reports/ReportDiscountLoss";


import ViewSpoilageReport from "./components/Reports/ViewSpoilageReport";


import ReportExpenses from "./components/Reports/ReportExpenses";
import ReportExpensesView from "./components/Reports/ReportExpensesView";
import ReportExpenseTransaction from "./components/Reports/ReportExpenseTransaction";






// class App extends Component {
const App = () => {

  const [items, setItems] = useState('');
  const isAuthenticated = hasValidAuthSession();
  const canRegisterUsers = Number(localStorage.getItem('role_as')) === 2;

  useEffect(() => scheduleSessionExpiration(() => {
    clearAuthSession();
    window.location.replace("/login?reason=session-expired");
  }), []);

  // useEffect(() => {
  //   const items = JSON.parse(localStorage.getItem('auth_token'));


  //   setItems(items);
  // }, []);

  if (!isAuthenticated) {
    return (
      <div>
        <NewNavBar />
        <br />
        <br />
        <br />
        <div className="container mt-3">
          <Routes>
            <Route path="/login" element={<UserLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/userRegistration" element={<Navigate to="/login" replace />} />
            {/* Required for the secure link sent by the forgot-password email. */}
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* <NavBar /> */}
      <NewNavBar />
      <br></br>
      <br></br>
      <br></br>
      <div className="container mt-3">
        <Routes>
          {/* <Route path="/" element={<UserLogin />} /> */}
          <Route
            exact
            path="/"
            element={<Home />}
          />


          <Route path="/settings/CreditCardDueSettings" element={<CreditCardDueSettings />} />

          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/ProductListV2" element={<ProductListV2 />} />
          <Route path="/productListDisabled" element={<ProductListDisabled />} />

          <Route path="/productExpirationList" element={<ProductExpirationList />} />
          <Route path="/productNoteList" element={<ProductNoteList />} />


          <Route path="/productSpoilageList" element={<ProductSpoilageList />} />
          <Route path="/rts/addRTS" element={<AddRTS />} />
          <Route path="/rts/rTSList" element={<RTSList />} />


          <Route path="/spoilageList" element={<SpoilageList />} />

          <Route exact path="/editProduct/:id" element={<EditProduct />} />

          <Route path="/brand" element={<Brand />} />
          <Route path="/brandListV2" element={<BrandListV2 />} />
          <Route exact path="/editBrand/:id" element={<EditBrand />} />

          <Route path="/paymentType" element={<PaymentType />} />
          <Route path="/paymentTypeList" element={<PaymentTypeList />} />
          <Route exact path="/editPaymentType/:id" element={<EditPaymentType />} />

          <Route path="/poPaymentType" element={<PoPaymentType />} />
          <Route path="/poPaymentTypeList" element={<PoPaymentTypeList />} />
          <Route exact path="/balanceHistory/:id" element={<BalanceHistory />} />

          <Route exact path="/poEditPaymentType/:id" element={<PoEditPaymentType />} />

          <Route path="/supplier" element={<Supplier />} />
          <Route path="/supplierListV2" element={<SupplierListV2 />} />
          <Route exact path="/editSupplier/:id" element={<EditSupplier />} />
          <Route exact path="/supplierProductList/:id" element={<SupplierProductList />} />
          <Route exact path="/productOrderTransactionList/:id" element={<ProductOrderTransactionList />} />

          <Route exact path="/expirationEditList/:id" element={<ExpirationEditList />} />



          <Route path="/productSupplier" element={<ProductSupplier />} />
          <Route path="/productSupplierList" element={<ProductSupplierListV2 />} />


          <Route path="/expensesV2/addExpenseTypeV2" element={<AddExpenseTypeV2 />} />
          <Route path="/expensesV2/expenseTypeList" element={<ExpenseTypeList />} />
          <Route path="/expensesV2/viewExpenseTypeList/:id" element={<ViewExpenseTypeList />} />
          <Route path="/expensesV2/viewExpenseTypeCategoryList/:id/:id2" element={<ViewExpenseTypeCategoryList />} />


          <Route path="/expensesV2/viewExpenseCategory" element={<ViewExpenseCategory />} />

          <Route path="/expensesV2/viewExpense" element={<ViewExpense />} />
          <Route path="/expensesV2/viewExpenseTransaction" element={<ViewExpenseTransaction />} />
          <Route path="/expensesV2/viewExpenseTransactionApproval" element={<ViewExpenseTransactionApproval />} />

          <Route path="/expensesV2/viewExpenseTransactionDate/:date" element={<ViewExpenseTransactionDate />} />





          <Route path="/expensesV2/addExpenseCategoryV2" element={<AddExpenseCategoryV2 />} />
          <Route path="/expensesV2/addExpenseV2" element={<AddExpenseV2 />} />
          <Route path="/expensesV2/expenseTransaction" element={<ExpenseTransaction />} />
          <Route path="/expensesV2/editExpenseTransaction/:id" element={<EditExpenseTransaction />} />



          <Route path="/checkList/AddCheckList" element={<AddCheckList />} />
          <Route exact path="/checkList/editCheckList/:id" element={<EditCheckList />} />
          <Route exact path="/checkList/checkList" element={<CheckList />} />



          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/categoryList" element={<CategoryList />} />
          <Route exact path="/editCategory/:id" element={<EditCategory />} />

          {/* <Route path="/OrderSupplierTransaction" element={<OrderSupplierTransaction />} /> */}
          <Route exact path="/editOrderSupplierTransaction/:id" element={<EditOrderSupplierTransaction />} />
          <Route exact path="/addProductOrderSupplierTransaction/:id" element={<AddProductOrderSupplierTransaction />} />
          <Route exact path="/branchStock/:id" element={<BranchStock />} />
          <Route exact path="/editSupplierTransaction/:id" element={<EditSupplierTransaction />} />

          <Route exact path="/finalizeOrder/:id" element={<FinalizeOrder />} />
          <Route exact path="/sendToSupplier/:id" element={<SendToSupplier />} />

          <Route exact path="/orderSupplierApproval/:id" element={<OrderSupplierApproval />} />

          <Route exact path="/printOrderSupplier/:id" element={<PrintOrderSupplier />} />

          <Route exact path="/ViewOrder/:id" element={<ViewOrder />} />
          <Route exact path="/paymentOrder/:id" element={<PaymentOrder />} />
          <Route exact path="/completedOrder/:id" element={<CompletedOrder />} />

          <Route path="/addStock" element={<Stock />} />
          <Route exact path="/editStock/:id" element={<EditStock />} />
          <Route exact path="/stockWarning" element={<StockWarning />} />
          <Route exact path="/noStockWarning" element={<NoStockWarning />} />
          <Route exact path="/outOfStockReturn" element={<OutOfStockReturn />} />


          <Route exact path="/noStock" element={<NoStock />} />
          <Route exact path="/stockSupplierWarning" element={<StockSupplierWarning />} />
          <Route exact path="/StockSupplier" element={<StockSupplier />} />



          <Route exact path="/modifiedStock" element={<ModifiedStock />} />

          <Route exact path="/viewTransaction/:id" element={<ViewTransaction />} />
          <Route exact path="/viewOutOfStockHistory/:id" element={<ViewOutOfStockHistory />} />
          <Route exact path="/viewStockTransactionList/:id" element={<ViewStockTransactionList />} />
          <Route exact path="/viewCustomerNotify/:id" element={<ViewCustomerNotify />} />


          <Route exact path="/markUpPrice/" element={<MarkUpPrice />} />
          <Route exact path="/markUpPriceListV2/" element={<MarkUpPriceListV2 />} />
          <Route exact path="/viewMarkUpHistory/:id" element={<ViewMarkUpHistory />} />

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
          <Route path="/viewPaidCreditCardDueList" element={<ViewPaidCreditCardDueList />} />

          <Route path="/viewChequeDueList" element={<ViewChequeDueList />} />
          <Route path="/viewPaidChequeDueList" element={<ViewPaidChequeDueList />} />



          <Route path="/creditCardPaymentList" element={<CreditCardPaymentList />} />
          <Route path="/chequePaymentList" element={<ChequePaymentList />} />

          <Route path="/installmentOrder/:id" element={<InstallmentOrder />} />
          <Route path="/installmentPaymentList" element={<InstallmentPaymentList />} />
          <Route path="/updateCreditCardDue/:id" element={<EditCreditCardDue />} />
          <Route path="/payCreditCard/:id" element={<PayCreditCard />} />
          <Route path="/payCheque/:id" element={<PayCheque />} />
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
          {/* // Dashoard */}
          <Route exact path="/dashboard/productSoldToday/:id" element={<ProductSoldToday />} />
          <Route exact path="/employee/staffCheckList/:id" element={<StaffCheckList />} />
          <Route exact path="/employee/updateStaffCheckList/:id" element={<UpdateStaffCheckList />} />

          <Route exact path="/dashboard/productSoldTodayCheckList/:id" element={<ProductSoldTodayCheckList />} />
          <Route exact path="/dashboard/employeePerformance/:date" element={<EmployeePerformance />} />

          <Route exact path="/dashboard/startOfDay/:id" element={<StartOfDay />} />



          <Route exact path="/shopOrderTransaction/addProductShopOrderTransaction/:id" element={<AddProductShopOrderTransaction />} />
          <Route exact path="/shopOrderTransaction/shorOrderTransactionList/" element={<ShorOrderTransactionList />} />
          <Route exact path="/shopOrderTransaction/quantitySortedList/" element={<QuantitySorted />} />


          <Route exact path="/shopOrderTransaction/customerSortedList/" element={<CustomerSorted />} />
          <Route exact path="/shopOrderTransaction/PendingDelivery/" element={<PendingDelivery />} />



          {/* <Route exact path="/shopOrderTransaction/transactionReportList/" element={<TransactionReportList />} /> */}
          <Route exact path="/shopOrderTransaction/transactionReportList/:id" element={<TransactionReportList />} />
          <Route exact path="/shopOrderTransaction/pendingTransactionList/" element={<PendingTransactionList />} />
          <Route exact path="/shopOrderTransaction/pendingPickUp/" element={<PendingPickUp />} />
          <Route exact path="/shopOrderTransaction/pendingProduct/" element={<PendingProduct />} />
          <Route exact path="/shopOrderTransaction/viewPendingProduct/:id/:status/:dateFrom/:dateTo" element={<ViewPendingProduct />} />



          <Route exact path="/shopOrderTransaction/cancelTransactionList/" element={<CancelTransactionList />} />
          <Route exact path="/shopOrderTransaction/finalizeShopOrder/:id" element={<FinalizeShopOrder />} />
          <Route exact path="/shopOrderTransaction/completedShopOrderTransaction/:id" element={<CompletedShopOrderTransaction />} />
          <Route exact path="/shopOrderTransaction/printShopBranch/:id" element={<PrintShopBranch />} />

          <Route exact path="/shopOrderTransaction/paymentTypeSales/:id" element={<PaymentTypeSales />} />
          <Route exact path="/shopOrderTransaction/PaymentTypePrev/:id/:today/:type" element={<PaymentTypePrev />} />
          <Route exact path="/shopOrderTransaction/viewDiscount/:id" element={<ViewDiscount />} />
          <Route exact path="/shopOrderTransaction/viewDiscountLoss/:id" element={<ViewDiscountLoss />} />

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
          <Route
            exact
            path="/shopOrderTransaction/customerOrderTransactionList/:id"
            element={
              localStorage.getItem('auth_token')
                // items !== null
                ? <CustomerOrderTransactionList />
                : <UserLogin />
            }
          />


          <Route exact path="/customerOrderTransaction/addProductCustomerOrderTransaction/:id" element={<AddProductCustomerOrderTransaction />} />
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
          <Route exact path="/changePassword" element={<UserChangePassword />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
          <Route exact path="/reset-password" element={<ResetPassword />} />
          <Route
            exact
            path="/userRegistration"
            element={
              canRegisterUsers
                ? <UserRegistration />
                : <Home />
            }
          />
          {/* <Route exact path="/addUser" element={<UserRegistration />} /> */}
          {/* <Route exact path="/login" element={<UserLogin />} /> */}
          <Route exact path="/logout" element={<Logout />} />

          {/* <AdminPrivateRoute path="/admin" name="Admin" /> */}
          <Route exact path="/admin" element={<AdminPrivateRoute />} />



          <Route exact path="/reports/reportsList" element={<ReportList />} />
          <Route exact path="/reports/reportSales" element={<ReportSales />} />

          <Route exact path="/reports/reportBar" element={<ReportBar />} />
          <Route exact path="/reports/reportPurchaseOrder" element={<ReportPurchaseOrder />} />
          <Route exact path="/reports/reportPurchaseOrderList" element={<ReportPurchaseOrderList />} />
          <Route exact path="/reports/ReportPurchaseOrderPendingList" element={<ReportPurchaseOrderPendingList />} />
          <Route exact path="/reports/reportPurchaseOrderApproval" element={<ReportPurchaseOrderApproval />} />
          <Route exact path="/reports/reportPurchaseOrderPendingSupplier" element={<ReportPurchaseOrderPendingSupplier />} />


          <Route exact path="/reports/reportSpoilage" element={<ReportSpoilage />} />
          <Route exact path="/reports/reportDiscount" element={<ReportDiscount />} />
          <Route exact path="/reports/reportDelivery" element={<ReportDelivery />} />
          <Route exact path="/reports/reportModifiedStock" element={<ReportModifiedStock />} />

          <Route exact path="/reports/reportPendingDelivery" element={<ReportPendingDelivery />} />

          <Route exact path="/reports/reportDiscountLoss" element={<ReportDiscountLoss />} />


          <Route exact path="/reports/purchaseOrderList/:id" element={<PurchaseOrderList />} />
          <Route exact path="/reports/viewSpoilageReport/:id" element={<ViewSpoilageReport />} />
          <Route exact path="/reports/shopBranchReportList" element={<ShopBranchReportList />} />
          <Route exact path="/reports/reportExpenses" element={<ReportExpenses />} />
          <Route exact path="/reports/reportExpensesView/:id" element={<ReportExpensesView />} />
          <Route exact path="/reports/reportCustomerSorted/" element={<ReportCustomerSorted />} />
          <Route exact path="/reports/reportProductSorted/" element={<ReportProductSorted />} />
          <Route exact path="/reports/reportProductUnsold/" element={<ReportProductUnsold />} />

          <Route exact path="/reports/reportCategorySales/" element={<ReportCategorySales />} />
          <Route exact path="/reports/reportExpenseTransaction/" element={<ReportExpenseTransaction />} />


          <Route exact path="/reports/productValueReport/" element={<ProductValueReport />} />



          <Route exact path="/customers/" element={<Customer />} />
          <Route exact path="/searchCustomer" element={<SearchCustomer />} />
          <Route exact path="/customerListV2" element={<CustomerListV2 />} />
          <Route exact path="/customerListTransaction" element={<CustomerListTransaction />} />
          <Route exact path="/customerAds" element={<CustomerAds />} />

          <Route exact path="/customerHistory" element={<CustomerHistory />} />
          <Route exact path="/customerBacklog" element={<CustomerBacklog />} />

          <Route exact path="/customerConvo" element={<CustomerConvo />} />
          <Route exact path="/customerReOrder" element={<CustomerReOrder />} />

          <Route exact path="/vipCustomer" element={<VipCustomer />} />
          <Route exact path="/vipCustomerListV2" element={<VipCustomerListV2 />} />
          <Route exact path="/vipCustomer/:id" element={<EditVipCustomer />} />
          <Route exact path="/vipCustomerTransaction" element={<VipCustomerTransaction />} />
          <Route exact path="/vipCustomerTransactionListV2" element={<VipCustomerTransactionListV2 />} />
          <Route exact path="/vipCustomerTransactionTemplateList" element={<VipCustomerTransactionTemplateList />} />
          <Route exact path="/vipTransaction/:id" element={<VipTransaction />} />
          <Route exact path="/vipTransactionDebt/:id" element={<VIPTransactionDebt />} />
          <Route exact path="/vipTransactionHistory/:id" element={<VIPTransactionHistory />} />
          <Route exact path="/vipNote/:id" element={<VipNote />} />
          <Route exact path="/vipProduct" element={<VipProductTemplate />} />
          <Route exact path="/vipProductListV2" element={<VipProductTemplateListPage />} />
          <Route exact path="/vipProduct/:id" element={<EditVipProductTemplate />} />
          <Route exact path="/vipProductTransaction" element={<VipProduct />} />
          <Route exact path="/vipProductTransactionListV2" element={<VipProductListPage />} />
          <Route exact path="/vipProductTransactionTemplateList" element={<VipProductTransactionTemplateList />} />
          <Route exact path="/vipProductTransactionView/:id" element={<VipProductTransactionReport />} />
          <Route exact path="/vipProductNote/:id" element={<VipProductNote />} />



          <Route exact path="/customers/:id" element={<EditCustomer />} />
          <Route exact path="/customers/customerTransactionList/:id" element={<CustomerTransactionList />} />
          <Route exact path="/customers/customerProductList/:id" element={<CustomerProductList />} />


          <Route exact path="/expensesType/" element={<ExpensesType />} />
          {/* <Route exact path="/customerListV2" element={<CustomerListV2 />} /> */}
          <Route exact path="/expensesType/:id" element={<EditExpensesType />} />

          <Route exact path="/expensesTransactionList/:id" element={<ExpensesTransactionList />} />

          <Route exact path="/expenses/" element={<Expenses />} />
          {/* <Route exact path="/customerListV2" element={<CustomerListV2 />} /> */}
          <Route exact path="/editExpenses/:id" element={<EditExpenses />} />



        </Routes>
      </div>
    </div>
  );
}
export default App;
