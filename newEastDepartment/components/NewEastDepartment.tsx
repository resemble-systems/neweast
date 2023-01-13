import * as React from "react";
import { SPComponentLoader } from "@microsoft/sp-loader";
import "antd/dist/reset.css";
import { Row, Col } from "antd";
import { INewEastDepartmentProps } from "./INewEastDepartmentProps";
import Document from "./document/Document";
import Survey from "./survey/Survey";
import News from "./news/News";
import Announcement from "./announcement/Announcement";
import QuickPolls from "./quickPools/QuickPolls";

interface INewEastDepartmentState {}

export default class NewEastDepartment extends React.Component<
  INewEastDepartmentProps,
  INewEastDepartmentState
> {
  public constructor(
    props: INewEastDepartmentProps,
    state: INewEastDepartmentState
  ) {
    super(props);
    this.state = {};
  }

  public render(): React.ReactElement<INewEastDepartmentProps> {
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    let fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Montserrat =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:wght@600&display=swap";
    let Roboto =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap";
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Montserrat);
    SPComponentLoader.loadCss(Roboto);

    const announcement = require("../assets/announcment.svg");
    const document = require("../assets/document.svg");
    const folder = require("../assets/folderOpen.svg");
    const news = require("../assets/news.svg");
    const { context } = this.props;

    console.log("window.location.pathname", window.location.pathname);
    console.log(
      "context.pageContext.web.absoluteUrl",
      context.pageContext.web.absoluteUrl
    );
    const pageURl = context.pageContext.web.absoluteUrl;
    const currentName = pageURl.split("/");
    console.log("currentName", currentName);
    const length = currentName.length;
    const departmentName = currentName[length - 1];
    console.log("departmentName", departmentName);

    return (
      <div
        className="container"
        style={{ paddingTop: "80px", paddingRight: "0px", paddingLeft: "0px" }}
      >
        <Row className="w-100">
          <Col xs={0} sm={0} md={8} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 shadow-lg bg-white me-3 p-4"
              style={{ height: "125px" }}
            >
              <div className="d-flex justify-content-between align-items-center h-100">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={folder} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Department
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
            <div
              className="border rounded mb-4 shadow-lg bg-white  p-4"
              style={{ height: "125px" }}
            >
              <div className="d-flex justify-content-between align-items-center h-100">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={folder} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Department
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "125px" }}
            >
              <div className="d-flex align-items-center h-100">
                <div>
                  <div
                    className="d-flex  ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Department
                  </div>
                  <div
                    className="d-flex  ps-3"
                    style={{ fontSize: "16px", fontWeight: "500" }}
                  >
                    {departmentName}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          {/* Quick Polls */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4 me-3"
              style={{ height: "520px" }}
            >
              <QuickPolls context={context} />
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "auto" }}
            >
              <QuickPolls context={context} />
            </div>
          </Col>
          {/* News */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 shadow-lg bg-white me-3 p-4"
              style={{ height: "520px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={news} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    News
                  </div>
                </div>
                <div></div>
              </div>
              <div>
                <News context={context} />
              </div>
              <div
                className="d-flex justify-content-center"
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <a
                  className="text-decoration-none text-dark"
                  href={`${context.pageContext.web.absoluteUrl}/SitePages/News.aspx`}
                >
                  View All
                </a>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "auto" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={news} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    News
                  </div>
                </div>
                <div></div>
              </div>
              <div>
                <News context={context} />
              </div>
              <div
                className="d-flex justify-content-center"
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <a
                  className="text-decoration-none text-dark"
                  href={`${context.pageContext.web.absoluteUrl}/SitePages/News.aspx`}
                >
                  View All
                </a>
              </div>
            </div>
          </Col>
          {/* Announcement */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "520px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={announcement} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Anncouncment
                  </div>
                </div>
                <div></div>
              </div>
              <div>
                <Announcement context={context} />
              </div>
              <div
                className="d-flex justify-content-center"
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <a
                  className="text-decoration-none text-dark"
                  href={`${context.pageContext.web.absoluteUrl}/SitePages/Announcements.aspx`}
                >
                  View All
                </a>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "auto" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={announcement} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Announcement
                  </div>
                </div>
                <div></div>
              </div>
              <div>
                <Announcement context={context} />
              </div>
              <div
                className="d-flex justify-content-center"
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <a
                  className="text-decoration-none text-dark"
                  href={`${context.pageContext.web.absoluteUrl}/SitePages/Announcements.aspx`}
                >
                  View All
                </a>
              </div>
            </div>
          </Col>
          {/* Survey */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 me-3 shadow-lg bg-white p-4"
              style={{ height: "520px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={document} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Survey
                  </div>
                </div>
                <div></div>
              </div>
              <div>
                <Survey context={context} />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "520px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={document} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Survey
                  </div>
                </div>
                <div></div>
              </div>
              <div>
                <Survey context={context} />
              </div>
            </div>
          </Col>
          {/* Documents */}
          <Col xs={0} sm={0} md={0} lg={16} xl={16} xxl={16}>
            <div
              className="border rounded mb-4  shadow-lg bg-white p-4"
              style={{ height: "520px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={document} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Documents
                  </div>
                </div>
                <div></div>
              </div>
              <div>
                <Document context={context} />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "520px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={document} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Documents
                  </div>
                </div>
                <div></div>
              </div>
              <div>
                <Document context={context} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
