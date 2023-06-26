import * as React from "react";

//import { ITemplateDocumentProps } from './ITemplateDocumentProps';
import { SPComponentLoader } from "@microsoft/sp-loader";
//import { MSGraphClientV3 } from "@microsoft/sp-http";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import "./polices/index.css";
import { ITemplateDocumentProps } from "./ITemplateDocumentProps";
import { Row, Col, Empty } from "antd";
import "antd/dist/reset.css";

interface ITemplateDocumentState {
  PublicationsListItems: any;
  filterRecent: any;
  filterAz: any;
  filterZa: any;
  filterModified: any;
  searchText: any;
  isScreenWidth: any;
  folderFilter: any;
  fileFilter: any;
}

export default class TemplateDocument extends React.Component<
  ITemplateDocumentProps,
  ITemplateDocumentState
> {
  public constructor(
    props: ITemplateDocumentProps,
    state: ITemplateDocumentState
  ) {
    super(props);
    this.state = {
      PublicationsListItems: null,
      filterRecent: true,
      filterAz: false,
      filterZa: false,
      filterModified: false,
      searchText: "",
      isScreenWidth: 800,
      fileFilter: null,
      folderFilter: null,
    };
  }
  public componentDidMount() {
    let ScreenWidth: any = window.screen.width;
    console.log(ScreenWidth, "ScreenWidth");
    this.setState({ isScreenWidth: ScreenWidth });
    const { context } = this.props;

    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Documents')/items?$select=ID,FileRef,ApprovalStatus,Created,Modified/FileRef,Editor/Title&$expand=Editor`,

        SPHttpClient.configurations.v1
      )

      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");

        return res.json();
      })

      .catch((error) => {
        console.log(error, "ERROR");
      })

      .then((listItems: any) => {
        console.log("Res Policies listItems", listItems);

        console.log("Policies sortedItems", listItems.value);

        this.setState({
          PublicationsListItems: listItems.value,
        });

        console.log(this.state.PublicationsListItems, "Policies");
        const folderFilter: any = listItems.value.filter(
          (item: any) => item.FileRef.split(".").length === 1
        );
        this.setState({ folderFilter: folderFilter });
        const approvedItems: any = listItems.value; /* .filter(
          (items: any) => items.ApprovalStatus === "Approved"
        ); */
        console.log(approvedItems, "Policies approvedItems");
        const filesFilter: any = approvedItems.filter(
          (items: any) => items.FileRef.split(".").length > 1
        );
        this.setState({
          fileFilter: filesFilter,
        });
        console.log(folderFilter, "folderFilter");
        console.log(filesFilter, "fileFilter");
      });
  }

  public sortAZ: any = () => {
    let BasicState: any = this.state.folderFilter;
    console.log("BasicState", BasicState);
    let sortAZData: any = BasicState.sort((a: any, b: any) => {
      if (a.FileRef > b.FileRef) {
        return 1;
      }
      if (a.FileRef < b.FileRef) {
        return -1;
      }
      return 0;
    });
    console.log(sortAZData, "Sortingssss");
    this.setState({
      folderFilter: sortAZData,
      filterRecent: false,
      filterAz: true,
      filterModified: false,
      filterZa: false,
    });
    let fileState: any = this.state.fileFilter;
    console.log("BasicState", BasicState);
    let fileAZData: any = fileState.sort((a: any, b: any) => {
      if (a.FileRef > b.FileRef) {
        return 1;
      }
      if (a.FileRef < b.FileRef) {
        return -1;
      }
      return 0;
    });
    console.log(fileAZData, "fileSortingssss");
    this.setState({
      fileFilter: fileAZData,
    });
  };
  public sortRecent: any = () => {
    let BasicState: any = this.state.folderFilter;
    console.log("BasicState", BasicState);
    let sortRecentData: any = BasicState.sort(
      (a: any, b: any) =>
        new Date(b.Created).getTime() - new Date(a.Created).getTime()
    );
    console.log(sortRecentData, "Sortingssss");
    this.setState({
      folderFilter: sortRecentData,
      filterRecent: true,
      filterAz: false,
      filterModified: false,
      filterZa: false,
    });
    let fileState: any = this.state.fileFilter;
    console.log("BasicState", BasicState);
    let fileAZData: any = fileState.sort(
      (a: any, b: any) =>
        new Date(b.Created).getTime() - new Date(a.Created).getTime()
    );
    console.log(fileAZData, "fileSortingssss");
    this.setState({
      fileFilter: fileAZData,
    });
  };
  public sortModified: any = () => {
    let BasicState: any = this.state.folderFilter;
    console.log("BasicState", BasicState);
    let sortModifiedData: any = BasicState.sort(
      (a: any, b: any) =>
        new Date(b.Modified).getTime() - new Date(a.Modified).getTime()
    );
    console.log(sortModifiedData, "Sortingssss");
    this.setState({
      folderFilter: sortModifiedData,
      filterRecent: false,
      filterAz: false,
      filterModified: true,
      filterZa: false,
    });
    let fileState: any = this.state.fileFilter;
    console.log("BasicState", BasicState);
    let fileAZData: any = fileState.sort(
      (a: any, b: any) =>
        new Date(b.Modified).getTime() - new Date(a.Modified).getTime()
    );
    console.log(fileAZData, "fileSortingssss");
    this.setState({
      fileFilter: fileAZData,
    });
  };
  public sortZA: any = () => {
    let BasicState: any = this.state.folderFilter;
    console.log("BasicState", BasicState);
    let sortZAData: any = BasicState.sort((a: any, b: any) => {
      if (b.FileRef > a.FileRef) {
        return 1;
      }
      if (b.FileRef < a.FileRef) {
        return -1;
      }
      return 0;
    });
    console.log(sortZAData, "Sortingssss");
    this.setState({
      folderFilter: sortZAData,
      filterRecent: false,
      filterAz: false,
      filterModified: false,
      filterZa: true,
    });
    let fileState: any = this.state.fileFilter;
    console.log("BasicState", BasicState);
    let fileAZData: any = fileState.sort((a: any, b: any) => {
      if (b.FileRef > a.FileRef) {
        return 1;
      }
      if (b.FileRef < a.FileRef) {
        return -1;
      }
      return 0;
    });
    console.log(fileAZData, "fileSortingssss");
    this.setState({
      fileFilter: fileAZData,
    });
  };
  public render(): React.ReactElement<{}> {
    const {
      PublicationsListItems,
      filterRecent,
      filterAz,
      filterZa,
      filterModified,
      searchText,
      isScreenWidth,

      fileFilter,
    } = this.state;

    const { context } = this.props;

    console.log(context.pageContext.web.title);

    console.log(context.pageContext.web.serverRelativeUrl);

    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    // let bootstarp5JS =
    //   "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";

    SPComponentLoader.loadCss(bootstarp5CSS);
    return (
      <div
        className="container px-0"
        style={{ paddingTop: `${isScreenWidth < 768 ? "30px" : "80px"}` }}
      >
        <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div
              className=""
              style={{
                height: "110px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
              }}
            >
              <div className="d-flex align-items-center justify-content-between w-100 h-100">
                <h4 className="d-flex align-items-center justify-content-start ps-4 w-50">
                  <img
                    src={require("../assets/folder.svg")}
                    alt="folder"
                    height="20px"
                    width="50px"
                  />
                  Shared Documents
                </h4>
                <div className="d-flex align-items-center justify-content-end px-3 w-50">
                  <div className="input-group flex-nowrap pe-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search...."
                      aria-label="Username"
                      value={this.state.searchText}
                      onChange={(e) => {
                        var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

                        if (!format.test(e.target.value)) {
                          this.setState({ searchText: e.target.value });
                        }
                      }}
                      style={{ cursor: "pointer" }}
                      aria-describedby="addon-wrapping"
                    />
                    <span
                      className="input-group-text bg-danger text-white"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.setState({ searchText: "" });
                      }}
                      id="addon-wrapping"
                    >
                      <b>X</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={0} sm={0} md={0} lg={6}>
            <div
              className="me-3"
              style={{
                height: "560px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
              }}
            >
              <div className="mt-3 pt-4">
                <ul>
                  <li
                    className="my-3"
                    style={{ color: filterRecent ? "#d10a11" : "#495866" }}
                  >
                    <div
                      style={{
                        color: filterRecent ? "#d10a11" : "#495866",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        this.sortRecent();
                      }}
                    >
                      Recently Created
                    </div>
                  </li>
                  <li
                    className="my-3"
                    style={{ color: filterModified ? "#d10a11" : "#495866" }}
                  >
                    <div
                      style={{
                        color: filterModified ? "#d10a11" : "#495866",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        this.sortModified();
                      }}
                    >
                      Recently Modified
                    </div>
                  </li>
                  <li
                    className="my-3"
                    style={{ color: filterAz ? "#d10a11" : "#495866" }}
                  >
                    <div
                      style={{
                        color: filterAz ? "#d10a11" : "#495866",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        this.sortAZ();
                      }}
                    >
                      Sort A-Z
                    </div>
                  </li>
                  <li
                    className="my-3"
                    style={{ color: filterZa ? "#d10a11" : "#495866" }}
                  >
                    <div
                      style={{
                        color: filterZa ? "#d10a11" : "#495866",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        this.sortZA();
                      }}
                    >
                      Sort Z-A
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col xs={0} sm={0} md={24} lg={18}>
            <div
              className="w-100 my-3 d-flex flex-column justify-content-between"
              style={{
                height: "560px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
                overflowY: "scroll",
                scrollbarWidth: "thin",
              }}
            >
              {PublicationsListItems?.length > 0 ? (
                <>
                  {/* {folderFilter?.length > 0 &&
                    folderFilter
                      ?.filter((item: any) => {
                        return (
                          item?.FileRef.split("/")
                            [item.FileRef.split("/").length - 1]?.toLowerCase()
                            .match(searchText.toLowerCase()) ||
                          item?.Created?.toLowerCase().match(
                            searchText.toLowerCase()
                          ) ||
                          item?.FileRef.split("/")[5]
                            ?.toLowerCase()
                            .match(searchText.toLowerCase())
                        );
                      })
                      ?.map((driveData: any, index: any) => {
                        let fileIcon: any;

                        switch (
                          driveData.FileRef.split(".")[
                            driveData.FileRef.split(".").length - 1
                          ]
                        ) {
                          case "docx" || "doc":
                            fileIcon = require("../assets/word.png");

                            break;

                          case "xlsx":
                            fileIcon = require("../assets/excel.png");

                            break;

                          case "pptx" || "ppt":
                            fileIcon = require("../assets/ppt.png");

                            break;

                          case "png":
                            fileIcon = require("../assets/png.png");

                            break;

                          case "jpg" || "jpeg":
                            fileIcon = require("../assets/jpeg.png");

                            break;

                          case "pdf":
                            fileIcon = require("../assets/pdf.png");

                            break;

                          default:
                            fileIcon = require("../assets/folder.png");

                            break;
                        }

                        console.log(
                          driveData.FileRef.split("/")[
                            driveData.FileRef.split("/").length - 1
                          ],

                          driveData.FileRef.split(
                            context.pageContext.web.title
                          )[
                            driveData.FileRef.split(
                              context.pageContext.web.title
                            ).length - 1
                          ],

                          "Data Policies"
                        );

                        let absoluteUrl: any =
                          context.pageContext.web.absoluteUrl;

                        let subtUrl: any = driveData.FileRef.split(
                          context.pageContext.web.title
                        )[
                          driveData.FileRef.split(context.pageContext.web.title)
                            .length - 1
                        ];
                        let documentUrl: any;
                        switch (absoluteUrl.split("/").length) {
                          case 6:
                            documentUrl = `${absoluteUrl}/`.concat(
                              subtUrl.split("/").splice(4).join("/")
                            );
                            break;

                          default:
                            documentUrl = absoluteUrl.concat(subtUrl);
                        }
                        return (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            data-interception="off"
                            href={documentUrl}
                            className="text-decoration-none text-dark"
                          >
                            <div
                              className="d-flex mb-3 mt-3 mx-3"
                              style={{ fontSize: "16px", fontWeight: "400" }}
                            >
                              <div>
                                <img
                                  src={fileIcon}
                                  width="30px"
                                  height="30px"
                                />
                              </div>

                              <div
                                className="d-flex align-items-center ms-3"
                                style={{ fontSize: "18px", fontWeight: "500" }}
                              >
                                {
                                  driveData.FileRef.split("/")[
                                    driveData.FileRef.split("/").length - 1
                                  ]
                                }
                              </div>
                            </div>

                            <hr />
                          </a>
                        );
                      })} */}
                      <div>
                  {fileFilter?.length > 0 &&
                    fileFilter
                      ?.filter((item: any) => {
                        return (
                          item?.FileRef.split("/")
                            [item.FileRef.split("/").length - 1]?.toLowerCase()
                            .match(searchText.toLowerCase()) ||
                          item?.Created?.toLowerCase().match(
                            searchText.toLowerCase()
                          ) ||
                          item?.FileRef.split("/")[5]
                            ?.toLowerCase()
                            .match(searchText.toLowerCase())
                        );
                      })
                      ?.map((driveData: any, index: any) => {
                        let fileIcon: any;

                        switch (
                          driveData.FileRef.split(".")[
                            driveData.FileRef.split(".").length - 1
                          ]
                        ) {
                          case "docx" || "doc":
                            fileIcon = require("../assets/word.png");

                            break;

                          case "xlsx":
                            fileIcon = require("../assets/excel.png");

                            break;

                          case "pptx" || "ppt":
                            fileIcon = require("../assets/ppt.png");

                            break;

                          case "png":
                            fileIcon = require("../assets/png.png");

                            break;
                          case "PNG":
                            fileIcon = require("../assets/png.png");

                            break;

                          case "jpg" || "jpeg":
                            fileIcon = require("../assets/jpeg.png");

                            break;

                          case "pdf":
                            fileIcon = require("../assets/pdf.png");

                            break;

                          default:
                            fileIcon = require("../assets/word.png");

                            break;
                        }

                        console.log(
                          driveData.FileRef.split("/")[
                            driveData.FileRef.split("/").length - 1
                          ],

                          driveData.FileRef.split(
                            context.pageContext.web.title
                          )[
                            driveData.FileRef.split(
                              context.pageContext.web.title
                            ).length - 1
                          ],

                          "Data Policies"
                        );
                        console.log(driveData.FileRef, "driveData.FileRef");
                        let absoluteUrl: any =
                          context.pageContext.web.absoluteUrl;
                        console.log(absoluteUrl, "absoluteUrl");
                        let subtUrl: any = driveData.FileRef.split(
                          context.pageContext.web.title
                        )[
                          driveData.FileRef.split(context.pageContext.web.title)
                            .length - 1
                        ];
                        console.log(subtUrl, "subtUrl");
                        let documentUrl: any;
                        switch (absoluteUrl.split("/").length) {
                          case absoluteUrl.split("/")[
                            absoluteUrl.split("/").length - 1
                          ] !== "QHSE" && 6:
                            documentUrl = `${absoluteUrl}/`.concat(
                              subtUrl.split("/").splice(4).join("/")
                            );
                            break;

                          default:
                            documentUrl = absoluteUrl.concat(subtUrl);
                        }
                        console.log(documentUrl, "documentUrl");
                        return (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            data-interception="off"
                            href={documentUrl}
                            className="text-decoration-none text-dark"
                          >
                            <div
                              className="d-flex mb-3 mt-3 mx-3"
                              style={{ fontSize: "16px", fontWeight: "400" }}
                            >
                              <div>
                                <img
                                  src={fileIcon}
                                  width="30px"
                                  height="30px"
                                />
                              </div>

                              <div
                                className="d-flex align-items-center ms-3"
                                style={{ fontSize: "18px", fontWeight: "500" }}
                              >
                                {
                                  driveData.FileRef.split("/")[
                                    driveData.FileRef.split("/").length - 1
                                  ]
                                }
                              </div>
                            </div>

                            <hr />
                          </a>
                        );
                      })}
                      </div>
                  <div
                    className="d-flex justify-content-center mb-3"
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    <a
                      className="text-decoration-none text-dark"
                      href={`${
                        context.pageContext.web.absoluteUrl.split("/")
                          .length === 5
                          ? `${context.pageContext.web.absoluteUrl}/Shared Documents/Forms/AllItems.aspx`
                          : `${context.pageContext.web.absoluteUrl}/Documents/Forms/AllItems.aspx`
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View All
                    </a>
                  </div>
                </>
              ) : (
                <Row className="w-100">
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="d-flex w-100 justify-content-center align-items-center">
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <span className="text-secondary">No Data</span>
                        }
                      ></Empty>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          </Col>
          <Col xs={24} sm={24} md={0} lg={0}>
            <div
              className="w-100 my-3 d-flex flex-column justify-content-between"
              style={{
                height: "560px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
                overflowY: "scroll",
              }}
            >
              {PublicationsListItems?.length > 0 ? (
                <>
                  {/*  */}
                  {/* {folderFilter?.length > 0 &&
                    folderFilter
                      ?.filter((item: any) => {
                        return (
                          item?.FileRef.split("/")[4]
                            ?.toLowerCase()
                            .match(searchText.toLowerCase()) ||
                          item?.Created?.toLowerCase().match(
                            searchText.toLowerCase()
                          ) ||
                          item?.FileRef.split("/")[5]
                            ?.toLowerCase()
                            .match(searchText.toLowerCase())
                        );
                      })
                      ?.map((driveData: any, index: any) => {
                        let fileIcon: any;

                        switch (
                          driveData.FileRef.split(".")[
                            driveData.FileRef.split(".").length - 1
                          ]
                        ) {
                          case "docx" || "doc":
                            fileIcon = require("../assets/word.png");

                            break;

                          case "xlsx":
                            fileIcon = require("../assets/excel.png");

                            break;

                          case "pptx" || "ppt":
                            fileIcon = require("../assets/ppt.png");

                            break;

                          case "png":
                            fileIcon = require("../assets/png.png");

                            break;
                          case "PNG":
                            fileIcon = require("../assets/png.png");

                            break;

                          case "jpg" || "jpeg":
                            fileIcon = require("../assets/jpeg.png");

                            break;

                          case "pdf":
                            fileIcon = require("../assets/pdf.png");

                            break;

                          default:
                            fileIcon = require("../assets/folder.png");

                            break;
                        }

                        console.log(
                          driveData.FileRef.split("/")[
                            driveData.FileRef.split("/").length - 1
                          ],

                          driveData.FileRef.split(
                            context.pageContext.web.title
                          )[
                            driveData.FileRef.split(
                              context.pageContext.web.title
                            ).length - 1
                          ],

                          "Data Policies"
                        );

                        let absoluteUrl = context.pageContext.web.absoluteUrl;

                        let subtUrl = driveData.FileRef.split(
                          context.pageContext.web.title
                        )[
                          driveData.FileRef.split(context.pageContext.web.title)
                            .length - 1
                        ];

                        let documentUrl: any;
                        switch (absoluteUrl.split("/").length) {
                          case absoluteUrl.split('/')[absoluteUrl.split('/').length - 1] !== 'QHSE' && 6:
                            documentUrl = `${absoluteUrl}/`.concat(
                              subtUrl.split("/").splice(4).join("/")
                            );
                            break;

                          default:
                            documentUrl = absoluteUrl.concat(subtUrl);
                        }
                        console.log(documentUrl, "documentUrl");
                        // let absoluteUrl = context.pageContext.web.absoluteUrl;
                        // console.log(absoluteUrl, "absoluteUrl");
                        // let subtUrl = driveData.FileRef.split(
                        //   context.pageContext.web.title
                        // )[
                        //   driveData.FileRef.split(context.pageContext.web.title)
                        //     .length - 1
                        // ];
                        // console.log(subtUrl, "subtUrl");
                        // let documentUrl = `${absoluteUrl}/`.concat(
                        //   subtUrl.split("/").splice(4).join("/")
                        // );
                        // console.log(documentUrl, "documentUrl");
                        // let url:any;
                        // switch (subtUrl) {
                        //   case subtUrl.split("/").length <= 3:
                        //     url = `${absoluteUrl}/`.concat(subtUrl);
                        //   case subtUrl.split("/").length > 3:
                        //     url = `${absoluteUrl}/`.concat(
                        //       subtUrl.split("/").splice(4).join("/")
                        //     );
                        // }
                        // console.log(url, "url Check");
                        return (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            data-interception="off"
                            href={documentUrl}
                            className="text-decoration-none text-dark"
                          >
                            <div
                              className="d-flex mb-3 mt-3 mx-3"
                              style={{ fontSize: "16px", fontWeight: "400" }}
                            >
                              <div>
                                <img
                                  src={fileIcon}
                                  width="30px"
                                  height="30px"
                                />
                              </div>

                              <div
                                className="d-flex align-items-center ms-3"
                                style={{ fontSize: "18px", fontWeight: "500" }}
                              >
                                {
                                  driveData.FileRef.split("/")[
                                    driveData.FileRef.split("/").length - 1
                                  ]
                                }
                              </div>
                            </div>

                            <hr />
                          </a>
                        );
                      })} */}
                  <div>
                    {fileFilter?.length > 0 &&
                      fileFilter
                        ?.filter((item: any) => {
                          return (
                            item?.FileRef.split("/")[4]
                              ?.toLowerCase()
                              .match(searchText.toLowerCase()) ||
                            item?.Created?.toLowerCase().match(
                              searchText.toLowerCase()
                            ) ||
                            item?.FileRef.split("/")[5]
                              ?.toLowerCase()
                              .match(searchText.toLowerCase())
                          );
                        })
                        ?.map((driveData: any, index: any) => {
                          let fileIcon: any;

                          switch (
                            driveData.FileRef.split(".")[
                              driveData.FileRef.split(".").length - 1
                            ]
                          ) {
                            case "docx" || "doc":
                              fileIcon = require("../assets/word.png");

                              break;

                            case "xlsx":
                              fileIcon = require("../assets/excel.png");

                              break;

                            case "pptx" || "ppt":
                              fileIcon = require("../assets/ppt.png");

                              break;

                            case "png":
                              fileIcon = require("../assets/png.png");

                              break;

                            case "jpg" || "jpeg":
                              fileIcon = require("../assets/jpeg.png");

                              break;

                            case "pdf":
                              fileIcon = require("../assets/pdf.png");

                              break;

                            default:
                              fileIcon = require("../assets/word.png");

                              break;
                          }

                          console.log(
                            driveData.FileRef.split("/")[
                              driveData.FileRef.split("/").length - 1
                            ],

                            driveData.FileRef.split(
                              context.pageContext.web.title
                            )[
                              driveData.FileRef.split(
                                context.pageContext.web.title
                              ).length - 1
                            ],

                            "Data Policies"
                          );

                          let absoluteUrl = context.pageContext.web.absoluteUrl;

                          let subtUrl = driveData.FileRef.split(
                            context.pageContext.web.title
                          )[
                            driveData.FileRef.split(
                              context.pageContext.web.title
                            ).length - 1
                          ];

                          let documentUrl: any;
                          switch (absoluteUrl.split("/").length) {
                            case absoluteUrl.split("/")[
                              absoluteUrl.split("/").length - 1
                            ] !== "QHSE" && 6:
                              documentUrl = `${absoluteUrl}/`.concat(
                                subtUrl.split("/").splice(4).join("/")
                              );
                              break;

                            default:
                              documentUrl = absoluteUrl.concat(subtUrl);
                          }
                          console.log(documentUrl, "documentUrl");
                          // let absoluteUrl = context.pageContext.web.absoluteUrl;
                          // console.log(absoluteUrl, "absoluteUrl");
                          // let subtUrl = driveData.FileRef.split(
                          //   context.pageContext.web.title
                          // )[
                          //   driveData.FileRef.split(context.pageContext.web.title)
                          //     .length - 1
                          // ];
                          // console.log(subtUrl, "subtUrl");
                          // let documentUrl = `${absoluteUrl}/`.concat(
                          //   subtUrl.split("/").splice(4).join("/")
                          // );
                          // console.log(documentUrl, "documentUrl");
                          // let url:any;
                          // switch (subtUrl) {
                          //   case subtUrl.split("/").length <= 3:
                          //     url = `${absoluteUrl}/`.concat(subtUrl);
                          //   case subtUrl.split("/").length > 3:
                          //     url = `${absoluteUrl}/`.concat(
                          //       subtUrl.split("/").splice(4).join("/")
                          //     );
                          // }
                          // console.log(url, "url Check");
                          return (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              data-interception="off"
                              href={documentUrl}
                              className="text-decoration-none text-dark"
                            >
                              <div
                                className="d-flex mb-3 mt-3 mx-3"
                                style={{ fontSize: "16px", fontWeight: "400" }}
                              >
                                <div>
                                  <img
                                    src={fileIcon}
                                    width="30px"
                                    height="30px"
                                  />
                                </div>

                                <div
                                  className="d-flex align-items-center ms-3"
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {
                                    driveData.FileRef.split("/")[
                                      driveData.FileRef.split("/").length - 1
                                    ]
                                  }
                                </div>
                              </div>

                              <hr />
                            </a>
                          );
                        })}
                  </div>
                  <div
                    className="d-flex justify-content-center mb-3"
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    <a
                      className="text-decoration-none text-dark"
                      href={`${
                        context.pageContext.web.absoluteUrl.split("/")
                          .length === 5
                          ? `${context.pageContext.web.absoluteUrl}/Shared Documents/Forms/AllItems.aspx`
                          : `${context.pageContext.web.absoluteUrl}/Documents/Forms/AllItems.aspx`
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View All
                    </a>
                  </div>
                </>
              ) : (
                <Row className="w-100">
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="d-flex w-100 justify-content-center align-items-center">
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <span className="text-secondary">No Data</span>
                        }
                      ></Empty>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
