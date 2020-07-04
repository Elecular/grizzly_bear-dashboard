import React, { useState, useContext, useEffect } from "react";
import { Card } from "reactstrap";
import AuthorizationContext from "auth/authorizationContext"

const ProjectView = (props) => {
    const { authToken } = useContext(AuthorizationContext);

    return <div className="content">
        <h4>Projects</h4>
        <Card style={{
            padding: "1.5rem"
        }}>
            <h4>Hello world</h4>
        </Card>
    </div>
};

export default ProjectView;