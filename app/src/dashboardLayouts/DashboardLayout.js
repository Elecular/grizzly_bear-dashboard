import React from "react";

import { Route, Switch, Redirect } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import { Modal } from "reactstrap";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";

//Modals
import ShowProjectID from "dashboardModals/ShowProjectID";
import TermsOfUse from "dashboardModals/TermsOfUse";
import { hasAcceptedTermsOfUse, acceptTermsOfUse } from "../api/experiments";
import AuthorizationContext from "auth/authorizationContext";

let ps;

class DashboardLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeColor: "blue",
            sidebarMini: true,
            opacity: 0,
            sidebarOpened: false,
            isModalOpen: false,
            modalOption: undefined,
        };
        //document.body.classList.toggle("sidebar-mini");
        //document.body.classList.toggle("white-content");

        this.displayModal = this.displayModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showTermsOfUse = this.showTermsOfUse.bind(this);
    }

    componentDidMount() {
        this.showTermsOfUse();

        if (navigator.platform.indexOf("Win") > -1) {
            document.documentElement.classList.add("perfect-scrollbar-on");
            document.documentElement.classList.remove("perfect-scrollbar-off");
            ps = new PerfectScrollbar(this.refs.mainPanel);
            this.refs.mainPanel.addEventListener(
                "ps-scroll-y",
                this.showNavbarButton,
            );
            let tables = document.querySelectorAll(".table-responsive");
            for (let i = 0; i < tables.length; i++) {
                ps = new PerfectScrollbar(tables[i]);
            }
        }
        window.addEventListener("scroll", this.showNavbarButton);
    }

    async showTermsOfUse() {
        const accepted = await hasAcceptedTermsOfUse(this.context.authToken);
        if(!accepted) {
            this.displayModal("termsOfUse", false)
        }
    }

    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps.destroy();
            document.documentElement.className.add("perfect-scrollbar-off");
            document.documentElement.classList.remove("perfect-scrollbar-on");
            this.refs.mainPanel.removeEventListener(
                "ps-scroll-y",
                this.showNavbarButton,
            );
        }
        window.removeEventListener("scroll", this.showNavbarButton);
    }

    componentDidUpdate(e) {
        if (e.location.pathname !== e.history.location.pathname) {
            if (navigator.platform.indexOf("Win") > -1) {
                let tables = document.querySelectorAll(".table-responsive");
                for (let i = 0; i < tables.length; i++) {
                    ps = new PerfectScrollbar(tables[i]);
                }
            }
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
            this.refs.mainPanel.scrollTop = 0;
        }
    }

    showNavbarButton = () => {
        if (
            document.documentElement.scrollTop > 50 ||
            document.scrollingElement.scrollTop > 50 ||
            this.refs.mainPanel.scrollTop > 50
        ) {
            this.setState({ opacity: 1 });
        } else if (
            document.documentElement.scrollTop <= 50 ||
            document.scrollingElement.scrollTop <= 50 ||
            this.refs.mainPanel.scrollTop <= 50
        ) {
            this.setState({ opacity: 0 });
        }
    };

    getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.collapse) {
                return this.getRoutes(prop.views);
            }
            if (prop.layout === "/dashboard") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };

    getActiveRoute = (routes) => {
        let activeRoute = "Default Brand Text";
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveRoute = this.getActiveRoute(routes[i].views);
                if (collapseActiveRoute !== activeRoute) {
                    return collapseActiveRoute;
                }
            } else {
                if (
                    window.location.pathname.indexOf(
                        routes[i].layout + routes[i].path,
                    ) !== -1
                ) {
                    return routes[i].name;
                }
            }
        }
        return activeRoute;
    };

    handleMiniClick = () => {
        document.body.classList.toggle("sidebar-mini");
    };

    toggleSidebar = () => {
        this.setState({
            sidebarOpened: !this.state.sidebarOpened,
        });
        document.documentElement.classList.toggle("nav-open");
    };

    closeSidebar = () => {
        this.setState({
            sidebarOpened: false,
        });
        document.documentElement.classList.remove("nav-open");
    };

    displayModal(option, closable=true) {
        this.setState({
            ...this.state,
            isModalOpen: true,
            modalOption: option,
            closable: closable
        });
    }

    closeModal() {
        this.setState({
            ...this.state,
            isModalOpen: false,
            modalOption: undefined,
        });
    }

    render() {
        return (
            <div className="wrapper">
                <div className="rna-container">
                    <NotificationAlert ref="notificationAlert" />
                </div>
                <div
                    className="navbar-minimize-fixed"
                    style={{ opacity: this.state.opacity }}
                >
                    <button
                        className="minimize-sidebar btn btn-link btn-just-icon"
                        onClick={this.handleMiniClick}
                    >
                        <i className="tim-icons icon-align-center visible-on-sidebar-regular text-muted" />
                        <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini text-muted" />
                    </button>
                </div>
                <Sidebar
                    {...this.props}
                    routes={routes}
                    activeColor={this.state.activeColor}
                    closeSidebar={this.closeSidebar}
                />
                <div
                    className="main-panel"
                    ref="mainPanel"
                    data={this.state.activeColor}
                >
                    <AdminNavbar
                        {...this.props}
                        handleMiniClick={this.handleMiniClick}
                        brandText={this.getActiveRoute(routes)}
                        sidebarOpened={this.state.sidebarOpened}
                        toggleSidebar={this.toggleSidebar}
                        displayOptions={true}
                        showProjectId={() => this.displayModal("showProjectId")}
                    />
                    <Switch>
                        {this.getRoutes(routes)}
                        <Redirect from="*" to="/dashboard/experiments" />
                    </Switch>
                    {/*<Footer fluid />*/}
                </div>
                <Modal
                    isOpen={this.state.isModalOpen}
                    toggle={this.state.closable ? this.closeModal : undefined}
                    modalClassName="modal-black"
                >
                    {this.state.closable &&
                        <div className="modal-header">
                            <button
                                type="button"
                                className="btn-link"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={this.closeModal}
                            >
                                <i className="tim-icons icon-simple-remove"></i>
                            </button>
                        </div>
                    }
                    {this.state.modalOption === "showProjectId" && <ShowProjectID onClose={this.closeModal} />}
                    {this.state.modalOption === "termsOfUse" && <TermsOfUse onClose={this.closeModal} />}
                </Modal>
            </div>
        );
    }
}

DashboardLayout.contextType = AuthorizationContext;
export default DashboardLayout;
