import React, { useContext } from "react";
import AuthorizationContext from "auth/authorizationContext";
import { Button } from "reactstrap";
import { logout } from "../auth/login";
import { acceptTermsOfUse } from "../api/experiments";

const TermsOfUse = (props) => {
    const { authToken } = useContext(AuthorizationContext);
    const buttonStyle = {
        marginLeft: "1rem",
        marginRight: "1rem"
    }
    const {
        onClose
    } = props;
    return (
        <div
            className="text-center"
            style={{
                padding: "2rem",
            }}
        >
            <h4>Terms Of Service</h4>
            <p>
                Please accept our <a href="https://google.com" target="_blank">Terms Of Service</a> before using our application
            </p>
            <div style={{
                marginTop: "1rem"
            }}>
                <Button 
                    color="danger" 
                    style={buttonStyle} 
                    onClick={() => {
                        logout();
                    }}
                >
                    Decline
                </Button>
                <Button 
                    color="primary" 
                    style={buttonStyle} 
                    onClick={() => {
                        accept(authToken);
                        onClose();
                    }}
                >
                    Accept
                </Button>
            </div>
        </div>
    );
};

const accept = async (authToken) => {
    acceptTermsOfUse(authToken)
}

export default TermsOfUse;
