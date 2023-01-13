import * as React from "react";
import DateTime from "../Date/DateTime";
import Logo from "../Logo/Logo";
import Prayer from "../Prayer/Prayer";
import Topbar from "../Topbar/Topbar";
import Weather from "../Weather/Weather";
import { Row, Col } from "antd";
import Sidebar from "../Sidebar/Sidebar";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface INavbarProps {
  context: WebPartContext;
}

export default class Navbar extends React.Component<INavbarProps> {
  public render(): React.ReactElement<INavbarProps> {
    /* const search = require("../../assets/search.svg"); */
    const { context } = this.props;

    return (
      <>
        <Row>
          <Col xs={0} sm={0} md={0} lg={24}>
            <div className="w-100 shadow" style={{ height: "150px" }}>
              <div className="container h-100">
                <div className=" d-flex align-items-center h-100">
                  <Logo context={context} />
                  <div className="w-75 h-100">
                    <Topbar context={context} />
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{ height: "70px" }}
                    >
                      <DateTime />
                      <Weather />
                      <Prayer />
                      {/* <div>
                        <a
                          className="text-decoration-none text-dark"
                          href="https://www.google.com/"
                        >
                          <img src={search} />
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        {/* Mobile View */}
        <Row>
          <Col xs={24} sm={24} md={24} lg={0}>
            <div className="w-100 shadow" style={{ height: "100px" }}>
              <div className="container h-100">
                <div className=" d-flex align-items-center justify-content-between h-100">
                  <Logo context={context} />
                  <Sidebar context={context} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
