import * as React from "react";
import styles from "./TemplateAnnouncement.module.scss";
import { ITemplateAnnouncementProps } from "./ITemplateAnnouncementProps";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { Row, Col, Modal, Empty } from "antd";
import "antd/dist/reset.css";

interface ITemplateAnnouncementState {
  announcementSortedAsRecent: any;
  isModalOpen: any;
  currentPage: number;
  commentsPost: any;
  modalData: any;
  modalDataID: any;
  filterRecent: any;
  filterAz: any;
  filterZa: any;
}

export default class TemplateAnnouncement extends React.Component<
  ITemplateAnnouncementProps,
  ITemplateAnnouncementState
> {
  public constructor(
    props: ITemplateAnnouncementProps,
    state: ITemplateAnnouncementState
  ) {
    super(props);
    this.state = {
      announcementSortedAsRecent: [],
      currentPage: 1,
      isModalOpen: false,
      commentsPost: "",
      modalData: {},
      modalDataID: 0,
      filterRecent: true,
      filterAz: false,
      filterZa: false,
    };
  }
  // public componentDidMount(): void {
  //   const { context } = this.props;
  //   context.spHttpClient
  //     .get(
  //       `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items?$select=*&$expand=AttachmentFiles`,
  //       SPHttpClient.configurations.v1
  //     )
  //     .then((res: SPHttpClientResponse) => {
  //       console.log("listItems Success");
  //       return res.json();
  //     })
  //     .then((listItems: any) => {
  //       console.log("Res listItems", listItems);
  //       const sortedItems: any = listItems.value.sort(
  //         (a: any, b: any) =>
  //           new Date(b.Created).getTime() - new Date(a.Created).getTime()
  //       );
  //       console.log("AnnouncementsSortedItems", sortedItems);
  //       this.setState({ announcementSortedAsRecent: sortedItems });
  //     });
  // }
  public getAnnouncements: any = () => {
    const { context } = this.props;
    const { modalDataID, isModalOpen, modalData } = this.state;
    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Res listItems", listItems);
        const sortedItems: any = listItems.value.sort(
          (a: any, b: any) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        console.log("AnnouncementsSortedItems", sortedItems);

        let filteredModalData: any = [];
        if (modalDataID && isModalOpen) {
          filteredModalData = sortedItems.filter((item: any) => {
            return modalDataID === item.ID;
          });
        }
        console.log(filteredModalData, "filteredModalData");

        console.log(modalData, "modalData Comments");

        this.setState({
          announcementSortedAsRecent: sortedItems,

          modalData: filteredModalData[0] ? filteredModalData[0] : {},
        });
      });
  };
  public componentDidMount(): void {
    this.getAnnouncements();
  }
  public updateLikes = (likeResponse: any, ID: any) => {
    const { context } = this.props;

    const headers: any = {
      "X-HTTP-Method": "MERGE",

      "If-Match": "*",
    };

    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,

      body: JSON.stringify({
        Likes: likeResponse,
      }),
    };

    context.spHttpClient

      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items('${ID}')`,

        SPHttpClient.configurations.v1,

        spHttpClintOptions
      )

      .then((r) => {
        console.log(r, "Like Response");

        this.getAnnouncements();
      });
  };
  public updateItem = (commentResponse: any, ID: any) => {
    const { context } = this.props;
    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Comments: commentResponse,
      }),
    };

    context.spHttpClient
      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((r) => {
        console.log(r, "Post Response");
        this.getAnnouncements();
      });
  };
  public getDateTime = () => {
    var now: any = new Date();
    var monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var date = ("0" + now.getDate()).slice(-2);
    var month = monthNames[now.getMonth()];
    var year = now.getFullYear();
    var hour: any = now.getHours();
    var minute: any = now.getMinutes();
    if (hour.toString().length === 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length === 1) {
      minute = "0" + minute;
    }
    var dateTime = `${date}-${month}-${year} ${hour}:${minute}`;
    return dateTime;
  };
  public handleSubmit = (ID: any, COMMENTS: any, commentsPost: any) => {
    const { context } = this.props;
    let dateTime = this.getDateTime();
    console.log(dateTime, "dateTime");
    let commentsArray = JSON.parse(COMMENTS);
    let result = {
      RespondantName: context.pageContext.user.displayName,
      RespondantEmail: context.pageContext.user.email,
      RespondantComment: commentsPost,
      RespondantDate: dateTime,
    };
    if (!commentsArray) {
      let newComment = [result];
      let commentResponse = JSON.stringify(newComment);
      console.log("commentResponse", commentResponse);
      this.updateItem(commentResponse, ID);
      this.setState({ commentsPost: "" });
    } else {
      let newComment = [...commentsArray, result];
      let commentResponse = JSON.stringify(newComment);
      console.log("commentResponse", commentResponse);
      this.updateItem(commentResponse, ID);
      this.setState({ commentsPost: "" });
    }
  };
  public handleLiked = (ID: any, LIKES: any) => {
    const { context } = this.props;

    let result = {
      RespondantName: context.pageContext.user.displayName,

      RespondantEmail: context.pageContext.user.email,
    };

    let likesArray = JSON.parse(LIKES);

    console.log(likesArray, "TEST");

    let isUserExist: any = [];

    if (likesArray) {
      isUserExist = likesArray.filter(
        (item: any) =>
          item.RespondantName === context.pageContext.user.displayName &&
          item.RespondantEmail === context.pageContext.user.email
      );
    }

    console.log(isUserExist, "isUserExist");

    if (!likesArray) {
      console.log(
        "!likesArray || likesArray.length===0",

        !likesArray

        /* likesArray.length === 0 */
      );

      let likesResult = [result];

      let likesResponse = JSON.stringify(likesResult);

      console.log("likesResult", likesResult);

      console.log("likesResponse", likesResponse);

      this.updateLikes(likesResponse, ID);
    }

    if (isUserExist.length > 0) {
      let likesResult = likesArray.filter(
        (item: any) =>
          item.RespondantName !== context.pageContext.user.displayName &&
          item.RespondantEmail !== context.pageContext.user.email
      );

      console.log("likesResultRemoved", likesResult);

      let likesResponse = JSON.stringify(likesResult);

      this.updateLikes(likesResponse, ID);
    } else {
      let likesResult = [...likesArray, result];

      console.log("likesResultElse", likesResult);

      let likesResponse = JSON.stringify(likesResult);

      this.updateLikes(likesResponse, ID);
    }
  };
  public likesCount: any = (likesData: any) => {
    console.log(likesData, "likesData", JSON.parse(likesData));

    if (!JSON.parse(likesData) || JSON.parse(likesData)?.length === 0) return 0;
    else return JSON.parse(likesData).length;
  };
  public likeImage: any = (likeData: any) => {
    const { context } = this.props;

    let likesArray = JSON.parse(likeData);

    let isUserExist: any = [];

    if (likesArray) {
      isUserExist = likesArray.filter(
        (item: any) =>
          item.RespondantName === context.pageContext.user.displayName &&
          item.RespondantEmail === context.pageContext.user.email
      );
    }

    console.log(isUserExist, "Liked User");

    if (isUserExist.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  public commentsCount: any = (commentsData: any) => {
    console.log(commentsData, "commentsData", JSON.parse(commentsData));

    if (!JSON.parse(commentsData) || JSON.parse(commentsData)?.length === 0)
      return 0;
    else return JSON.parse(commentsData).length;
  };
  public sortAZ: any = () => {
    let BasicState: any = this.state.announcementSortedAsRecent;
    console.log("BasicState", BasicState);
    let sortAZData: any = BasicState.sort((a: any, b: any) => {
      if (a.Title > b.Title) {
        return 1;
      }
      if (a.Title < b.Title) {
        return -1;
      }
      return 0;
    });
    console.log(sortAZData, "Sortingssss");
    this.setState({
      announcementSortedAsRecent: sortAZData,
      filterRecent: false,
      filterAz: true,
      filterZa: false,
    });
  };
  public sortRecent: any = () => {
    let BasicState: any = this.state.announcementSortedAsRecent;
    console.log("BasicState", BasicState);
    let sortRecentData: any = BasicState.sort(
      (a: any, b: any) =>
        new Date(b.Created).getTime() - new Date(a.Created).getTime()
    );
    console.log(sortRecentData, "Sortingssss");
    this.setState({
      announcementSortedAsRecent: sortRecentData,
      filterRecent: true,
      filterAz: false,
      filterZa: false,
    });
  };
  public sortZA: any = () => {
    let BasicState: any = this.state.announcementSortedAsRecent;
    console.log("BasicState", BasicState);
    let sortZAData: any = BasicState.sort((a: any, b: any) => {
      if (b.Title > a.Title) {
        return 1;
      }
      if (b.Title < a.Title) {
        return -1;
      }
      return 0;
    });
    console.log(sortZAData, "Sortingssss");
    this.setState({
      announcementSortedAsRecent: sortZAData,
      filterRecent: false,
      filterAz: false,
      filterZa: true,
    });
  };
  public render(): React.ReactElement<ITemplateAnnouncementProps> {
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    // let bootstarp5JS =
    //   "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";

    SPComponentLoader.loadCss(bootstarp5CSS);

    const {
      announcementSortedAsRecent,
      isModalOpen,

      currentPage,
      commentsPost,
      modalData,
      filterRecent,
      filterAz,
      filterZa,
    } = this.state;
    const { context } = this.props;

    const handleOk = () => {
      this.setState({ isModalOpen: false });
    };
    const handleCancel = () => {
      this.setState({ isModalOpen: false });
    };
    var moment = require("moment");
    const heart = require("../assets/heart.png");
    const heartOutline = require("../assets/hearts.svg");
    const exercisesPerPage = 5;
    const numberOfElements = announcementSortedAsRecent.length;
    const numberOfPages = Math.round(numberOfElements / exercisesPerPage + 0.4);
    //const numberOfPages = numberOfElements / exercisesPerPage;
    const indexOfLastPage = currentPage * exercisesPerPage;
    const indexOfFirstPage = indexOfLastPage - exercisesPerPage;
    const currentData = announcementSortedAsRecent.slice(
      indexOfFirstPage,
      indexOfLastPage
    );
    return (
      <div className="container px-0" style={{ paddingTop: "100px" }}>
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
                <h4 className="d-flex align-items-center justify-content-start ps-4 w-100">
                  <img
                    src={require("../assets/folder.svg")}
                    alt="folder"
                    height="20px"
                    width="50px"
                  />
                  Announcements
                </h4>
              </div>
            </div>
          </Col>
          <Col xs={0} sm={0} md={0} lg={0}>
            <div
              className=""
              style={{
                height: "110px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
              }}
            >
              <div className="ps-5 d-flex justify-content-start align-items-center w-100 h-100">
                <div>
                  <h4>Internal Announcement</h4>

                  <p>20 items</p>
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
                height: "1050px",
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
                      Recent Announcement
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
              className="w-100 my-3"
              style={{
                height: "1050px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
              }}
            >
              <div className="d-flex justify-content-end pt-3 me-3">
                <>
                  <span
                    className="px-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.setState({
                        currentPage:
                          currentPage > 1 ? currentPage - 1 : currentPage - 0,
                      });
                    }}
                  >
                    <img
                      className="bg-dark rounded-circle"
                      src={require("../assets/c-left.svg")}
                      alt="cheveron"
                    />
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "800" }}>
                    {currentPage}
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "800" }}>/</span>
                  <span style={{ fontSize: "16px", fontWeight: "800" }}>
                    {numberOfPages}
                  </span>
                  <span
                    className="px-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.setState({
                        currentPage:
                          currentPage >= numberOfPages
                            ? currentPage + 0
                            : currentPage + 1,
                      });
                    }}
                  >
                    <img
                      className="bg-dark rounded-circle"
                      src={require("../assets/c-right.svg")}
                      alt="cheveron"
                    />
                  </span>
                </>
              </div>
              {currentData?.length > 0 ? (
                currentData.map((announcement: any) => {
                  return (
                    <Row>
                      <Col xs={0} sm={0} md={8} lg={8}>
                        <div className="mx-4 my-3">
                          {announcement?.AttachmentFiles.length > 0 ? (
                            <img
                              src={
                                context.pageContext.web.absoluteUrl

                                  .split("/")

                                  .slice(0, 3)

                                  .join("/") +
                                announcement?.AttachmentFiles[0]
                                  ?.ServerRelativeUrl
                              }
                              height="163px"
                              width="186px"
                              alt="logo"
                            />
                          ) : (
                            <>No Image</>
                          )}
                        </div>
                      </Col>
                      <Col xs={0} sm={0} md={16} lg={16}>
                        <div className="d-flex flex-column my-4">
                          <div
                            className={`${styles.title} mb-1`}
                            style={{
                              fontSize: "16px",
                              fontWeight: "800",
                              color: "#292929",
                            }}
                          >
                            {announcement.Title}
                          </div>
                          <div
                            className={`${styles.description}`}
                            style={{
                              fontSize: "14px",
                              fontWeight: "400",
                              color: "#292929",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: announcement.Description,
                            }}
                          ></div>
                          <div className="mb-1">
                            <a
                              className="text-primary"
                              href={`${context.pageContext.web.absoluteUrl}/SitePages/Page%20Details.aspx?pp=announcement&lname=announcement&pid=${announcement.ID}`}
                              style={{
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              Read More
                            </a>
                          </div>
                          <div>
                            <div
                              className="mb-2"
                              style={{
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#363b40",
                              }}
                            >
                              {announcement.Location}
                              <span className="p-1">
                                |{" "}
                                {/* {new Date(announcement.Date).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}  */}
                                {moment(announcement.Date).format(
                                  "Do MMM YYYY"
                                )}
                              </span>
                              <span className="p-1">
                                |{" "}
                                {/* {`${new Date(
                                announcement.Time
                              ).getHours()}:${new Date(
                                announcement.Time
                              ).getMinutes()}`} */}
                                {moment(announcement.Date).format("h:mm a")}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span>
                              <img
                                className="mx-1"
                                style={{ cursor: "pointer" }}
                                src={
                                  this.likeImage(announcement?.Likes)
                                    ? heart
                                    : heartOutline
                                }
                                alt="heart"
                                height="18px"
                                width="16px"
                                onClick={() => {
                                  this.handleLiked(
                                    announcement.ID,
                                    announcement.Likes
                                  );
                                }}
                              />
                              {this.likesCount(announcement?.Likes)}
                            </span>
                            <span className="mx-3">
                              <img
                                className="mx-1"
                                onClick={() => {
                                  this.setState({
                                    modalData: announcement,
                                    modalDataID: announcement.ID,
                                    isModalOpen: true,
                                  });

                                  console.log(announcement, "Modal Data");
                                }}
                                style={{ cursor: "pointer" }}
                                src={require("../assets/comment.png")}
                                alt="comment"
                                height="18px"
                                width="20px"
                              />
                              {this.commentsCount(announcement?.Comments)}
                            </span>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={0} lg={0}>
                        <div className="mx-4 my-3 d-flex justify-content-center align-items-center">
                        {announcement?.AttachmentFiles.length > 0 ? (
                            <img
                              src={
                                context.pageContext.web.absoluteUrl

                                  .split("/")

                                  .slice(0, 3)

                                  .join("/") +
                                announcement?.AttachmentFiles[0]
                                  ?.ServerRelativeUrl
                              }
                              height="163px"
                              width="186px"
                              alt="logo"
                            />
                          ) : (
                            <>"No Image"</>
                          )}
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={0} lg={0}>
                        <div className="d-flex flex-column my-4 mx-4">
                          <div
                            className= {`${styles.title} mb-1`}
                            style={{
                              fontSize: "16px",
                              fontWeight: "800",
                              color: "#292929",
                            }}
                          >
                            {announcement.Title}
                          </div>
                          <div
                            className={`${styles.description}`}
                            style={{
                              fontSize: "14px",
                              fontWeight: "400",
                              color: "#292929",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: announcement.Description,
                            }}
                          ></div>
                          <div className="mb-1">
                            <a
                              className="text-primary"
                              href={`${context.pageContext.web.absoluteUrl}/SitePages/Page%20Details.aspx?pp=announcement&lname=announcement&pid=${announcement.ID}`}
                              style={{
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              Read More
                            </a>
                          </div>
                          <div>
                            <div
                              className="mb-2"
                              style={{
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#363b40",
                              }}
                            >
                              {announcement.Location}
                              <span className="p-1">
                                |{" "}
                                {/* {new Date(announcement.Date).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )} */}
                                {moment(announcement.Date).format(
                                  "Do MMM YYYY"
                                )}
                              </span>
                              <span className="p-1">
                                |{" "}
                                {/* {`${new Date(
                                announcement.Time
                              ).getHours()}:${new Date(
                                announcement.Time
                              ).getMinutes()}`} */}
                                {moment(announcement.Date).format("h:mm a")}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span>
                              <img
                                className="mx-1"
                                style={{ cursor: "pointer" }}
                                src={
                                  this.likeImage(announcement?.Likes)
                                    ? heart
                                    : heartOutline
                                }
                                alt="heart"
                                height="18px"
                                width="16px"
                                onClick={() => {
                                  this.handleLiked(
                                    announcement.ID,
                                    announcement.Likes
                                  );
                                }}
                              />
                              {this.likesCount(announcement?.Likes)}
                            </span>
                            <span className="mx-3">
                              <img
                                className="mx-1"
                                style={{ cursor: "pointer" }}
                                src={require("../assets/comment.png")}
                                alt="comment"
                                height="18px"
                                width="20px"
                                onClick={() => {
                                  this.setState({
                                    modalData: announcement,
                                    modalDataID: announcement.ID,
                                    isModalOpen: true,
                                  });

                                  console.log(announcement, "Modal Data");
                                }}
                              />
                              {this.commentsCount(announcement?.Comments)}
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  );
                })
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
              className="w-100 my-3"
              style={{
                height: "auto",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
              }}
            >
              <div className="d-flex justify-content-end pt-3 me-3">
                <>
                  <span
                    className="px-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.setState({
                        currentPage:
                          currentPage > 1 ? currentPage - 1 : currentPage - 0,
                      });
                    }}
                  >
                    <img
                      className="bg-dark rounded-circle"
                      src={require("../assets/c-left.svg")}
                      alt="cheveron"
                    />
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "800" }}>
                    {currentPage}
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "800" }}>/</span>
                  <span style={{ fontSize: "16px", fontWeight: "800" }}>
                    {numberOfPages}
                  </span>
                  <span
                    className="px-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.setState({
                        currentPage:
                          currentPage >= numberOfPages
                            ? currentPage + 0
                            : currentPage + 1,
                      });
                    }}
                  >
                    <img
                      className="bg-dark rounded-circle"
                      src={require("../assets/c-right.svg")}
                      alt="cheveron"
                    />
                  </span>
                </>
              </div>
              {currentData?.length > 0 ? (
                currentData.map((announcement: any) => {
                  return (
                    <Row>
                      <Col xs={0} sm={0} md={8} lg={8}>
                        <div className="mx-4 my-3">
                          
                            {announcement?.AttachmentFiles.length > 0 ? (
                              <img
                                src={
                                  context.pageContext.web.absoluteUrl
  
                                    .split("/")
  
                                    .slice(0, 3)
  
                                    .join("/") +
                                  announcement?.AttachmentFiles[0]
                                    ?.ServerRelativeUrl
                                }
                                height="163px"
                                width="186px"
                                alt="logo"
                              />
                            ) : (
                              <>"No Image"</>
                            )}
                        </div>
                      </Col>
                      <Col xs={0} sm={0} md={16} lg={16}>
                        <div className="d-flex flex-column my-4">
                          <div
                            className={`${styles.title} mb-1`}
                            style={{
                              fontSize: "16px",
                              fontWeight: "800",
                              color: "#292929",
                            }}
                          >
                            {announcement.Title}
                          </div>
                          <div
                            className={`${styles.description}`}
                            style={{
                              fontSize: "14px",
                              fontWeight: "400",
                              color: "#292929",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: announcement.Description,
                            }}
                          ></div>
                          <div className="mb-1">
                            <a
                              className="text-primary"
                              href={`${context.pageContext.web.absoluteUrl}/SitePages/Page%20Details.aspx?pp=announcement&lname=announcement&pid=${announcement.ID}`}
                              style={{
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              Read More
                            </a>
                          </div>
                          <div>
                            <div
                              className="mb-2"
                              style={{
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#363b40",
                              }}
                            >
                              {announcement.Location}
                              <span className="p-1">
                                |{" "}
                                {/* {new Date(announcement.Date).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )} */}
                                {moment(announcement.Date).format(
                                  "Do MMM YYYY"
                                )}
                              </span>
                              <span className="p-1">
                                |{" "}
                                {/* {`${new Date(
                                announcement.Time
                              ).getHours()}:${new Date(
                                announcement.Time
                              ).getMinutes()}`} */}
                                {moment(announcement.Date).format("h:mm a")}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span>
                              <img
                                className="mx-1"
                                style={{ cursor: "pointer" }}
                                src={
                                  this.likeImage(announcement?.Likes)
                                    ? heart
                                    : heartOutline
                                }
                                alt="heart"
                                height="18px"
                                width="16px"
                                onClick={() => {
                                  this.handleLiked(
                                    announcement.ID,
                                    announcement.Likes
                                  );
                                }}
                              />
                              {this.likesCount(announcement?.Likes)}
                            </span>
                            <span className="mx-3">
                              <img
                                className="mx-1"
                                style={{ cursor: "pointer" }}
                                src={require("../assets/comment.png")}
                                alt="comment"
                                height="18px"
                                width="20px"
                                onClick={() => {
                                  this.setState({
                                    modalData: announcement,
                                    modalDataID: announcement.ID,
                                    isModalOpen: true,
                                  });

                                  console.log(announcement, "Modal Data");
                                }}
                              />
                              {this.commentsCount(announcement?.Comments)}
                            </span>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="mx-4 my-3 d-flex justify-content-center align-items-center">
                        {announcement?.AttachmentFiles.length > 0 ? (
                            <img
                              src={
                                context.pageContext.web.absoluteUrl

                                  .split("/")

                                  .slice(0, 3)

                                  .join("/") +
                                announcement?.AttachmentFiles[0]
                                  ?.ServerRelativeUrl
                              }
                              height="163px"
                              width="186px"
                              alt="logo"
                            />
                          ) : (
                            <>No Image</>
                          )}
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={16} lg={16}>
                        <div className="d-flex flex-column my-4 mx-4">
                          <div
                            className={`${styles.title} mb-1`}
                            style={{
                              fontSize: "16px",
                              fontWeight: "800",
                              color: "#292929",
                            }}
                          >
                            {announcement.Title}
                          </div>
                          <div
                            className={`${styles.description}`}
                            style={{
                              fontSize: "14px",
                              fontWeight: "400",
                              color: "#292929",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: announcement.Description,
                            }}
                          ></div>
                          <div className="mb-1">
                            <a
                              className="text-primary"
                              href={`${context.pageContext.web.absoluteUrl}/SitePages/Page%20Details.aspx?pp=announcement&lname=announcement&pid=${announcement.ID}`}
                              style={{
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              Read More
                            </a>
                          </div>
                          <div>
                            <div
                              className="mb-2"
                              style={{
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#363b40",
                              }}
                            >
                              {announcement.Location}
                              <span className="p-1">
                                |{" "}
                                {/* {new Date(announcement.Date).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )} */}
                                {moment(announcement.Date).format(
                                  "Do MMM YYYY"
                                )}
                              </span>
                              <span className="p-1">
                                |{" "}
                                {/* {`${new Date(
                                announcement.Time
                              ).getHours()}:${new Date(
                                announcement.Time
                              ).getMinutes()}`} */}
                                {moment(announcement.Date).format("h:mm a")}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span>
                              <img
                                className="mx-1"
                                style={{ cursor: "pointer" }}
                                src={
                                  this.likeImage(announcement?.Likes)
                                    ? heart
                                    : heartOutline
                                }
                                alt="heart"
                                height="18px"
                                width="16px"
                                onClick={() => {
                                  this.handleLiked(
                                    announcement.ID,
                                    announcement.Likes
                                  );
                                }}
                              />
                              {this.likesCount(announcement?.Likes)}
                            </span>
                            <span className="mx-3">
                              <img
                                className="mx-1"
                                style={{ cursor: "pointer" }}
                                src={require("../assets/comment.png")}
                                alt="comment"
                                height="18px"
                                width="20px"
                                onClick={() => {
                                  this.setState({
                                    modalData: announcement,
                                    modalDataID: announcement.ID,
                                    isModalOpen: true,
                                  });

                                  console.log(announcement, "Modal Data");
                                }}
                              />
                              {this.commentsCount(announcement?.Comments)}
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  );
                })
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
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <div
            style={{
              height: "550px",

              overflow: "hidden",
            }}
          >
            <div className=" d-flex mt-4">
              <textarea
                className="form-control"
                rows={3}
                placeholder="Add a comment..."
                required
                value={commentsPost}
                onChange={(e) =>
                  this.setState({
                    commentsPost: e.target.value,
                  })
                }
              ></textarea>
            </div>

            <div className="d-flex justify-content-end my-1">
              <div
                className="p-2 me-1 bg-primary rounded text-white"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (
                    commentsPost !== "" &&
                    commentsPost.split("").length <= 499
                  ) {
                    this.handleSubmit(
                      modalData.ID,

                      modalData.Comments,

                      commentsPost
                    );
                  } else {
                    alert("comments must have 1 to 500 words");
                  }
                }}
              >
                Submit
              </div>
            </div>

            <div
              className={`${styles.scroll}`}
              style={{
                overflowY: "scroll",

                height: "400px",
              }}
            >
              {modalData.Comments &&
                JSON.parse(modalData.Comments)

                  .sort(
                    (a: any, b: any) =>
                      new Date(b.RespondantDate).getTime() -
                      new Date(a.RespondantDate).getTime()
                  )

                  .map((data: any) => {
                    console.log(modalData.Comments, "modalData.Comments");

                    console.log(JSON.parse(modalData.Comments), "JSON.parse");

                    return (
                      <>
                        <div>
                          <div
                            style={{
                              fontSize: "14px",

                              fontWeight: "600",
                            }}
                          >
                            {data.RespondantName}
                          </div>
                        </div>

                        <div className="d-flex">
                          <div
                            className="pe-2"
                            style={{
                              width: "80%",

                              textAlign: "justify",
                            }}
                          >
                            {data.RespondantComment}
                          </div>

                          <div
                            className="d-flex align-items-end text-secondary"
                            style={{ width: "20%" }}
                          >
                            {data.RespondantDate}
                          </div>
                        </div>

                        <hr></hr>
                      </>
                    );
                  })}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
