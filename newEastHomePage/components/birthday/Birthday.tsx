import * as React from "react";
import { Row, Col } from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import styles from "../HomePage.module.scss";
import { Empty } from "antd";

interface IBirthdayProps {
  context: WebPartContext;
}

interface IBirthdayState {
  birthdayAsRecent: any;
}

export default class Birthday extends React.Component<
  IBirthdayProps,
  IBirthdayState
> {
  public constructor(props: IBirthdayProps, state: IBirthdayState) {
    super(props);
    this.state = {
      birthdayAsRecent: [],
    };
  }
  public componentDidMount(): void {
    const { context } = this.props;

    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('BirthDay')/items?$top=1000&$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )

      .then((res: SPHttpClientResponse) => {
        console.log("listItems  birthday Success");
        return res.json();
      })

      .then((listItems: any) => {
        console.log("Res birthday listItems", listItems);
        const sortedItems: any = listItems.value.sort(
          (a: any, b: any) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        console.log("sortedItems", sortedItems);

        const currentMonth = new Date().getMonth() + 1;
        console.log("currentMonth", currentMonth);

        const nullFilter = sortedItems.filter((item: any) => {
          return item.Date !== null;
        });

        const currentMonthBirthday = nullFilter.filter((item: any) => {
          console.log("nullFilter", nullFilter);
          console.log("month", item.Date.split("-")[1]);
          var month = item.Date.split("-")[1];
          return currentMonth === +month;
        });

        const sortedItemsByDate: any = currentMonthBirthday.sort(
          (a: any, b: any) =>
            new Date(a.Date).getDate() - new Date(b.Date).getDate()
        );
        console.log("sortedItemsByDate", sortedItemsByDate);

        console.log("currentMonthBirthday", currentMonthBirthday);

        console.log("birthdayAsRecent", sortedItemsByDate);
        this.setState({ birthdayAsRecent: sortedItemsByDate });
      });
  }

  public render(): React.ReactElement<IBirthdayProps> {
    const cake = require("./cake.svg");
    const userImg = require("./userImg.jpg");
    const nameOfMonth = new Date().toLocaleString("default", { month: "long" });
    const { birthdayAsRecent } = this.state;
    const { context } = this.props;
    var moment = require("moment");
    const birthdayCount = birthdayAsRecent.length;
    console.log("birthdayAsRecentState", birthdayAsRecent);

    return (
      <div>
        <Row>
          <Col xs={0} sm={0} md={0} lg={6} xl={6} xxl={6}>
            <div
              className="d-flex align-items-center"
              style={{ height: "250px" }}
            >
              <div style={{ width: "317px" }}>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ fontSize: "42px", fontWeight: "700" }}
                >
                  {nameOfMonth}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div>
                    <img src={cake} alt="F" />
                  </div>
                  <div
                    className="ms-2"
                    style={{ fontSize: "22px", fontWeight: "700" }}
                  >
                    {`${birthdayCount} Birthdays`}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={0} sm={0} md={0} lg={18} xl={18} xxl={18}>
            {birthdayAsRecent?.length > 0 ? (
              <div
                className="d-flex align-items-center ms-3 scroll"
                style={{
                  height: "250px",
                  overflowX: "scroll",
                  overflowY: "hidden",
                }}
              >
                {birthdayAsRecent.map((birthday: any) => {
                  return (
                    <div
                      className="m-3"
                      style={{ width: "auto" }}
                      key={birthday.ID}
                    >
                      <div className="d-flex justify-content-center">
                        {birthday?.AttachmentFiles.length > 0 ? (
                          <img
                            src={
                              context.pageContext.web.absoluteUrl
                                .split("/")
                                .slice(0, 3)
                                .join("/") +
                              birthday?.AttachmentFiles[0]?.ServerRelativeUrl
                            }
                            className="rounded-circle"
                            width="150px"
                            height="150px"
                            alt="Birthday"
                          />
                        ) : (
                          <img
                            src={userImg}
                            className="rounded-circle"
                            width="150px"
                            height="150px"
                            alt="Birthday"
                          />
                        )}
                      </div>
                      <div
                        className={`d-flex justify-content-center text-center`}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            width: "max-content",
                          }}
                        >
                          {birthday.Title}
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-center"
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#4fb3dd",
                        }}
                      >
                        {moment(birthday.Date).format("MMM D").toUpperCase()}
                      </div>
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
                        <span className="text-secondary">No Birthday</span>
                      }
                    ></Empty>
                  </div>
                </Col>
              </Row>
            )}
          </Col>
          <Col xs={0} sm={0} md={8} lg={0} xl={0} xxl={0}>
            <div
              className="d-flex align-items-center"
              style={{ height: "250px" }}
            >
              <div>
                <div style={{ fontSize: "42px", fontWeight: "700" }}>
                  {nameOfMonth}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div>
                    <img src={cake} alt="F" />
                  </div>
                  <div
                    className="ms-2"
                    style={{ fontSize: "22px", fontWeight: "700" }}
                  >
                    {`${birthdayCount} Birthdays`}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={0} sm={0} md={16} lg={0} xl={0} xxl={0}>
            {birthdayAsRecent?.length > 0 ? (
              <div
                className={`d-flex align-items-center ms-3 ${styles.scroll}`}
                style={{
                  height: "250px",
                  overflowX: "scroll",
                  overflowY: "hidden",
                }}
              >
                {birthdayAsRecent.map((birthday: any) => {
                  return (
                    <div
                      className="m-3"
                      style={{ width: "auto" }}
                      key={birthday.ID}
                    >
                      <div className="d-flex justify-content-center">
                        {birthday?.AttachmentFiles.length > 0 ? (
                          <img
                            src={
                              context.pageContext.web.absoluteUrl
                                .split("/")
                                .slice(0, 3)
                                .join("/") +
                              birthday?.AttachmentFiles[0]?.ServerRelativeUrl
                            }
                            className="rounded-circle"
                            width="150px"
                            height="150px"
                            alt="Birthday"
                          />
                        ) : (
                          <img
                            src={userImg}
                            className="rounded-circle"
                            width="150px"
                            height="150px"
                            alt="Birthday"
                          />
                        )}
                      </div>
                      <div
                        className={`d-flex justify-content-center text-center`}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            width: "max-content",
                          }}
                        >
                          {birthday.Title}
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-center"
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#4fb3dd",
                        }}
                      >
                        {moment(birthday.Date).format("MMM D").toUpperCase()}
                      </div>
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
                        <span className="text-secondary">No Birthday</span>
                      }
                    ></Empty>
                  </div>
                </Col>
              </Row>
            )}
          </Col>
          <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <div>
                <div style={{ fontSize: "42px", fontWeight: "700" }}>
                  {nameOfMonth}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div>
                    <img src={cake} alt="F" />
                  </div>
                  <div
                    className="ms-2"
                    style={{ fontSize: "22px", fontWeight: "700" }}
                  >
                    {`${birthdayCount} Birthdays`}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
            {birthdayAsRecent?.length > 0 ? (
              <div
                className={`${styles.scroll}`}
                style={{
                  height: "250px",
                  overflowY: "scroll",
                }}
              >
                {birthdayAsRecent.map((birthday: any) => {
                  return (
                    <div className="m-3" style={{ width: "auto" }}>
                      <div className="d-flex justify-content-center">
                        {birthday?.AttachmentFiles.length > 0 ? (
                          <img
                            src={
                              context.pageContext.web.absoluteUrl
                                .split("/")
                                .slice(0, 3)
                                .join("/") +
                              birthday?.AttachmentFiles[0]?.ServerRelativeUrl
                            }
                            className="rounded-circle"
                            width="150px"
                            height="150px"
                            alt="Birthday"
                          />
                        ) : (
                          <img
                            src={userImg}
                            className="rounded-circle"
                            width="150px"
                            height="150px"
                            alt="Birthday"
                          />
                        )}
                      </div>
                      <div
                        className={`d-flex justify-content-center text-center`}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            width: "max-content",
                          }}
                        >
                          {birthday.Title}
                        </div>
                      </div>
                      <div
                        className="d-flex justify-content-center"
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#4fb3dd",
                        }}
                      >
                        {moment(birthday.Date).format("MMM D").toUpperCase()}
                      </div>
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
                        <span className="text-secondary">No Birthday</span>
                      }
                    ></Empty>
                  </div>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
