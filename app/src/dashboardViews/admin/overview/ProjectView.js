import React, { useState, useContext, useEffect } from "react";
import { Card } from "reactstrap";
import AuthorizationContext from "auth/authorizationContext"
import PerformanceGraphCard from "./PerformanceGraphCard";
import { useParams } from "react-router-dom";
import { getProjectDetailsAsAdmin } from "api/experiments";
import { getPerformanceStats } from "api/userActivity";

/**
 * Overview of a single project
 */
const ProjectView = (props) => {

    const { projectId } = useParams();
    const { authToken } = useContext(AuthorizationContext);
    const [performanceStats, setPerformanceStats] = useState([]);
    const [project, setProject] = useState({});

    useEffect(() => {
        getPerformanceStats(authToken, projectId).then(setPerformanceStats);
        getProjectDetailsAsAdmin(authToken, projectId).then(setProject);
    }, [authToken, projectId]);

    if (!project || !performanceStats) {
        return (
            <div className="content">
                <Card></Card>
            </div>
        );
    }

    return <div className="content">
        <div style={{ display: "flex" }}>
            <Card style={{ padding: "1.5rem", "margin": "1.5rem" }}>
                <h4>Project Details</h4>
                <h6 className="text-muted" style={{ marginTop: "1rem" }}>Project Id:</h6>
                <p>{projectId}</p>
                <h6 className="text-muted" style={{ marginTop: "1rem" }}>Owner Email:</h6>
                <p>{project.owner ? project.owner.email : "N/A"}</p>
                <h6 className="text-muted" style={{ marginTop: "1rem" }}>Login Count:</h6>
                <p>{project.owner ? project.owner.logins_count : "N/A"}</p>
                <h6 className="text-muted" style={{ marginTop: "1rem" }}>Last Login:</h6>
                <p>{project.owner ? project.owner.last_login : "N/A"}</p>
            </Card>
            <PerformanceGraphCard
                header={"Ad Clicks Per Session"}
                performanceStats={performanceStats}
                userAction={"ads/click"}
            />
        </div>
        <div style={{ display: "flex" }}>
            <PerformanceGraphCard
                header={"Transactions Per Session"}
                performanceStats={performanceStats}
                userAction={"transactions/complete"}
            />
            <PerformanceGraphCard
                header={"1 Day Retention"}
                performanceStats={performanceStats}
                userAction={"retention/Day 1"}
            />
        </div>
        <div style={{ display: "flex" }}>
            <PerformanceGraphCard
                header={"7 Day Retention"}
                performanceStats={performanceStats}
                userAction={"retention/Day 7"}
            />
            <PerformanceGraphCard
                header={"30 Day Retention"}
                performanceStats={performanceStats}
                userAction={"retention/Day 30"}
            />
        </div>
    </div>
};

export default ProjectView;