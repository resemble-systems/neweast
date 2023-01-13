import * as React from "react";
import { Row, Col, Modal, Empty } from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import styles from "../HomePage.module.scss";

interface IAnnouncementProps {
  context: WebPartContext;
}

interface IAnnouncementState {
  announcementSortedAsRecent: any;
  isModalOpen: any;
  commentsPost: any;
  modalData: any;
  modalDataID: any;
}

export default class Announcement extends React.Component<
  IAnnouncementProps,
  IAnnouncementState
> {
  public constructor(props: IAnnouncementProps, state: IAnnouncementState) {
    super(props);
    this.state = {
      announcementSortedAsRecent: [],
      isModalOpen: false,
      commentsPost: "",
      modalData: {},
      modalDataID: 0,
    };
  }
  public componentDidMount(): void {
    this.getAnnouncements();
  }

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
    let commentsArray: [] = JSON.parse(COMMENTS);
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

  public commentsCount: any = (commentsData: any) => {
    console.log(commentsData, "commentsData", JSON.parse(commentsData));

    if (!JSON.parse(commentsData) || JSON.parse(commentsData)?.length === 0)
      return 0;
    else return JSON.parse(commentsData).length;
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

  public render(): React.ReactElement<IAnnouncementProps> {
    const heart = require("./assets/heart.png");
    const heartOutline = require("./assets/heartsOutline.svg");
    const comment = require("./assets/comment.png");
    const alternate = require("../../assets/alternate.svg");

    const { announcementSortedAsRecent, isModalOpen, commentsPost, modalData } =
      this.state;
    const { context } = this.props;
    var moment = require("moment");

    const handleOk = () => {
      this.setState({ isModalOpen: false });
    };

    const handleCancel = () => {
      this.setState({ isModalOpen: false });
    };

    return (
      <>
        <div className="">
          <Row>
            <Col xs={0} sm={0} md={24} lg={24}>
              {announcementSortedAsRecent?.length > 0 ? (
                <div className="w-100 bg-white">
                  {announcementSortedAsRecent
                    .slice(0, 2)
                    .map((announcement: any) => {
                      return (
                        <Row key={announcement.ID}>
                          <Col xs={0} sm={0} md={8} lg={8} xl={6}>
                            <div className=" my-3">
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
                                <img
                                  src={alternate}
                                  height="163px"
                                  width="186px"
                                  alt="logo"
                                />
                              )}
                            </div>
                          </Col>
                          <Col xs={0} sm={0} md={16} lg={16} xl={18}>
                            <div className="d-flex flex-column ms-3 my-4">
                              <div
                                className={`${styles.headingOne} mb-1`}
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
                                  href={`${context.pageContext.web.absoluteUrl}/SitePages/Page%20Details.aspx?pp=home&lname=announcement&pid=${announcement.ID}`}
                                  style={{
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Read More
                                </a>
                              </div>
                              <div
                                className="mb-2"
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "400",
                                  color: "#363b40",
                                }}
                              >
                                {announcement.Location} |{" "}
                                {moment(announcement.Date).format(
                                  "Do MMM YYYY"
                                )}{" "}
                                | {moment(announcement.Date).format("h:mm a")}
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
                                <span
                                  style={{ cursor: "pointer" }}
                                  className="mx-3"
                                  onClick={() => {
                                    this.setState({
                                      modalDataID: announcement.ID,
                                      modalData: announcement,
                                      isModalOpen: true,
                                    });
                                    console.log(announcement, "Modal Data");
                                  }}
                                >
                                  <img
                                    className="mx-1"
                                    src={comment}
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
                            <div className="me-4 my-3 d-flex justify-content-center align-items-center">
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
                                <img
                                  src={alternate}
                                  height="163px"
                                  width="186px"
                                  alt="logo"
                                />
                              )}
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={0} lg={0}>
                            <div className="d-flex flex-column my-4 mx-4">
                              <div
                                className={`${styles.headingOne} mb-1`}
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
                                  href={`${context.pageContext.web.absoluteUrl}/SitePages/Page%20Details.aspx?pp=home&lname=announcement&pid=${announcement.ID}`}
                                  style={{
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Read More
                                </a>
                              </div>
                              <div
                                className="mb-2"
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "400",
                                  color: "#363b40",
                                }}
                              >
                                {announcement.Location} |{" "}
                                {moment(announcement.Date).format(
                                  "Do MMM YYYY"
                                )}{" "}
                                | {moment(announcement.Date).format("h:mm a")}
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
                                  />
                                  {this.likesCount(announcement?.Likes)}
                                </span>
                                <span
                                  className="mx-3"
                                  onClick={() => {
                                    this.setState({
                                      modalDataID: announcement.ID,
                                      modalData: announcement,
                                      isModalOpen: true,
                                    });
                                    console.log(announcement, "Modal Data");
                                  }}
                                >
                                  <img
                                    className="mx-1"
                                    src={comment}
                                    alt="comment"
                                    height="18px"
                                    width="20px"
                                  />
                                  {this.commentsCount(announcement?.Comments)}
                                </span>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
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
            </Col>
            <Col xs={24} sm={24} md={0} lg={0}>
              {announcementSortedAsRecent?.length > 0 ? (
                <div className="w-100 my-3 bg-white">
                  {announcementSortedAsRecent
                    .slice(0, 2)
                    .map((announcement: any) => {
                      return (
                        <Row key={announcement.ID}>
                          <Col xs={24} sm={24}>
                            <div className="me-4 my-3 d-flex justify-content-center align-items-center">
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
                                <img
                                  src={alternate}
                                  height="163px"
                                  width="186px"
                                  alt="logo"
                                />
                              )}
                            </div>
                          </Col>
                          <Col xs={24} sm={24}>
                            <div className="d-flex flex-column my-4 mx-4">
                              <div
                                className={`${styles.headingOne} mb-1`}
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
                                  href={`${context.pageContext.web.absoluteUrl}/SitePages/Page%20Details.aspx?pp=home&lname=announcement&pid=${announcement.ID}`}
                                  style={{
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Read More
                                </a>
                              </div>
                              <div
                                className="mb-2"
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "400",
                                  color: "#363b40",
                                }}
                              >
                                {announcement.Location} |{" "}
                                {moment(announcement.Date).format(
                                  "Do MMM YYYY"
                                )}{" "}
                                | {moment(announcement.Date).format("h:mm a")}
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
                                  />
                                  {this.likesCount(announcement?.Likes)}
                                </span>
                                <span
                                  className="mx-3"
                                  onClick={() => {
                                    this.setState({
                                      modalDataID: announcement.ID,
                                      modalData: announcement,
                                      isModalOpen: true,
                                    });
                                    console.log(announcement, "Modal Data");
                                  }}
                                >
                                  <img
                                    className="mx-1"
                                    src={comment}
                                    alt="comment"
                                    height="18px"
                                    width="20px"
                                  />
                                  {this.commentsCount(announcement?.Comments)}
                                </span>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
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
            </Col>
          </Row>
        </div>
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
                    commentsPost.split("").length <= 250
                  ) {
                    this.handleSubmit(
                      modalData.ID,
                      modalData.Comments,
                      commentsPost
                    );
                  } else {
                    alert("Comments must have 1 to 250 words");
                  }
                }}
              >
                Submit
              </div>
            </div>
            {modalData.Comments ? (
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
                      console.log(
                        JSON.parse(modalData?.Comments),
                        "JSON.parse"
                      );
                      return (
                        <div key={data.RespondantEmail}>
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
                                width: "70%",
                                textAlign: "justify",
                              }}
                            >
                              {data.RespondantComment}
                            </div>

                            <div
                              className="d-flex align-items-end text-secondary"
                              style={{
                                width: "30%",
                                fontSize: "10px",
                                fontWeight: "600",
                              }}
                            >
                              {data.RespondantDate}
                            </div>
                          </div>
                          <hr></hr>
                        </div>
                      );
                    })}
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
        </Modal>
      </>
    );
  }
}
