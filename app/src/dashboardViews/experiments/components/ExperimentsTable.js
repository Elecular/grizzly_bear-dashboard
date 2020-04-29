import React from "react";
import { Table } from "reactstrap";

/**
 * Renders an experiment table
 */
const ExperimentTable = (props) => {
    console.log(props);
    return (
        <Table>
            <thead className="text-primary">
                <tr>
                    <th className="text-center">#</th>
                    <th>Product Name</th>
                    <th>Type</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Price</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="text-center">1</td>
                    <td>Moleskine Agenda</td>
                    <td>Office</td>
                    <td className="text-center">25</td>
                    <td className="text-right">€ 49</td>
                    <td className="text-right">€ 1,225</td>
                </tr>
            </tbody>
        </Table>
    );
};

export default ExperimentTable;
