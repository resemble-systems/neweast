import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Calendar, Col, Row, Select, Tooltip } from "antd";

import "dayjs/locale/zh-cn";

import type { CalendarMode } from "antd/es/calendar/generateCalendar";
import {
  MSGraphClientV3,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import styles from "./calendar.module.sass";
import "./style.css";

interface ICalenderNewProps {
  context: WebPartContext;
}

interface ICalenderNewState {
  UserData: any;
  visibility: any;
  calendarMeetingData: any;
  eventsData: any;
}

export default class CalenderNew extends React.Component<
  ICalenderNewProps,
  ICalenderNewState
> {
  public constructor(props: ICalenderNewProps, state: ICalenderNewState) {
    super(props);
    this.state = {
      UserData: null,
      visibility: false,
      calendarMeetingData: null,
      eventsData: [],
    };
  }
  public componentDidMount() {
    this.props.context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`me/events`)
          .version("v1.0")
          .select("*")
          .top(100)
          .get((error: any, calendar: any, rawResponse?: any) => {
            if (error) {
              return;
            }
            console.log("calendarData from MY Calendar for a month", calendar);
            this.setState({ calendarMeetingData: calendar.value });
            console.log("rawResponse==>>", rawResponse);
          });
      });

    // UserData

    this.props.context.spHttpClient
      .get(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/sp.userprofiles.peoplemanager/getmyproperties`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        return res.json();
      })
      .then((UserDataItems: any) => {
        /* console.log("UserData Res listItems MY Calendar", UserDataItems); */
        this.setState({
          UserData: UserDataItems,
        });
      });

    this.props.context.spHttpClient

      .get(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Events')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )

      .then((res: SPHttpClientResponse) => {
        /* console.log("listItems calender Success"); */
        return res.json();
      })

      .then((listItems: any) => {
        /*  console.log("Res Calender listItems", listItems); */
        const sortedItems: any = listItems.value.sort(
          (a: any, b: any) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        /* console.log("EventsSortedItems", sortedItems); */
        this.setState({ eventsData: sortedItems });
      });
  }

  public filteredMeeting = (value: any) => {
    const { calendarMeetingData } = this.state;
    var moment = require("moment");

    let startTime = moment(value.$d).startOf("day").utc().format();
    let endTime = moment(value.$d).endOf("day").utc().format();
    /*  console.log("value._d", value.$d);
    console.log("startTime", new Date(startTime).getTime());
    console.log("endTime", new Date(endTime).getTime());
    console.log("calendarMeetingData", calendarMeetingData); */

    let filteredMeetingData =
      calendarMeetingData?.length > 0 &&
      calendarMeetingData.filter((data: any) => {
        /* console.log("Condition 1", new Date(data.start.dateTime).getTime());
        console.log("Condition 2", new Date(data.end.dateTime).getTime()); */
        if (
          new Date(data.start.dateTime).getTime() >=
            new Date(startTime).getTime() &&
          new Date(data.end.dateTime).getTime() <= new Date(endTime).getTime()
        )
          return data;
      });

    /* console.log("filteredMeetingData", filteredMeetingData); */

    return filteredMeetingData;
  };

  public dateFullCellRender = (value: any) => {
    let colorPallet = ["#1E2B45", "#7C29C4", "#21A266", "#F7BD15", "#FC6273"];
    /* console.log("value", value); */
    return (
      <div style={{ height: "55px" }}>
        <div className="w-100 d-flex justify-content-start align-items-center flex-wrap">
          {this.filteredMeeting(value)?.length > 0 ? (
            this.filteredMeeting(value).map((meet: any) => (
              <Tooltip
                placement="topLeft"
                title={
                  <div className={``}>
                    <div className={`${styles.meetTitle}`}>{meet.subject}</div>
                    <a
                      href={
                        meet?.onlineMeeting?.joinUrl
                          ? meet.onlineMeeting.joinUrl
                          : meet.webLink
                      }
                      target={`_blank`}
                      className={`${styles.meetLink}`}
                    >
                      Join now
                    </a>
                  </div>
                }
                color={"#fff"}
                key={1}
              >
                <div
                  style={{
                    height: "6px",
                    width: "6px",
                    borderRadius: "7px",
                    backgroundColor:
                      colorPallet[
                        Math.floor(Math.random() * colorPallet.length)
                      ],
                    margin: ".5px .5px",
                  }}
                ></div>
              </Tooltip>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };

  public render(): React.ReactElement<ICalenderNewProps> {
    const calenderImg = require("./calender.svg");

    const onPanelChange = (value: any, mode: CalendarMode) => {
      /* console.log(value.format("YYYY-MM-DD"), mode); */
    };

    return (
      <div className="mb-3 w-100">
        <Calendar
          fullscreen={false}
          dateCellRender={(data) => this.dateFullCellRender(data)}
          headerRender={({ value, type, onChange, onTypeChange }: any) => {
            const start = 0;
            const end = 12;
            const monthOptions = [];
            let current = value.clone();
            const localeData = value.localeData();
            const months = [];
            for (let i = 0; i < 12; i++) {
              current = current.month(i);
              months.push(localeData.monthsShort(current));
            }
            for (let i = start; i < end; i++) {
              monthOptions.push(
                <Select.Option key={i} value={i} className="month-item">
                  {months[i]}
                </Select.Option>
              );
            }
            const year = value.year();
            const month = value.month();
            console.log(month);

            const options = [];
            for (let i = year - 10; i < year + 10; i += 1) {
              options.push(
                <Select.Option key={i} value={i} className="year-item">
                  {i}
                </Select.Option>
              );
            }
            return (
              <div className="d-flex mb-3 justify-content-between align-items-center">
                <div className="d-flex justify-content-start align-items-center">
                  <div>
                    <img src={calenderImg} />
                  </div>
                  <div
                    className="ps-3"
                    style={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Calendar
                  </div>
                </div>
                <Row gutter={8}>
                  <Col>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <span
                        className="d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          onChange(value.clone().month(value.month() - 1));
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          className="bi bi-chevron-left"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                          />
                        </svg>
                      </span>{" "}
                      <span
                        className="d-flex align-items-center"
                        style={{ fontSize: "10px", fontWeight: "700" }}
                      >
                        {value.format("MMMM,YYYY")}{" "}
                      </span>
                      <span
                        className="d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          onChange(value.clone().month(value.month() + 1));
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          className="bi bi-chevron-right"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            );
          }}
          onPanelChange={onPanelChange}
        />
      </div>
    );
  }
}
