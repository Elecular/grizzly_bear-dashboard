
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  UncontrolledTooltip
} from "reactstrap";

import fullLogo from "assets/img/full-logo.png";
import { logout } from "auth/login";

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent",
    };
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white"
      });
    } else {
      this.setState({
        color: "navbar-transparent"
      });
    }
  };
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent"
      });
    } else {
      this.setState({
        color: "bg-white"
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch
    });
  };

  render() {
    return (
      <>
        <Navbar
          className={classNames("navbar-absolute", {
            [this.state.color]:
              this.props.location.pathname.indexOf("full-screen-map") === -1
          })}
          expand="lg"
        >
          <Container fluid>
            <div className="navbar-wrapper">
              <div className="navbar-minimize d-inline">
                <Button
                  className="minimize-sidebar btn-just-icon"
                  color="link"
                  id="tooltip209599"
                  onClick={this.props.handleMiniClick}
                >
                  <i className="tim-icons icon-align-center visible-on-sidebar-regular" />
                  <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini" />
                </Button>
                <UncontrolledTooltip
                  delay={0}
                  target="tooltip209599"
                  placement="right"
                >
                  Sidebar toggle
                </UncontrolledTooltip>
              </div>
              <div
                className={classNames("navbar-toggle d-inline", {
                  toggled: this.props.sidebarOpened
                })}
              >
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.props.toggleSidebar}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
                <div className="logo-img">
                  <img
                    src={fullLogo}
                    style={{
                      height: "40px",
                      paddingBottom: "10px"
                    }}
                  />
                </div>
              </NavbarBrand>
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navigation"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
            </button>
            {this.props.displayOptions &&
              <Collapse navbar isOpen={this.state.collapseOpen}>
                <Nav className="ml-auto" navbar>
                  <UncontrolledDropdown nav>
                    <DropdownToggle
                      caret
                      color="default"
                      data-toggle="dropdown"
                      nav
                    >
                      <i className="tim-icons icon-single-02" />
                      <p className="d-lg-none">Profile</p>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-navbar" right tag="ul">
                      <NavLink tag="li" onClick={this.props.showProjectId}>
                        <DropdownItem className="nav-item">Show Project ID</DropdownItem>
                      </NavLink>
                      <NavLink tag="li">
                        <DropdownItem className="nav-item" href="https://storage.googleapis.com/downloads.elecular.com/Elecular.unitypackage" download="Elecular.unitypackage">
                          Download Unity SDK
                      </DropdownItem>
                      </NavLink>
                      <DropdownItem divider tag="li" />
                      <NavLink
                        tag="li"
                        onClick={() => {
                          logout();
                        }}
                      >
                        <DropdownItem className="nav-item">Log out</DropdownItem>
                      </NavLink>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <li className="separator d-lg-none" />
                </Nav>
              </Collapse>
            }
          </Container>
        </Navbar>
        <Modal
          modalClassName="modal-search"
          isOpen={this.state.modalSearch}
          toggle={this.toggleModalSearch}
        >
          <div className="modal-header">
            <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text" />
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.toggleModalSearch}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
        </Modal>
      </>
    );
  }
}

export default AdminNavbar;
