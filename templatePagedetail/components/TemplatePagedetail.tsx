import * as React from "react";
import styles from "./TemplatePagedetail.module.scss";
import { ITemplatePagedetailProps } from "./ITemplatePagedetailProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { Row, Col, Carousel, Modal,Empty } from "antd";
import "antd/dist/reset.css";

interface ITemplatePagedetailState {
  screenValue: any;
  pagename: any;
  redirect: any;
  isSectionvisible: any;
  isModalOpen: any;

  commentsPost: any;
  modalData: any;
  modalDataID: any;
  links: any;
}

export default class TemplatePagedetail extends React.Component<
  ITemplatePagedetailProps,
  ITemplatePagedetailState
> {
  public constructor(
    props: ITemplatePagedetailProps,
    state: ITemplatePagedetailState
  ) {
    super(props);
    this.state = {
      screenValue: null,
      pagename: "Page",
      redirect: "",
      isSectionvisible: true,
      isModalOpen: false,

      commentsPost: "",
      modalData: {},
      modalDataID: 0,
      links: "",
    };
  }
  public getData: any = () => {
    const { context } = this.props;
    const { modalDataID, isModalOpen, modalData } = this.state;
    let pageInitdetails: any = {};
    let api: any;
    let initDetails: any = window.location.search
      .substring(1)
      .split("&")
      .map(
        (item) => (pageInitdetails[item.split("=")[0]] = item.split("=")[1])
      );
    console.log(
      pageInitdetails,
      "pageinitDetails.lname",
      pageInitdetails.lname
    );

    switch (pageInitdetails.lname) {
      case "announcement":
        console.log("inside case Announcement");
        this.setState({ pagename: "Announcement", isSectionvisible: true });
        api = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items?$select=*&$expand=AttachmentFiles &$filter= Id eq ${pageInitdetails.pid}`;
        break;
      case "news":
        this.setState({ pagename: "News", isSectionvisible: true });
        api = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('News')/items?$select=*&$expand=AttachmentFiles &$filter= Id eq ${pageInitdetails.pid}`;
        break;
      case "survey":
        this.setState({ pagename: "Survey", isSectionvisible: false });
        api = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Survays')/items?$select=*&$expand=AttachmentFiles &$filter= Id eq ${pageInitdetails.pid}`;
        break;
    }
    console.log("api", api);
    console.log(initDetails, "initdetails");
    context.spHttpClient
      .get(api, SPHttpClient.configurations.v1)
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        // console.log("res.json()",res.json());

        return res.json();
      })
      .then((listItems: any) => {
        console.log("IINN");
        console.log(listItems);
        console.log("PageslistItems========>", listItems);
        //this.setState({ screenValue: listItems.value[0] });
        //const sortedItems: any = listItems.value.sort(
        // (a: any, b: any) =>
        //   new Date(b.Created).getTime() - new Date(a.Created).getTime()
        // );
        //  console.log("pageinitdetails", sortedItems);
        //this.setState({ announcementsSortedItems: sortedItems });
        let filteredModalData: any = [];
        if (modalDataID && isModalOpen) {
          filteredModalData = listItems.value.filter((item: any) => {
            return modalDataID === item.ID;
          });
        }
        console.log(filteredModalData, "filteredModalData");

        console.log(modalData, "modalData Comments");

        this.setState({
          screenValue: listItems.value[0],
          modalData: filteredModalData[0] ? filteredModalData[0] : {},
        });
      });

    console.log("pageInitdetails.pp", pageInitdetails.pp);
    switch (pageInitdetails.pp) {
      case "announcement":
        this.setState({
          redirect: `${context.pageContext.web.absoluteUrl}/SitePages/Announcements.aspx`,
        });
        break;
      case "news":
        this.setState({
          redirect: `${context.pageContext.web.absoluteUrl}/SitePages/News.aspx`,
        });
        break;
      case "home":
        this.setState({
          redirect: `${context.pageContext.web.absoluteUrl}/SitePages/Home.aspx`,
        });
        break;
    }
  };

  public componentDidMount() {
    this.getData();
  }
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
    console.log("it is working");
    let pageInitdetails: any = {};
    let initDetails: any = window.location.search
      .substring(1)
      .split("&")
      .map(
        (item) => (pageInitdetails[item.split("=")[0]] = item.split("=")[1])
      );
    console.log(
      initDetails,
      "<=================>",
      pageInitdetails,
      "pagesssssinitDetails.lname",
      pageInitdetails.lname
    );
    let listname: any = "";
    console.log("pageInit.pid", pageInitdetails.pid);
    switch (pageInitdetails.lname) {
      case "announcement":
        listname = "Announcements";
        // this.setState({
        //   links: `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items('${ID}')`,
        // });
        break;

      case "news":
        listname = "News";
        // this.setState({
        //   links: `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('News')/items('${ID}')`,
        // });
        break;
    }
    console.log("Data captured");
    context.spHttpClient
      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listname}')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((r) => {
        console.log(r, "Post Response");
        this.getData();
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
    let pageInitdetails: any = {};
    let initDetails: any = window.location.search
      .substring(1)
      .split("&")
      .map(
        (item) => (pageInitdetails[item.split("=")[0]] = item.split("=")[1])
      );
    console.log(
      initDetails,
      "<=================>",
      pageInitdetails,
      "pagesssssinitDetails.lname",
      pageInitdetails.lname
    );
    let listname: any = "";
    console.log("pageInit.pid", pageInitdetails.pid);
    switch (pageInitdetails.lname) {
      case "announcement":
        listname = "Announcements";
        // this.setState({
        //   links: `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items('${ID}')`,
        // });
        break;

      case "news":
        listname = "News";
        // this.setState({
        //   links: `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('News')/items('${ID}')`,
        // });
        break;
    }
    context.spHttpClient

      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listname}')/items('${ID}')`,

        SPHttpClient.configurations.v1,

        spHttpClintOptions
      )

      .then((r) => {
        console.log(r, "Like Response");

        this.getData();
      });
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
  public render(): React.ReactElement<ITemplatePagedetailProps> {
    // const Joinee = [
    //   { src: require("../assets/sun.jpg") },
    //   { src: require("../assets/road.jpg") },
    //   { src: require("../assets/rail.jpg") },
    // ];
    let carouselOneAction: any = {};
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    // let bootstarp5JS =
    //   "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";

    SPComponentLoader.loadCss(bootstarp5CSS);
    // const passage = [
    //   {
    //     users: "userid",
    //     time: "88 mins ago",
    //     para: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    //   },
    //   {
    //     users: "userid",
    //     time: "88 mins ago",
    //     para: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    //   },
    //   {
    //     users: "userid",
    //     time: "88 mins ago",
    //     para: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    //   },
    // ];
    const {
      screenValue,
      pagename,
      redirect,
      isModalOpen,

      isSectionvisible,
      commentsPost,
      modalData,
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
                  <a href={`${redirect}`}>
                    <img
                      src={require("../assets/arrow-left.svg")}
                      alt="folder"
                      height="20px"
                      width="50px"
                    />
                  </a>
                  {/* <a href="">
                  <img src={ans} alt="folder" height="20px" width="50px" />
                </a> */}
                  {`${pagename} Details`}
                </h4>
              </div>
            </div>
          </Col>
        </Row>
        <Row
          className="mt-3 px-5 py-3 mb-4"
          style={{
            boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
            backgroundColor: " #fff",
            borderRadius: "5px",
          }}
        >
         
          <Col md={12} lg={12} xl={12}>
            <div className="my-5 w-100 h-100" style={{ position: "relative" }}>
              <Carousel
                autoplay={false}
                dots={false}
                ref={(ref) => {
                  carouselOneAction = ref;
                }}
              >
                {screenValue?.AttachmentFiles?.length > 0 ? (
                screenValue?.AttachmentFiles?.map((image: any) => {
                  return (
                    <div className="d-flex h-100 justify-content-center align-items-center">
                        <img className="rounded w-100"  style={{aspectRatio:"1.5/1"}} src=
                            {context.pageContext.web.absoluteUrl

                              .split("/")

                              .slice(0, 3)

                              .join("/") +
                              image.ServerRelativeUrl
                                } />
                                
                    </div>
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
              </Carousel>
              <div
                className="d-flex justify-content-between"
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  top: "36%",
                }}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    carouselOneAction.prev();
                  }}
                >
                  <img className= {`${styles.bannerInfoArrows}`} src={require("../assets/left.svg")} />
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    carouselOneAction.next();
                  }}
                >
                  <img className= {`${styles.bannerInfoArrows}`} src={require("../assets/right.svg")} />
                </div>
              </div>
            </div>
          </Col>
          
          {screenValue ? (
            <>
              <Col xs={0} sm={0} md={10} lg={10}>
                <div className=" ms-4 d-flex justify-content-start align-items-center w-100 h-100">
                  <div>
                    <h4>{screenValue.Title}</h4>
                    <h5>
                      Place :{" "}
                      <span className={`text-secondary`}>
                        {screenValue.Location}
                      </span>
                    </h5>
                    <h5>
                      Date :{" "}
                      <span className={`text-secondary`}>
                        {" "}
                        {moment(screenValue.Date).format("Do MMM YYYY")}
                      </span>
                    </h5>
                    <h5>
                      Time :{" "}
                      <span className={`text-secondary`}>
                        {moment(screenValue.Date).format("h:mm a")}
                      </span>
                    </h5>
                    {isSectionvisible && (
                      <div>
                        <span>
                          <img
                            className="mx-1"
                            style={{ cursor: "pointer" }}
                            src={
                              this.likeImage(screenValue?.Likes)
                                ? heart
                                : heartOutline
                            }
                            alt="heart"
                            height="18px"
                            width="16px"
                            onClick={() => {
                              this.handleLiked(
                                screenValue.ID,
                                screenValue.Likes
                              );
                            }}
                          />

                          {screenValue
                            ? this.likesCount(screenValue?.Likes)
                            : "0"}
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
                                modalData: screenValue,
                                modalDataID: screenValue.ID,
                                isModalOpen: true,
                              });

                              console.log(screenValue, "Modal Data");
                            }}
                          />
                          {screenValue
                            ? this.commentsCount(screenValue?.Comments)
                            : "0"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={0} lg={0}>
                <div className=" d-flex justify-content-start align-items-center w-100 h-100">
                  <div>
                    <h4>{screenValue.Title}</h4>
                    <h5>
                      Place :{" "}
                      <span className={`text-secondary`}>
                        {screenValue.Location}
                      </span>
                    </h5>
                    <h5>
                      Date :{" "}
                      <span className={`text-secondary`}>
                        {moment(screenValue.Date).format("Do MMM YYYY")}
                      </span>
                    </h5>
                    <h5>
                      Time :{" "}
                      <span className={`text-secondary`}>
                        {moment(screenValue.Date).format("h:mm a")}
                      </span>
                    </h5>
                    {isSectionvisible && (
                      <div>
                        <span>
                          <img
                            className="mx-1"
                            style={{ cursor: "pointer" }}
                            src={
                              this.likeImage(screenValue?.Likes)
                                ? heart
                                : heartOutline
                            }
                            alt="heart"
                            height="18px"
                            width="16px"
                            onClick={() => {
                              this.handleLiked(
                                screenValue.ID,
                                screenValue.Likes
                              );
                            }}
                          />

                          {screenValue
                            ? this.likesCount(screenValue?.Likes)
                            : "0"}
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
                                modalData: screenValue,
                                modalDataID: screenValue.ID,
                                isModalOpen: true,
                              });

                              console.log(screenValue.Comments, "Modal Data");
                            }}
                          />
                          {screenValue
                            ? this.commentsCount(screenValue?.Comments)
                            : "0"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className="d-flex justify-content-start align-items-center">
                  <div
                    className={`${styles.description}`}
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#292929",
                      textAlign: "justify",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: screenValue.Description,
                    }}
                  ></div>
                </div>
              </Col>
            </>
          ) : (
            <></>
          )}
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
