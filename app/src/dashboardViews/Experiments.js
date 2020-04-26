import React from "react";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import { Table } from "reactstrap";

const Experiments = (props) => {
    return (
        <div className="content">
            <Card style={{ width: "80rem", padding: "0.5rem" }}>
                <CardBody>
                    {
                        <CardTitle>
                            <h4>Experiments</h4>
                        </CardTitle>
                    }
                    {/*<CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>*/}
                    <Table stripped>
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
                </CardBody>
            </Card>
        </div>
    );
};

export default Experiments;
