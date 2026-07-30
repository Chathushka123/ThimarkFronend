import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getUser } from "../../utils/Common";
import Logo from "../../images/logo.png";
import SettingsIcon from "../../images/settings-icon.svg";
import LogoutIcon from "../../images/logout-icon.svg";
import ReactTooltip from 'react-tooltip';
import API, { logoutUser } from '../../api/API';

const Sidebar = () => {
  const user = getUser();
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const [navigator, setNavigator] = useState();
  const [navigationData, setNavigationData] = useState([]);

  const isActive = (path) => location.pathname === `${process.env.PUBLIC_URL}${path}`;

  // handle click event of logout button
  const handleLogout = () => {
    logoutUser();
  };

  useEffect(() => {
    if (toggle) {
      document.body.classList.add("sb-sidenav-toggled");
    } else {
      document.body.classList.remove("sb-sidenav-toggled");
    }
  }, [toggle]);

  useEffect(() => {
    API.post(`permissions/getNavigator`).then(response => {
      setNavigationData(response.data);
    }).catch(error => {
      console.log("**************error.response*****************");
      console.log(error.response);
    });
  }, []);

  useEffect(() => {
    setNavigator(navigationData.map(item => {
      if (item.type === 'folder') {
        return generateNavFolder(item)
      } else {
        return generateNavItem(item)
      }
    }))
  }, [navigationData]);

  const generateNavFolder = params => {
    const nodes = params.nodes;
    const hasActiveChild = nodes.some(node => isActive(node.path));
    let navItems = <></>;
    if (nodes.length > 0) {
      navItems = nodes.map(node => {
        const active = isActive(node.path);
        return (
          <a key={node.path} className={`nav-link${active ? ' active' : ''}`} href={`${process.env.PUBLIC_URL + node.path}`} title={node.caption}>
            <div className="sb-nav-link-icon" data-tip={node.caption}><i className={node.icon}></i></div>{node.caption}
          </a>
        )
      }
      )
    }
    return (
      <div key={params.id}>
        <a className={`nav-link${hasActiveChild ? '' : ' collapsed'}`} href="#!" data-toggle="collapse" data-target={"#" + params.id} aria-expanded={hasActiveChild} aria-controls={params.id} title={params.caption}>
          <div className="sb-nav-link-icon" data-tip={params.caption}><i className={params.icon}></i></div>
          {params.caption}
          <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
        </a>
        <div className={`collapse${hasActiveChild ? ' show' : ''}`} id={params.id} aria-labelledby="headingOne" data-parent="#sidenavAccordion">
          <nav className="sb-sidenav-menu-nested nav">
            {navItems}
          </nav>
        </div>
      </div>
    )
  }

  const generateNavItem = item => {
    const active = isActive(item.path);
    return (
      <a key={item.path} className={`nav-link${active ? ' active' : ''}`} href={`${process.env.PUBLIC_URL + item.path}`} title={item.caption}>
        <div className="sb-nav-link-icon" data-tip={item.caption}><i className={item.icon}></i></div>{item.caption}
      </a>
    )
  }

  const handleSidebarToggle = (e) => {
    e.preventDefault();
    setToggle(!toggle);
    document.getElementsByClassName('sidebar-outer-wrap')[0].classList.toggle("sidebar-collapsed");
  };

  return (
    <>
      {/* <ReactTooltip place="right" effect="solid" backgroundColor="#152e60" /> */}
      <div className="sidebar-inner-wrap">
        <div className="sidenav-logo-toggleicon-wrap">
          <a className="navbar-brand" href={`${process.env.PUBLIC_URL}/home`}>
            <img className="sidenav-logo" src={Logo} alt="PMS Logo" />
          </a>
          {user && (
            <button className="btn btn-link btn-sm order-1 order-lg-0 toggle-btn" onClick={handleSidebarToggle} id="sidebarToggle" href="#!">
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
        </div>
        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
          <div className="sb-sidenav-menu">
            <div className="nav">

              {navigator}

              {/* <a className="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapseDashboard"
                aria-expanded="false" aria-controls="collapseDashboard">
                <div className="sb-nav-link-icon" data-tip="Dashboard"><i className="fa fa-tachometer-alt"></i></div>
                Dashboard
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </a>
              <div className="collapse" id="collapseDashboard" aria-labelledby="headingOne"
                data-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/dashboard`}>
                    <div className="sb-nav-link-icon" data-tip="Dashboard"><i className="fa fa-chart-pie"></i></div>Dashboard
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/supermarketDashBoard`}>
                    <div className="sb-nav-link-icon" data-tip="Supermarket Dashboard"><i className="fa fa-tasks"></i></div>Supermarket Dashboard
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/productionDashBoard`}>
                    <div className="sb-nav-link-icon" data-tip="Production Dashboard"><i className="fa fa-chart-line"></i></div>Production Dashboard
                  </a>
                </nav>
              </div>
              <a className="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapseMasterData"
                aria-expanded="false" aria-controls="collapseMasterData">
                <div className="sb-nav-link-icon" data-tip="Master Data"><i className="fas fa-columns"></i></div>
                Master Data
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </a>
              <div className="collapse" id="collapseMasterData" aria-labelledby="headingOne"
                data-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/buyer`}>
                    <div className="sb-nav-link-icon" data-tip="Buyer"><i className="fa fa-handshake"></i></div>Buyer
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/routing`}>
                    <div className="sb-nav-link-icon" data-tip="Routing"><i className="fa fa-compass"></i></div>Routing
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/style`}>
                    <div className="sb-nav-link-icon" data-tip="Style"><i className="fas fa-pencil-ruler"></i></div>Style
                  </a>
                </nav>
              </div>
              <a className="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapseOrderManagement"
                aria-expanded="false" aria-controls="collapseOrderManagement">
                <div className="sb-nav-link-icon" data-tip="Order Management"><i className="far fa-list-alt"></i></div>
                Order Management
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </a>
              <div className="collapse" id="collapseOrderManagement" aria-labelledby="headingOne"
                data-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/summaryOrderConfirmation`}>
                    <div className="sb-nav-link-icon" data-tip="SOC"><i className="fas fa-clipboard-check"></i></div>SOC
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/factoryProductionOrder`}>
                    <div className="sb-nav-link-icon" data-tip="FPO"><i className="far fa-calendar-check"></i></div>FPO
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/fppOrder`}>
                    <div className="sb-nav-link-icon" data-tip="FPPO"><i className="fas fa-cogs"></i></div>FPPO
                  </a>
                </nav>
              </div>
              <a className="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapseCutRoom"
                aria-expanded="false" aria-controls="collapseCutRoom">
                <div className="sb-nav-link-icon" data-tip="Cut Room"><i className="fas fa-cut"></i></div>
                Cut Room
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </a>
              <div className="collapse" id="collapseCutRoom" aria-labelledby="headingOne"
                data-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/combineOrder`}>
                    <div className="sb-nav-link-icon" data-tip="Combine Order"><i className="fas fa-object-group"></i></div>Combine Order
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/ratioPlanning`}>
                    <div className="sb-nav-link-icon" data-tip="Ratio Planning"><i className="fas fa-tasks"></i></div>Ratio Planning
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/cutUpdate`}>
                    <div className="sb-nav-link-icon" data-tip="Cut Update"><i className="fas fa-pen-square"></i></div>Cut Update
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/bundleCreation`}>
                    <div className="sb-nav-link-icon" data-tip="Bundle Creation"><i className="fas fa-bars"></i></div>Bundle Creation
                  </a>
                </nav>
              </div>
              <a className="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapseProduction"
                aria-expanded="false" aria-controls="collapseProduction">
                <div className="sb-nav-link-icon" data-tip="Production"><i className="fas fa-tshirt"></i></div>
                Production
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </a>
              <div className="collapse" id="collapseProduction" aria-labelledby="headingOne"
                data-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/jobCard`}>
                    <div className="sb-nav-link-icon" data-tip="Job Card Creation"><i className="fas fa-id-card"></i></div>Job Card Creation
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/trimStoreManagement`}>
                    <div className="sb-nav-link-icon" data-tip="Trim Store Management"><i className="fas fa-shopping-bag"></i></div>Trim Store Management
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/productionWIPScanning`}>
                    <div className="sb-nav-link-icon" data-tip="Production WIP Scanning"><i className="fas fa-barcode"></i></div>Production WIP Scanning
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/reasonsMaster`}>
                    <div className="sb-nav-link-icon" data-tip="Reject / Rework Reasons"><i className="fas fa-exclamation-triangle"></i></div>Reject / Rework Reasons
                  </a>
                </nav>
              </div>
              <a className="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapseHR"
                aria-expanded="false" aria-controls="collapseHR">
                <div className="sb-nav-link-icon" data-tip="HR Management"><i className="fas fa-user-shield"></i></div>
                HR Management
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </a>
              <div className="collapse" id="collapseHR" aria-labelledby="headingOne"
                data-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/employee`}>
                    <div className="sb-nav-link-icon" data-tip="Employee"><i className="fas fa-user-tie"></i></div>Employee
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/teamCategory`}>
                    <div className="sb-nav-link-icon" data-tip="Team Category"><i className="fas fa-user-friends"></i></div>Team Category
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/team`}>
                    <div className="sb-nav-link-icon" data-tip="Team"><i className="fas fa-users"></i></div>Team
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/shift`}>
                    <div className="sb-nav-link-icon" data-tip="Shift"><i className="fas fa-user-clock"></i></div>Shift
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/dailyTeamShiftMapping`}>
                    <div className="sb-nav-link-icon" data-tip="Daily Team Mapping"><i className="fas fa-users-cog"></i></div>Daily Team Mapping
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/dailyEmployeeMapping`}>
                    <div className="sb-nav-link-icon" data-tip="Daily Employee Mapping"><i className="fas fa-user-check"></i></div>Daily Employee Mapping
                  </a>
                </nav>
              </div>
              <a className="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapseProductionPlanning"
                aria-expanded="false" aria-controls="collapseProductionPlanning">
                <div className="sb-nav-link-icon" data-tip="Production Planning"><i className="fas fa-chart-bar"></i></div>
                Production Planning
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </a>
              <div className="collapse" id="collapseProductionPlanning" aria-labelledby="headingOne"
                data-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/targetInformationSetUp`}>
                    <div className="sb-nav-link-icon" data-tip="Target Information SetUp"><i className="fas fa-bullseye"></i></div>Target Information SetUp
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/downTimeInformationSetUp`}>
                    <div className="sb-nav-link-icon" data-tip="DownTime Information SetUp"><i className="fas fa-arrow-down"></i></div>DownTime Information SetUp
                  </a>
                </nav>
              </div>
              <a className="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapsePacking"
                aria-expanded="false" aria-controls="collapsePacking">
                <div className="sb-nav-link-icon" data-tip="Packing"><i className="fas fa-box-open"></i></div>
                Packing
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </a>
              <div className="collapse" id="collapsePacking" aria-labelledby="headingOne"
                data-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/carton`}>
                    <div className="sb-nav-link-icon" data-tip="Carton"><i className="fas fa-cube"></i></div>Carton
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/packingList`}>
                    <div className="sb-nav-link-icon" data-tip="Create Packing List"><i className="fas fa-cubes"></i></div>Create Packing List
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/viewPackingList`}>
                    <div className="sb-nav-link-icon" data-tip="View Packing List"><i className="fa fa-eye"></i></div>View Packing List
                  </a>
                </nav>
              </div>
              <a className="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapseDataUpload"
                aria-expanded="false" aria-controls="collapseDataUpload">
                <div className="sb-nav-link-icon" data-tip="Data Upload"><i className="fas fa-download"></i></div>
                Integration
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </a>
              <div className="collapse" id="collapseDataUpload" aria-labelledby="headingOne"
                data-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/integrationLogs`}>
                    <div className="sb-nav-link-icon" data-tip="Integration Logs"><i className="fas fa-caret-square-up"></i></div>Integration Logs
                  </a>
                </nav>
              </div>
              <a className="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapseUserManagement"
                aria-expanded="false" aria-controls="collapseUserManagement">
                <div className="sb-nav-link-icon" data-tip="Data Upload"><i className="fas fa-user-tie"></i></div>
                User Management
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
              </a>
              <div className="collapse" id="collapseUserManagement" aria-labelledby="headingOne"
                data-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/createUser`}>
                    <div className="sb-nav-link-icon" data-tip="Create User"><i className="fas fa-user-plus"></i></div>Create User
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/userRoles`}>
                    <div className="sb-nav-link-icon" data-tip="User Roles"><i className="fas fa-user-tag"></i></div>User Roles
                  </a>
                  <a className="nav-link" href={`${process.env.PUBLIC_URL}/permissions`}>
                    <div className="sb-nav-link-icon" data-tip="Permissions"><i className="fas fa-user-lock"></i></div>Permissions
                  </a>
                </nav>
              </div> */}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
