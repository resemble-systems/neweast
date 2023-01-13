import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { Modal } from "antd";

interface ITopbarProps {
  context: WebPartContext;
}

interface ITopbarState {
  displayProfile: boolean;
  mobileDisplayProfile: boolean;
  notificationDisplay: boolean;
  mobileNotificationDisplay: boolean;
  notificationData: any;
  value: string;
  userPhoto: any;
  userDetails: any;
  modalOpen: boolean;
}

export default class Topbar extends React.Component<
  ITopbarProps,
  ITopbarState
> {
  public constructor(props: ITopbarProps, state: ITopbarState) {
    super(props);
    this.state = {
      displayProfile: false,
      mobileDisplayProfile: false,
      notificationDisplay: false,
      mobileNotificationDisplay: false,
      notificationData: [],
      value: "",
      userPhoto: null,
      userDetails: null,
      modalOpen: false,
    };
  }
  public componentDidMount(): void {
    this.props.context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api("/me/photo/$value")
          .version("v1.0")
          .responseType("blob")
          .get((error: any, photo: Blob, rawResponse?: any) => {
            if (error) {
              console.log("User Photo Error Msg:", error);
              return;
            }
            console.log("photo", photo);
            const url = URL.createObjectURL(photo);
            console.log("URL PHOTO", url);
            this.setState({ userPhoto: url });
            console.log("rawResponse==>>", rawResponse);
          });

        let mail: any;
        grahpClient
          .api("/me")
          .version("v1.0")
          .select("*")
          .get(
            (
              error: any,
              user: any /* : MicrosoftGraph.User, */,
              rawResponse?: any
            ) => {
              if (error) {
                console.log("User Error Msg:", error);
                return;
              }
              console.log("user", user);
              mail = user.mail;
              console.log("mail", mail);
              this.setState({ userDetails: user });
              console.log("rawResponse", rawResponse);
            }
          );
      });
  }
  public render(): React.ReactElement<ITopbarProps> {
    const userImg = require("../../assets/userImg.jpg");
    const chevron = require("../../assets/chevron-down.svg");

    const { context } = this.props;
    const { userPhoto, userDetails } = this.state;

    const CurrentPage = window.location.pathname;
    const ActivePage = CurrentPage.split("/SitePages");

    const HomePage =
      ActivePage[1] === "/Home.aspx" ||
      window.location.pathname.split("/").length === 3
        ? true
        : false;
    const AboutPage = ActivePage[1] === "/About.aspx" ? true : false;
    const OrganizationPage =
      ActivePage[1] === "/OrganizationPage.aspx" ? true : false;

    console.log(HomePage, AboutPage, OrganizationPage);

    const items: MenuProps["items"] = [
      {
        label: (
          <div className="d-flex p-2">
            <div className="me-2">
              <div className="mb-2">
                <img
                  src={userPhoto ? userPhoto : userImg}
                  width="100px"
                  height="100px"
                  className="rounded-circle"
                />
              </div>
              <div
                className="d-flex justify-content-center align-items-center p-2 rounded text-white"
                style={{
                  backgroundColor: "#f75b52",
                  fontWeight: "600",
                }}
              >
                <a
                  className="text-decoration-none text-white"
                  href={`${context.pageContext.web.absoluteUrl}/_layouts/15/SignOut.aspx`}
                >
                  Sign Out
                </a>
              </div>
            </div>
            <div>
              <div className="fs-5" style={{ fontWeight: "600" }}>
                {`${
                  userDetails?.displayName
                    ? userDetails.displayName
                    : "Sharepoint Developer"
                }`}
              </div>
              <div className="fs-6">{`${
                userDetails?.jobTitle ? userDetails.jobTitle : "POSITION"
              }`}</div>
              <div className="fs-6">{`${
                userDetails?.mail ? userDetails.mail : "User Mail"
              }`}</div>
              <div className="fs-6">{`${
                userDetails?.mobilePhone
                  ? userDetails.mobilePhone
                  : "User Ph-Number"
              }`}</div>
            </div>
          </div>
        ),
        key: "0",
      },
    ];

    return (
      <>
        <div
          className="d-flex justify-content-between border-bottom border-2 w-100"
          style={{ fontFamily: "Montserrat" }}
        >
          <div
            className="d-flex justify-content-between w-100"
            style={{ height: "80px" }}
          >
            <div className="d-flex justify-content-evenly align-items-center flex-fill">
              <div
                className="px-4 py-3 fs-6"
                style={{
                  backgroundColor: HomePage ? "#f75b52" : "none",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "#f4f4f4f4",
                }}
              >
                <a
                  style={{
                    textDecoration: "none",
                    color: HomePage ? "#ffffff" : "#000000",
                  }}
                  href={`${context.pageContext.web.absoluteUrl
                    .split("/")
                    .slice(0, 5)
                    .join("/")}/SitePages/Home.aspx`}
                >
                  Home
                </a>
              </div>
              <div
                className="px-4 py-3 fs-6"
                style={{
                  fontWeight: "500",
                  cursor: "pointer",
                  backgroundColor: AboutPage ? "#f75b52" : "none",
                }}
              >
                <a
                  style={{
                    textDecoration: "none",
                    color: AboutPage ? "#ffffff" : "#000000",
                  }}
                  href={`${context.pageContext.web.absoluteUrl
                    .split("/")
                    .slice(0, 5)
                    .join("/")}/SitePages/About.aspx`}
                >
                  About
                </a>
              </div>
              {/* <div
                className="px-4 py-3 fs-6"
                style={{
                  fontWeight: "500",
                  cursor: "pointer",
                  backgroundColor: OrganizationPage ? "#f75b52" : "none",
                  pointerEvents: "none",
                }}
                onClick={() => this.setState({ modalOpen: false })}
              >
                Organization Chart
              </div> */}
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <img
                src={userPhoto ? userPhoto : userImg}
                width="60px"
                height="60px"
                className="rounded-circle"
                style={{ cursor: "pointer" }}
              />
              <div className="d-flex justify-content-between ps-2">
                <div>
                  <div>
                    <small>Welcome</small>
                  </div>
                  <div className="fw-bold">
                    {context.pageContext.user.displayName}
                  </div>
                </div>
                <div
                  className="ps-2 d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <Dropdown menu={{ items }} placement="bottomRight">
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <img src={chevron} />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="Organization Chart"
          style={{ top: 20 }}
          open={this.state.modalOpen}
          onOk={() => this.setState({ modalOpen: false })}
          onCancel={() => this.setState({ modalOpen: false })}
        >
          <p>some contents...</p>
          <p>some contents...</p>
          <p>some contents...</p>
        </Modal>
      </>
    );
  }
}
