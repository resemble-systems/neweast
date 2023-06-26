import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Row, Col, Empty } from "antd";
import Files from "./Files";
import Folder from "./Folder";
import "./index.css";
interface IPolicesProps {
  context: WebPartContext;
}

interface IPolicesState {
  folderFilter: any;
  fileFilter: any;
  innerFiles: any;
  innerFolders: any;
  folderName: any;
  isOpen: boolean;
  PublicationsListItems: any;
  filterRecent: any;
  filterAz: any;
  filterZa: any;
  filterModified: any;
  searchText: any;
  isScreenWidth: any;
  searchState: any;
  isSearchState: any;
  approvedFiles: any;
}

export default class Polices extends React.Component<
  IPolicesProps,
  IPolicesState
> {
  public constructor(props: IPolicesProps, state: IPolicesState) {
    super(props);
    this.state = {
      folderFilter: null,
      fileFilter: null,
      innerFiles: null,
      innerFolders: null,
      folderName: null,
      isOpen: false,
      PublicationsListItems: null,
      filterRecent: true,
      filterAz: false,
      filterZa: false,
      filterModified: false,
      searchText: "",
      isScreenWidth: 800,
      searchState: null,
      isSearchState: false,
      approvedFiles: [],
    };
  }

  public componentDidMount() {
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
        const approvedItems: any = listItems.value.filter(
          (items: any) => items.ApprovalStatus === "Approved"
        );

        this.setState({
          PublicationsListItems: approvedItems,
          approvedFiles: approvedItems,
        });

        console.log(this.state.PublicationsListItems, "Policies");
        const fileFilter: any = approvedItems.filter(
          (item: any) =>
            item.FileRef.split("/")[item.FileRef.split("/").length - 1].split(
              "."
            ).length === 2
        );
        this.setState({ searchState: fileFilter });
        console.log(fileFilter, "searchState");
        if (fileFilter.length > 0) {
          this.getFolderFiles();
        }
      });
  }

  public getFolderFiles: any = () => {
    const { context } = this.props;
    let apiUrl: any;
    switch (context.pageContext.web.absoluteUrl.split("/").length) {
      case 6:
        apiUrl = "Documents";
        break;
      case 5:
        apiUrl = "Shared%20Documents";
        break;
    }
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/Web/GetFolderByServerRelativeUrl('${apiUrl}')?$select=*&$expand=files,Folders`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("New Document listItems Success Structure");
        return res.json();
      })
      .catch((error) => {
        console.log(error, "Document ERROR");
      })
      .then((lisItems: any) => {
        console.log(lisItems, "New Document listItems Success Structure");
        const fileSort: any = lisItems.Files.sort(
          (a: any, b: any) =>
            new Date(b.TimeCreated).getTime() -
            new Date(a.TimeCreated).getTime()
        );
        this.setState({ fileFilter: this.filterFunction(fileSort) });
        const folderSort: any = lisItems.Folders.sort(
          (a: any, b: any) =>
            new Date(b.TimeCreated).getTime() -
            new Date(a.TimeCreated).getTime()
        );
        const formFilter: any = folderSort.filter(
          (items: any) => items.Name !== "Forms"
        );
        this.setState({ folderFilter: formFilter });
      });
  };

  public getInnerFiles: any = (siteUrl: any) => {
    const { context } = this.props;
    let apiUrl: any;
    switch (context.pageContext.web.absoluteUrl.split("/").length) {
      case 6:
        apiUrl = "Documents";
        break;
      case 5:
        apiUrl = "Shared%20Documents";
        break;
    }
    let folderUrl: any;
    switch (context.pageContext.web.absoluteUrl.split("/").length) {
      case 6:
        folderUrl = siteUrl.split("/").slice(5).join("/");
        break;
      case 5:
        folderUrl =  siteUrl.split("/").slice(4).join("/");
        break;
    }
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/GetFolderByServerRelativeUrl('${apiUrl}/${folderUrl}')?$select=*&$expand=files,Folders`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("Inner Structure");
        return res.json();
      })
      .catch((error) => {
        console.log(error, "Document ERROR");
      })
      .then((lisItems: any) => {
        console.log(lisItems, "Inner Structure");
        const fileSort: any = lisItems.Files.sort(
          (a: any, b: any) =>
            new Date(b.TimeCreated).getTime() -
            new Date(a.TimeCreated).getTime()
        );
        console.log(fileSort, "fileSort");
        this.setState({ innerFiles: this.filterFunction(fileSort) });
        const folderSort: any = lisItems.Folders.sort(
          (a: any, b: any) =>
            new Date(b.TimeCreated).getTime() -
            new Date(a.TimeCreated).getTime()
        );
        console.log(folderSort, "folderSort");
        this.setState({ innerFolders: folderSort });
        if (
          folderSort.length === 0 &&
          this.filterFunction(fileSort).length === 0
        ) {
          this.setState({ isOpen: false });
          alert("Folder Empty");
        }
      });
  };

  public filterFunction: any = (arrayItem: any) => {
    let arrayFilter: any = arrayItem.filter((items: any) => {
      return (
        this.state.approvedFiles.filter((itemsOne: any) => {
          return itemsOne.FileRef == items.ServerRelativeUrl;
        }).length != 0
      );
    });
    return arrayFilter;
  };

  public sortAZ: any = () => {
    let BasicState: any = this.state.folderFilter;
    console.log("BasicState", BasicState);
    let sortAZData: any = BasicState.sort((a: any, b: any) => {
      if (a.Name > b.Name) {
        return 1;
      }
      if (a.Name < b.Name) {
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
      if (a.Name > b.Name) {
        return 1;
      }
      if (a.Name < b.Name) {
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
        new Date(b.TimeCreated).getTime() - new Date(a.TimeCreated).getTime()
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
        new Date(b.TimeCreated).getTime() - new Date(a.TimeCreated).getTime()
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
        new Date(b.TimeLastModified).getTime() -
        new Date(a.TimeLastModified).getTime()
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
        new Date(b.TimeLastModified).getTime() -
        new Date(a.TimeLastModified).getTime()
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
      if (b.Name > a.Name) {
        return 1;
      }
      if (b.Name < a.Name) {
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
      if (b.Name > a.Name) {
        return 1;
      }
      if (b.Name < a.Name) {
        return -1;
      }
      return 0;
    });
    console.log(fileAZData, "fileSortingssss");
    this.setState({
      fileFilter: fileAZData,
    });
  };

  public render(): React.ReactElement<IPolicesProps> {
    const {
      innerFiles,
      folderName,
      innerFolders,
      isOpen,
      filterRecent,
      filterAz,
      filterZa,
      filterModified,
      searchText,
      isScreenWidth,
      folderFilter,
      fileFilter,
      approvedFiles,
    } = this.state;
    const { context } = this.props;
    const folderIcon = require("./folder.png");
    const up = require("./up.png");
    console.log(context.pageContext.web.title);
    console.log(context.pageContext.web.serverRelativeUrl);
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
                    src={require("./folder.svg")}
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
                      onClick={() => {
                        this.setState({ isSearchState: true });
                      }}
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
                        this.setState({ searchText: "", isSearchState: false });
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
          <Col xs={24} sm={24} md={24} lg={18}>
            <div
              className={`my-3 p-3`}
              style={{
                height: "560px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
              }}
            >
              {folderFilter?.length > 0 || fileFilter?.length > 0 ? (
                <div  style={{
                  height: "520px", 
                  overflowY: "scroll",
                  scrollbarWidth: "thin",
                }} >
                  {!this.state.isSearchState && (
                    <>
                      {folderFilter?.length > 0 &&
                        folderFilter?.map((driveData: any, index: any) => {
                          return (
                            <div className="ps-3">
                              <div
                                className="d-flex justify-content-between mt-3 mb-3 me-2 border-bottom border-secondary"
                                style={{ fontSize: "16px", fontWeight: "400" }}
                              >
                                <div className="d-flex">
                                  <div className="pb-2">
                                    <img
                                      src={folderIcon}
                                      width="30px"
                                      height="30px"
                                    />
                                  </div>
                                  <div
                                    className="d-flex align-items-center ms-3"
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "500",
                                      pointerEvents: `${
                                        isOpen && folderName === driveData.Name
                                          ? "none"
                                          : "auto"
                                      }`,
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        folderName: driveData.Name,
                                        innerFiles: null,
                                        innerFolders: null,
                                        isOpen: true,
                                      });
                                      this.getInnerFiles(
                                        driveData.ServerRelativeUrl
                                      );
                                    }}
                                  >
                                    {driveData.Name}
                                  </div>
                                </div>
                                {isOpen && folderName === driveData.Name && (
                                  <div
                                    className="pb-2 d-flex align-items-end"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      this.setState({
                                        isOpen: false,
                                        innerFiles: null,
                                        innerFolders: null,
                                      });
                                    }}
                                  >
                                    <img src={up} width="16px" height="16px" />
                                  </div>
                                )}
                              </div>
                              {innerFolders?.length > 0 &&
                                folderName === driveData.Name && (
                                  <Folder
                                    context={context}
                                    innerFiles={innerFiles.filter(
                                      (item: any) => {
                                        return (
                                          item?.Name?.toLowerCase().match(
                                            searchText.toLowerCase()
                                          ) ||
                                          item?.TimeCreated?.toLowerCase().match(
                                            searchText.toLowerCase()
                                          )
                                        );
                                      }
                                    )}
                                    innerFolders={innerFolders}
                                    margin={"ms-3"}
                                    searchText={searchText}
                                    approvedFiles={approvedFiles}
                                  />
                                )}
                              {innerFiles?.length > 0 &&
                                folderName === driveData.Name && (
                                  <Files
                                    context={context}
                                    fileFilter={innerFiles.filter(
                                      (item: any) => {
                                        return (
                                          item?.Name?.toLowerCase().match(
                                            searchText.toLowerCase()
                                          ) ||
                                          item?.TimeCreated?.toLowerCase().match(
                                            searchText.toLowerCase()
                                          )
                                        );
                                      }
                                    )}
                                    margin={"ms-3"}
                                    searchText={searchText}
                                  />
                                )}
                            </div>
                          );
                        })}

                      {fileFilter?.length > 0 && (
                        <Files
                          context={context}
                          fileFilter={fileFilter}
                          margin={""}
                          searchText={searchText}
                        />
                      )}
                    </>
                  )}
                  {this.state.isSearchState &&
                    this.state.searchState?.length > 0 && (
                      <>
                        {this.state.searchState?.length > 0 &&
                          this.state.searchState
                            ?.filter((item: any) => {
                              return (
                                item?.FileRef.split("/")
                                  [
                                    item.FileRef.split("/").length - 1
                                  ]?.toLowerCase()
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
                                  fileIcon = require("./word.png");

                                  break;

                                case "xlsx":
                                  fileIcon = require("./xlsx.png");

                                  break;

                                case "pptx" || "ppt":
                                  fileIcon = require("./ppt.png");

                                  break;

                                case "png":
                                  fileIcon = require("./png.png");

                                  break;
                                case "PNG":
                                  fileIcon = require("./png.png");

                                  break;

                                case "jpg" || "jpeg":
                                  fileIcon = require("./jpeg.png");

                                  break;

                                case "pdf":
                                  fileIcon = require("./pdf.png");

                                  break;

                                default:
                                  fileIcon = require("./word.png");

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
                                driveData.FileRef.split(
                                  context.pageContext.web.title
                                ).length - 1
                              ];
                              let documentUrl = absoluteUrl.concat(subtUrl);
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
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "400",
                                    }}
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
                                          driveData.FileRef.split("/").length -
                                            1
                                        ]
                                      }
                                    </div>
                                  </div>

                                  <hr />
                                </a>
                              );
                            })}
                      </>
                    )}
                </div>
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
