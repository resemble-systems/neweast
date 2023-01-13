import * as React from "react";
import { Col } from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

interface IBannerNavProps {
  context: WebPartContext;
}
interface IBannerNavState {
  departmentsAsRecent: any;
}

export default class BannerNav extends React.Component<
  IBannerNavProps,
  IBannerNavState
> {
  public constructor(props: IBannerNavProps, state: IBannerNavState) {
    super(props);
    this.state = {
      departmentsAsRecent: [],
    };
  }

  public componentDidMount(): void {
    const { context } = this.props;

    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Departments')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )

      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })

      .then((listItems: any) => {
        console.log("Departments", listItems);
        const sortedItems: any = listItems.value.sort(
          (a: any, b: any) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        console.log("departmentsAsRecent", sortedItems);
        this.setState({ departmentsAsRecent: sortedItems });
      });
  }

  public render(): React.ReactElement<IBannerNavProps> {
    const { context } = this.props;
    const { departmentsAsRecent } = this.state;
    const announcment = require("./assets/announcment.svg");
    const documents = require("./assets/document.svg");
    /* const events = require("./assets/events.svg"); */
    const gallery = require("./assets/gallery.svg");
    const news = require("./assets/news.svg");
    const folderOpen = require("./assets/folderOpen.svg");
    const chevron = require("./assets/chevron-down.svg");

    const ActivePage = window.location.pathname;
    const CurrentPage = ActivePage.split("/SitePages");

    const AnncouncmentPage =
      CurrentPage[1] === "/Announcements.aspx" ? true : false;
    const DocumentPage = CurrentPage[1] === "/Document.aspx" ? true : false;
    const NewsPage = CurrentPage[1] === "/News.aspx" ? true : false;
    const EventsPage = CurrentPage[1] === "/Events.aspx" ? true : false;
    const DepartmentsPage =
      CurrentPage[1] === "/Departments.aspx" ? true : false;
    const PersonalPage = CurrentPage[1] === "/Personal.aspx" ? true : false;
    const GalleryPage = CurrentPage[1] === "/Gallery.aspx" ? true : false;

    const items: MenuProps["items"] = [
      {
        label: (
          <div>
            {departmentsAsRecent.map((item: any) => {
              return (
                <a
                  className="text-decoration-none text-dark"
                  href={`${context.pageContext.web.absoluteUrl
                    .split("/")
                    .slice(0, 5)
                    .join("/")}/${item.Link}`}
                >
                  <div
                    className="border-bottom border-secondary py-2"
                    style={{
                      fontFamily: "Montserrat",
                      fontWeight: 500,
                      color: "#000000",
                      fontSize: "14px",
                    }}
                  >
                    {item.Title}
                  </div>
                </a>
              );
            })}
          </div>
        ),
        key: "0",
      },
    ];

    const BannerArray = [
      {
        id: 1,
        src: announcment,
        tittle: "Anncouncment",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Announcements.aspx`,
        font: AnncouncmentPage ? 600 : 500,
        color: AnncouncmentPage ? "#AA6768" : "#000000",
        size: AnncouncmentPage ? "16px" : "14px",
      },
      {
        id: 2,
        src: documents,
        tittle: "Document",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Document.aspx`,
        font: DocumentPage ? 600 : 500,
        color: DocumentPage ? "#AA6768" : "#000000",
        size: DocumentPage ? "16px" : "14px",
      },
      {
        id: 3,
        src: gallery,
        tittle: "Gallery",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Gallery.aspx`,
        font: GalleryPage ? 600 : 500,
        color: GalleryPage ? "#AA6768" : "#000000",
        size: GalleryPage ? "16px" : "14px",
      },
      {
        id: 4,
        src: news,
        tittle: "News",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/News.aspx`,
        font: NewsPage ? 600 : 500,
        color: NewsPage ? "#AA6768" : "#000000",
        size: NewsPage ? "16px" : "14px",
      },
      /* {
        id: 5,
        src: events,
        tittle: "Events",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Events.aspx`,
        font: EventsPage ? 600 : 500,
        color: EventsPage ? "#AA6768" : "#000000",
        size: EventsPage ? "16px" : "14px",
      }, */
      {
        id: 6,
        src: folderOpen,
        tittle: "Departments",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Departments.aspx`,
        font: DepartmentsPage ? 600 : 500,
        color: DepartmentsPage ? "#AA6768" : "#000000",
        size: DepartmentsPage ? "16px" : "14px",
      },
      /* {
        id: 7,
        src: folderOpen,
        tittle: "Personal",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Personal.aspx`,
        font: PersonalPage ? 600 : 500,
        color: PersonalPage ? "#AA6768" : "#000000",
        size: PersonalPage ? "16px" : "14px",
      }, */
    ];
    console.log(CurrentPage);
    console.log(
      AnncouncmentPage,
      DocumentPage,
      NewsPage,
      EventsPage,
      DepartmentsPage,
      PersonalPage,
      GalleryPage
    );
    console.log(
      BannerArray.map((arr) => {
        return console.log(arr.font, arr.color);
      })
    );

    return (
      <>
        <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
          <div
            className="w-100 rounded bg-white d-flex justify-content-between shadow-lg"
            style={{ overflowX: "scroll" }}
          >
            {BannerArray.map((item) => {
              return (
                <div key={item.id} className="p-4">
                  <a
                    className="text-decoration-none text-dark"
                    href={item.link}
                  >
                    <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                      <img src={item.src} />
                    </div>
                    <div
                      className="d-flex justify-content-center align-items-center h-50"
                      style={{
                        fontFamily: "Montserrat",
                        fontWeight: item.font,
                        color: item.color,
                        fontSize: item.size,
                      }}
                    >
                      {item.tittle}
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </Col>
        <Col xs={0} sm={0} md={24} lg={24} xl={24} xxl={24}>
          <div className="container rounded bg-white d-flex justify-content-between p-4 shadow-lg">
            <div>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Announcements.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={announcment} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50"
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight: AnncouncmentPage ? 600 : 500,
                    color: AnncouncmentPage ? "#d10a11" : "#000000",
                    fontSize: AnncouncmentPage ? "16px" : "14px",
                  }}
                >
                  Anncouncment
                </div>
              </a>
            </div>
            <div>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Document.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={documents} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50"
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight: DocumentPage ? 600 : 500,
                    color: DocumentPage ? "#d10a11" : "#000000",
                    fontSize: DocumentPage ? "16px" : "14px",
                  }}
                >
                  Document
                </div>
              </a>
            </div>
            <div>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Gallery.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={gallery} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50"
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight: GalleryPage ? 600 : 500,
                    color: GalleryPage ? "#d10a11" : "#000000",
                    fontSize: GalleryPage ? "16px" : "14px",
                  }}
                >
                  Gallery
                </div>
              </a>
            </div>
            <div>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/News.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={news} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50"
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight: NewsPage ? 600 : 500,
                    color: NewsPage ? "#d10a11" : "#000000",
                    fontSize: NewsPage ? "16px" : "14px",
                  }}
                >
                  News
                </div>
              </a>
            </div>
            <div>
              <div
                className="d-flex justify-content-center align-items-center pb-1 h-50"
                style={{ cursor: "pointer" }}
              >
                <img src={folderOpen} />
              </div>
              <Dropdown menu={{ items }} placement="bottomRight">
                <a
                  className="text-decoration-none text-dark"
                  onClick={(e) => e.preventDefault()}
                >
                  <Space className="h-50" style={{ gap: "0px" }}>
                    <div
                      className="d-flex justify-content-center align-items-center "
                      style={{
                        fontFamily: "Montserrat",
                        fontWeight: DepartmentsPage ? 600 : 500,
                        color: DepartmentsPage ? "#d10a11" : "#000000",
                        fontSize: DepartmentsPage ? "16px" : "14px",
                      }}
                    >
                      Departments
                      <img className="mb-1 ps-1" src={chevron} />
                    </div>
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
        </Col>
      </>
    );
  }
}
