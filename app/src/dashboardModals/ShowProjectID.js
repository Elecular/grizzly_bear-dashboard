import React, { useContext } from "react";
import AuthorizationContext from "auth/authorizationContext";
import { Card, CardBody } from "reactstrap";
import { Button, Badge } from "reactstrap";

const ShowProjectID = (props) => {
    const { authToken, project } = useContext(AuthorizationContext);
    return (
        <div
            className="text-center"
            style={{
                padding: "2rem",
            }}
        >
            <h4>Project ID</h4>
            <Card color="primary">
                <CardBody>
                    <p>
                        <b>{project._id}</b>
                    </p>
                </CardBody>
            </Card>
            <p>
                This is your project id. Use this in your Unity Application to
                integrate with us.
            </p>
        </div>
    );
};

export default ShowProjectID;
