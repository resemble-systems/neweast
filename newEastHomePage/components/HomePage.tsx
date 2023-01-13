import * as React from "react";
import { SPComponentLoader } from "@microsoft/sp-loader";
import "antd/dist/reset.css";
import { Row, Col } from "antd";
import { IHomePageProps } from "./IHomePageProps";
import News from "./news/News";
import Announcement from "./announcement/Announcement";
import Birthday from "./birthday/Birthday";
import Polices from "./polices/Polices";
import Employee from "./employee/Employee";
import Document from "./document/Document";
import Survey from "./survey/Survey";
import Application from "./application/Application";
import Gallery from "./gallery/Gallery";
import QuickPolls from "./quickPolls/QuickPolls";
import CalenderNew from "./calender/CalenderNew";
import Newsletters from "./newsletters/Newsletters";
import Proceudures from "./procedures/Procedures";

interface IHomePageState {}
export default class HomePage extends React.Component<
  IHomePageProps,
  IHomePageState
> {
  public constructor(props: IHomePageProps, state: IHomePageState) {
    super(props);
    this.state = {};
  }

  public render(): React.ReactElement<IHomePageProps> {
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

    const anncouncment = require("../assets/announcment.svg");
    const document = require("../assets/document.svg");
    const gallery = require("../assets/gallery.svg");
    const news = require("../assets/news.svg");
    const book = require("../assets/book.svg");
    const calender = require("../assets/calender.svg");

    const { context } = this.props;

    return (
      <div
        className="container"
        style={{ paddingTop: "80px", paddingRight: "0px", paddingLeft: "0px" }}
      >
        <Row className="w-100">
          {/* News */}
          <Col xs={0} sm={0} md={0} lg={9} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 shadow-lg bg-white me-3 p-4"
              style={{ height: "510px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={news} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    News
                  </div>
                </div>
                <div />
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
                    <img src={news} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    News
                  </div>
                </div>
                <div />
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
          <Col xs={0} sm={0} md={0} lg={15} xl={16} xxl={16}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "510px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={anncouncment} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Anncouncment
                  </div>
                </div>
                <div />
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
                    <img src={anncouncment} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Anncouncment
                  </div>
                </div>
                <div />
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
          {/* Birthday */}
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "auto" }}
            >
              <Birthday context={context} />
            </div>
          </Col>
          {/* Polices */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 me-3 shadow-lg bg-white p-4"
              style={{ height: "520px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={book} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Documents
                  </div>
                </div>
                <div />
              </div>
              <div>
                <Polices context={context} />
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
                    <img src={book} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Documents
                  </div>
                </div>
                <div />
              </div>
              <div>
                <Polices context={context} />
              </div>
            </div>
          </Col>
          {/* New Joinee's */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 me-3 shadow-lg bg-white p-4"
              style={{ height: "520px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={calender} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    New Joinee's
                  </div>
                </div>
                <div />
              </div>
              <div>
                <Employee context={context} />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
            <div
              className="border rounded mb-4  shadow-lg bg-white p-4"
              style={{ height: "520px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={calender} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    New Joinee's
                  </div>
                </div>
                <div />
              </div>
              <div>
                <Employee context={context} />
              </div>
            </div>
          </Col>
          {/* Calender */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "520px" }}
            >
              <CalenderNew context={context} />
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "auto" }}
            >
              <CalenderNew context={context} />
            </div>
          </Col>

          {/* Documents */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4 me-3"
              style={{ height: "520px" }}
            >
              <Document context={context} />
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "520px" }}
            >
              <Document context={context} />
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
                    <img src={document} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Survey
                  </div>
                </div>
                <div />
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
                    <img src={document} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Survey
                  </div>
                </div>
                <div />
              </div>
              <div>
                <Survey context={context} />
              </div>
            </div>
          </Col>
          {/* Quicl Pools */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <QuickPolls context={context} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
            <QuickPolls context={context} />
          </Col>
          {/* Application List */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 me-3 shadow-lg bg-white p-4"
              style={{ height: "540px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={document} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Application List
                  </div>
                </div>
                <div />
              </div>
              <div>
                <Application context={context} />
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
                    <img src={document} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Application List
                  </div>
                </div>
                <div />
              </div>
              <div>
                <Application context={context} />
              </div>
            </div>
          </Col>
          {/* Galllery */}
          <Col xs={0} sm={0} md={0} lg={16} xl={16} xxl={16}>
            <div
              className="border rounded mb-4 shadow-lg bg-white p-4"
              style={{ height: "540px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={gallery} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Gallery
                  </div>
                </div>
                <div />
              </div>
              <div style={{ height: "420px" }}>
                <Gallery context={context} />
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
                  href={`${context.pageContext.web.absoluteUrl}/SitePages/Gallery.aspx`}
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
                    <img src={gallery} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Gallery
                  </div>
                </div>
                <div />
              </div>
              <div>
                <Gallery context={context} />
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
                  href={`${context.pageContext.web.absoluteUrl}/SitePages/Gallery.aspx`}
                >
                  View All
                </a>
              </div>
            </div>
          </Col>
          {/* Policy Document */}
          <Col xs={0} sm={0} md={0} lg={8} xl={8} xxl={8}>
            <div
              className="border rounded mb-4 me-3 shadow-lg bg-white p-4"
              style={{ height: "540px" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={document} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Policy & Procedures
                  </div>
                </div>
                <div />
              </div>
              <div>
                <Proceudures context={context} />
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
                    <img src={document} alt="I" />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Policy & Procedures
                  </div>
                </div>
                <div />
              </div>
              <div>
                <Proceudures context={context} />
              </div>
            </div>
          </Col>
          {/* News Letter */}
          <Col xs={0} sm={0} md={0} lg={16} xl={16} xxl={16}>
            <Newsletters context={context} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
            <Newsletters context={context} />
          </Col>
        </Row>
      </div>
    );
  }
}
