import * as React from "react";
import { Drawer } from "antd";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
interface ISidebarProps {
  context: WebPartContext;
}
interface ISidebarState {
  openDrawer: boolean;
  userPhoto: any;
  userDetails: any;
}
export default class Sidebar extends React.Component<
  ISidebarProps,
  ISidebarState
> {
  public constructor(props: ISidebarProps, state: ISidebarState) {
    super(props);
    this.state = {
      openDrawer: false,
      userPhoto: null,
      userDetails: null,
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
  public showDrawer: any = () => {
    this.setState({ openDrawer: true });
  };

  public onClose: any = () => {
    this.setState({ openDrawer: false });
  };

  public render(): React.ReactElement<{}> {
    const { context } = this.props;
    const userImg: any = require("../../assets/userImg.jpg");
    const menu: any = require("../../assets/menu.svg");
    /* const chevron: any = require("../../assets/chevron-down.svg"); */
    return (
      <>
        <div onClick={() => this.showDrawer()}>
          <img src={menu} />
        </div>
        <Drawer
          placement="right"
          onClose={() => this.onClose()}
          open={this.state.openDrawer}
          title={
            <div className="d-flex justify-content-start align-items-center p-2 pt-0">
              <a href="https://myaccount.microsoft.com/?ref=MeControl">
                <img
                  src={this.state.userPhoto ? this.state.userPhoto : userImg}
                  width="60px"
                  height="60px"
                  className="rounded-circle"
                  style={{ cursor: "pointer" }}
                  title="View Account"
                />
              </a>
              <div className="d-flex justify-content-between ps-2">
                <div>
                  <div>
                    <small>Welcome</small>
                  </div>
                  <div className="fw-bold">
                    {context.pageContext.user.displayName}
                  </div>
                </div>
                {/* <div
                  className="ps-2 d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <img src={chevron} />
                </div> */}
              </div>
            </div>
          }
        >
          <div
            className="fs-5 p-2 border-bottom border-2 pt-0"
            style={{
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <a
              style={{
                textDecoration: "none",
                color: "#000000",
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
            className="fs-5 p-2"
            style={{ fontWeight: "500", cursor: "pointer" }}
          >
            <a
              style={{
                textDecoration: "none",
                color: "#000000",
              }}
              href={`${context.pageContext.web.absoluteUrl
                .split("/")
                .slice(0, 5)
                .join("/")}/SitePages/About.aspx`}
            >
              About
            </a>
          </div>
          <a
            className="text-decoration-none text-white"
            href={`${context.pageContext.web.absoluteUrl}/_layouts/15/SignOut.aspx`}
          >
            <div
              className="fs-5 p-2 rounded text-white text-center"
              style={{
                fontWeight: "500",
                cursor: "pointer",
                backgroundColor: "#f75b52",
              }}
            >
              Logout
            </div>
          </a>
        </Drawer>
      </>
    );
  }
}
