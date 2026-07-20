import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';
import { removeUserSession } from '../src/utils/Common';
import { useIdleTimer } from 'react-idle-timer'

//Theme
import Theme from './components/theme/Theme';

//Public Routes
import Login from './components/Login';
import Register from './components/Register';
import Unauthorized from './components/Unauthorized';

//Private Routes
import Home from './components/Home';
import ChangePassword from './components/pages/ChangePassword/ChangePasswordES';
import UserProfile from './components/pages/UserProfile/UserProfileES';

import Material from './components/pages/Material/MaterialES';
import Warehouse from './components/pages/Warehouse/WarehouseES';
import Model from './components/pages/Model/ModelES';
import Batch from './components/pages/Batch/BatchES';
import Grn from './components/pages/Grn/GrnES';
import Mrn from './components/pages/Mrn/MrnES';
import MrnIssuance from './components/pages/MrnIssuance/MrnIssuanceES';
// import Style from './components/pages/Style/StyleES';
// import Marker from './components/pages/Marker/MarkerES';
import UserRoles from './components/pages/UserRoles/UserRolesES';
import CreateUser from './components/pages/CreateUser/CreateUserES';
import Permissions from './components/pages/Permissions/PermissionsES';
import Inventory from './components/pages/Inventory/InventoryES';
import CostSheetView from './components/pages/CostSheetView/CostSheetES';
import PurchaseOrder from './components/pages/PurchaseOrder/PurchaseOrderES';
import Supplier from './components/pages/Supplier/SupplierES';
import Team from './components/pages/Team/TeamES';
import Shift from './components/pages/Shift/ShiftES';
import DailyShift from './components/pages/DailyShift/DailyShiftES';
import CSCharts from './components/pages/CostSheetCharts/CSCharts';
import Returnable from './components/pages/Returnable/ReturnableES';
import StockTransfer from './components/pages/StockTransfer/StockTransferES';
import OpenGrn from './components/pages/GrnConfirmation/GrnConES';
import DailyOutput from './components/pages/Reports/DailyOutput/DailyOutputES';
import CurrentStock from './components/pages/Reports/CurrentStock/CurrentStockES';
import GrnPendingCompleted from './components/pages/Reports/GrnPendingCompleted/GrnPendingCompletedES';
import MrnActivityPerUser from './components/pages/Reports/MrnActivityPerUser/MrnActivityPerUserES';
import MrnTurnaroundTime from './components/pages/Reports/MrnTurnaroundTime/MrnTurnaroundTimeES';
import MaterialConsumptionPerModel from './components/pages/Reports/MaterialConsumptionPerModel/MaterialConsumptionPerModelES';
import PurchaseOrderStatus from './components/pages/Reports/PurchaseOrderStatus/PurchaseOrderStatusES';
import DashboardHome from './components/pages/dashboards/DashboardHome';
import ProcurementDashboard from './components/pages/dashboards/ProcurementDashboard';
import InventoryDashboard from './components/pages/dashboards/InventoryDashboard';
import ConsumptionDashboard from './components/pages/dashboards/ConsumptionDashboard';
import GrnDashboard from './components/pages/dashboards/GrnDashboard';
import PaymentsDashboard from './components/pages/dashboards/PaymentsDashboard';
import ActivePODashboard from './components/pages/dashboards/ActivePODashboard';
// import InvoiceRegistry from './components/pages/InvoiceRegistry/InvoiceRegistryES';
// import Configuration from './components/pages/Configuration/ConfigurationES';
// import TransactionSummary from './components/pages/TransactionSummary/TransactionSummaryES';
// import DayBook from './components/pages/DayBook/DayBookES';


const getBaseName = path => path.substr(0, path.lastIndexOf('/'));

