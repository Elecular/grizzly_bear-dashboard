import React, { useState, useContext, useEffect } from "react";
import { Card } from "reactstrap";
import ProjectList from "./ProjectList";
import AuthorizationContext from "auth/authorizationContext"
import { getMauStats } from "api/userActivity";
import { getAllOwnersAsAdmin, getAllProjectsAsAdmin } from "api/experiments";

/**
 * Renders overview of all projects in elecular
 */
const AllProjectsView = (props) => {

    const [projects, setProjects] = useState([]);
    const [owners, setOwners] = useState({});
    const [mauStats, setMauStats] = useState({});

    const { authToken } = useContext(AuthorizationContext);
    useEffect(() => {
        getAllProjectsAsAdmin(authToken)
        .then(setProjects)
        .catch(err => {
            if(err.status === 403)
                window.location.href = "/";
        });
        getMauStats(authToken).then(setMauStats);
        getAllOwnersAsAdmin(authToken).then(setOwners);
    }, [authToken]);

    if(projects.length === 0 || !owners || !mauStats) {
        return <div className="content" />
    }

    return <div className="content">
        <h4>Projects</h4>
        <Card style={{
            padding: "1.5rem"
        }}>
            <ProjectList 
                projects={projects}
                owners={owners}
                mauStats={mauStats}
            />
        </Card>
    </div>
};

export default AllProjectsView;