import React from "react";
import { Table } from "reactstrap";
import moment from "moment";

const ProjectList = (props) => {
    const { projects, owners, mauStats } = props;

    return (
        <Table>
            <thead className="text-primary">
                <tr>
                    <th className="text-muted">Project Id</th>
                    <th className="text-muted">Owner Email</th>
                    <th className="text-muted">Number Of Logins</th>
                    <th className="text-muted">Last Login</th>
                    <th className="text-muted">MAU</th>
                </tr>
            </thead>
            <tbody>
            {projects.map((project) => (
                    <tr
                        key={project._id}
                        onClick={() => {
                            window.location.href = `/admin/overview/project/${project._id}`;
                        }}
                    >
                        <td component="th" scope="row">
                            {project._id}
                        </td>
                        <td >
                            {owners[project.ownerId]
                                ? owners[project.ownerId].email
                                : "N/A"}
                        </td>
                        <td >
                            {owners[project.ownerId]
                                ? owners[project.ownerId].logins_count
                                : "N/A"}
                        </td>
                        <td >
                            {owners[project.ownerId]
                                ? moment(
                                      owners[project.ownerId].last_login,
                                  ).format("MMM DD YYYY")
                                : "N/A"}
                        </td>
                        <td >
                            {mauStats[project._id] ? mauStats[project._id] : 0}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ProjectList;