const App = () => {

  return (
    <div>
      <Router basename={process.env.PUBLIC_URL} forceRefresh={true}>
        <Switch>
          <PublicRoute exact path="/" screen="login" component={Login} />
          <PublicRoute path="/login" screen="login" component={Login} />
          <Route path="/unauthorized" screen="unauthorized" component={Unauthorized} />
          <PrivateRoute path="/home" screen="home" component={Home} theme={Theme} />
          <PrivateRoute path="/changePassword" screen="changePassword" component={ChangePassword} theme={Theme} />
          <PrivateRoute path="/userProfile" screen="userProfile" component={UserProfile} theme={Theme} />

          <PrivateRoute path="/material" screen="material" component={Material} theme={Theme} />
          <PrivateRoute path="/warehouse" screen="warehouse" component={Warehouse} theme={Theme} />
          <PrivateRoute path="/model" screen="model" component={Model} theme={Theme} />
          <PrivateRoute path="/inventory" screen="inventory" component={Inventory} theme={Theme} />
          <PrivateRoute path="/returnable" screen="returnable" component={Returnable} theme={Theme} />
          <PrivateRoute path="/stockTransfer" screen="stockTransfer" component={StockTransfer} theme={Theme} />

          <PrivateRoute path="/batchCreation" screen="batchCreation" component={Batch} theme={Theme} />
          <PrivateRoute path="/grn" screen="grn" component={Grn} theme={Theme} />
          <PrivateRoute path="/openGrns" screen="openGrns" component={OpenGrn} theme={Theme} />
          <PrivateRoute path="/mrnCreation" screen="mrnCreation" component={Mrn} theme={Theme} />
          <PrivateRoute path="/mrnIssuance" screen="mrnIssuance" component={MrnIssuance} theme={Theme} />
          <PrivateRoute path="/costSheetView" screen="costSheetView" component={CostSheetView} theme={Theme} />
          <PrivateRoute path="/csCharts/:model_id" screen="costSheetView" component={CSCharts} theme={Theme} />

          <PrivateRoute path="/purchaseOrder" screen="purchaseOrder" component={PurchaseOrder} theme={Theme} />
          <PrivateRoute path="/suppliers" screen="suppliers" component={Supplier} theme={Theme} />
          <PrivateRoute path="/team" screen="team" component={Team} theme={Theme} />
          <PrivateRoute path="/shift" screen="shift" component={Shift} theme={Theme} />
          <PrivateRoute path="/dailyShift" screen="dailyShift" component={DailyShift} theme={Theme} />
          <PrivateRoute exact path="/dashboard" screen="home" component={DashboardHome} theme={Theme} />
          <PrivateRoute path="/procuremntDashboard" screen="home" component={ProcurementDashboard} theme={Theme} />
          {/* <PrivateRoute path="/dashboard/inventory" screen="home" component={InventoryDashboard} theme={Theme} />
          <PrivateRoute path="/dashboard/consumption" screen="home" component={ConsumptionDashboard} theme={Theme} />
          <PrivateRoute path="/dashboard/grn" screen="home" component={GrnDashboard} theme={Theme} />
          <PrivateRoute path="/dashboard/payments" screen="home" component={PaymentsDashboard} theme={Theme} /> */}
          <PrivateRoute path="/posDashboard" screen="home" component={ActivePODashboard} theme={Theme} />

          {/* <PrivateRoute path="/dailyOutput" screen="dailyOutput" component={DailyOutput} theme={Theme} /> */}
          <PrivateRoute path="/currentStock" screen="currentStock" component={CurrentStock} theme={Theme} />
          <PrivateRoute path="/grnReport" screen="grnReport" component={GrnPendingCompleted} theme={Theme} />
          {/* <PrivateRoute path="/mrnActivityPerUser" screen="mrnActivityPerUser" component={MrnActivityPerUser} theme={Theme} />
          <PrivateRoute path="/mrnTurnaroundTime" screen="mrnTurnaroundTime" component={MrnTurnaroundTime} theme={Theme} />
          <PrivateRoute path="/materialConsumptionPerModel" screen="materialConsumptionPerModel" component={MaterialConsumptionPerModel} theme={Theme} />
          <PrivateRoute path="/purchaseOrderStatus" screen="purchaseOrderStatus" component={PurchaseOrderStatus} theme={Theme} /> */}

          {/* <PrivateRoute path="/style" screen="style" component={Style} theme={Theme} />
          <PrivateRoute path="/marker" screen="style" component={Marker} theme={Theme} /> *
          <PrivateRoute path="/invoiceRegistry" screen="invoiceRegistry" component={InvoiceRegistry} theme={Theme} />
          <PrivateRoute path="/configuration" screen="configuration" component={Configuration} theme={Theme} />
          <PrivateRoute path="/transactionSummary" screen="transactionSummary" component={TransactionSummary} theme={Theme} />
          <PrivateRoute path="/dayBook" screen="dayBook" component={DayBook} theme={Theme} /> */}

          <PrivateRoute path="/createUser" screen="createUser" component={CreateUser} theme={Theme} />
          <PrivateRoute path="/userRoles" screen="userRoles" component={UserRoles} theme={Theme} />
          <PrivateRoute path="/permissions" screen="permissions" component={Permissions} theme={Theme} />

        </Switch>
      </Router>
    </div>
  );
}

export default App;
