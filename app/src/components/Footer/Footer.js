/*!

=========================================================
* Black Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";
import { Container, Row } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";

class Footer extends React.Component {
  render() {
    return (
      <footer
        className={"footer" + (this.props.default ? " footer-default" : "")}
      >
        <Container fluid={this.props.fluid ? true : false}>
          <ul className="copyright">
            <li className="nav-item">
              <a className="nav-link" /*href="https://www.creative-tim.com"*/>
                Game Gram
              </a>
            </li>{" "}
            <li className="nav-item">
              <a
                className="nav-link"
                /*href="https://www.creative-tim.com/presentation"*/
              >
                About us
              </a>
            </li>{" "}
            <li className="nav-item">
              <a className="nav-link" /*href="https://blog.creative-tim.com"*/>
                Blog
              </a>
            </li>
          </ul>
        </Container>
      </footer>
    );
  }
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool
};

export default Footer;
