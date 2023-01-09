import * as React from "react";
//  import styles from './NeweastFooter.module.scss';
import { INeweastFooterProps } from "./INeweastFooterProps";
// import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Row, Col } from "antd";
import "antd/dist/reset.css";

interface INeweastFooterState {
  footerLogo: any;
}

export default class NeweastFooter extends React.Component<
  INeweastFooterProps,
  INeweastFooterState
> {
  public constructor(props: INeweastFooterProps, state: INeweastFooterState) {
    super(props);
    this.state = {
      footerLogo: [],
    };
  }

  public componentDidMount(): void {
    let commentSection = document.getElementById("CommentsWrapper");
    commentSection.style.display = "none";
    setInterval(() => {
      let footer = document.getElementsByClassName("l_b_beed2cf1");
      // console.log("footer.length", footer);

      for (var i = 0; i < footer.length; i++) {
        // console.log("====>", footer[i]);
        const footerELE = footer[i];
        if (footerELE instanceof HTMLElement) {
          footerELE.style.display = "none";
        }
      }
    }, 1000);

    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Logo')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )

      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Res listItems", listItems);
        const footerLogo: any = listItems.value.filter(
          (item: any) => item.Title.toLowerCase() === "footer"
        );
        // const sortedItems: any = listItems.value.sort(
        //   (a: any, b: any) =>
        //     new Date(b.Created).getTime() - new Date(a.Created).getTime()
        // );
        console.log("FooterLogo", footerLogo);
        this.setState({ footerLogo: footerLogo });
      });
  }

  public render(): React.ReactElement<INeweastFooterProps> {
    // const {
    //   description,
    //   isDarkTheme,
    //   environmentMessage,
    //   hasTeamsContext,
    //   userDisplayName
    // } = this.props;
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    // let bootstarp5JS =
    //   "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
    let font =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@100&family=Roboto:wght@100;300;400;500;700;900&display=swap";
    let fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(font);

    SPComponentLoader.loadCss(fa);
    const { footerLogo } = this.state;
    const { context } = this.props;
    return (
      <div className="w-100 bg-dark text-light" style={{ height: "150px" }}>
        <div className="d-flex w-100 h-100 justify-content-between container">
          <Row className="w-50">
            <Col xs={0} sm={0} md={0} lg={24}>
              <div className="d-flex  h-100 justify-content-around align-items-center">
                <div
                  className="text-white"
                  style={{
                    fontSize: "18px",
                    fontFamily: "Roboto",
                    fontWeight: "400",
                  }}
                >
                  <a
                    className="text-white text-decoration-none"
                    href={`${context.pageContext.web.absoluteUrl

                      .split("/")

                      .slice(0, 5)

                      .join("/")}/SitePages/Home.aspx`}
                  >
                    Home
                  </a>
                </div>
                <div
                  className="text-white"
                  style={{
                    fontSize: "18px",
                    fontFamily: "Roboto",
                    fontWeight: "400",
                  }}
                >
                  <a className="text-white text-decoration-none" href="">
                    Terms & Conditions
                  </a>
                </div>
                <div
                  className="text-white"
                  style={{
                    fontSize: "18px",
                    fontFamily: "Roboto",
                    fontWeight: "400",
                  }}
                >
                  <a className="text-white text-decoration-none" href="">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </Col>

            <Col xs={0} sm={0} md={22} lg={0}>
              <div className="d-flex  h-100 justify-content-around align-items-center">
                <div
                  className="text-white"
                  style={{
                    fontSize: "16px",
                    fontFamily: "Roboto",
                    fontWeight: "400",
                  }}
                >
                  <a
                    className="text-white text-decoration-none"
                    href={`${context.pageContext.web.absoluteUrl

                      .split("/")

                      .slice(0, 5)

                      .join("/")}/SitePages/Home.aspx`}
                  >
                    Home
                  </a>
                </div>
                <div
                  className="text-white"
                  style={{
                    fontSize: "16px",
                    fontFamily: "Roboto",
                    fontWeight: "400",
                  }}
                >
                  <a className="text-white text-decoration-none" href="">
                    Terms & Conditions
                  </a>
                </div>
                <div
                  className="text-white"
                  style={{
                    fontSize: "16px",
                    fontFamily: "Roboto",
                    fontWeight: "400",
                  }}
                >
                  <a className="text-white text-decoration-none" href="">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={0} lg={0}>
              <div className="d-flex  h-100 justify-content-around align-items-center">
                <div
                  className="text-white"
                  style={{
                    fontSize: "16px",
                    fontFamily: "Roboto",
                    fontWeight: "400",
                  }}
                >
                  <a
                    className="text-white text-decoration-none"
                    href={`${context.pageContext.web.absoluteUrl

                      .split("/")

                      .slice(0, 5)

                      .join("/")}/SitePages/Home.aspx`}
                  >
                    Home
                  </a>
                </div>
              </div>
            </Col>
          </Row>

          <div className="d-flex  h-100 justify-content-between align-items-center">
            <Row className="w-25">
              <Col xs={0} sm={0} md={24} lg={24}>
                <div className="d-flex  justify-content-center">
                  <span
                    className="mx-2"
                    style={{ height: "23px", width: "30px" }}
                  >
                    <a href="https://www.instagram.com/neweastautoparts/">
                      <img alt="" src={require("../assets/instagram.svg")} />
                    </a>
                  </span>
                  <span
                    className="mx-2"
                    style={{ height: "23px", width: "30px" }}
                  >
                    <a href="https://www.facebook.com/neweastautoparts">
                      <img alt="" src={require("../assets/facebook.svg")} />
                    </a>
                  </span>
                  <span
                    className="mx-2"
                    style={{ height: "23px", width: "30px" }}
                  >
                    <a href=" https://www.linkedin.com/company/neweastautopart">
                      <img alt="" src={require("../assets/linkedin.svg")} />
                    </a>
                  </span>
                </div>
              </Col>
            </Row>
            {footerLogo.map((footer: any) => {
              return (
                <div
                  className=" d-flex justify-content-center align-items-center rounded px-2 h-75"
                  style={{ backgroundColor: "#f4f4f4" }}
                >
                  <a
                    href={`${context.pageContext.web.absoluteUrl

                      .split("/")

                      .slice(0, 5)

                      .join("/")}/SitePages/Home.aspx`}
                  >
                    {/* <img alt="" src={require("../assets/logo.png")} width="180px" />    */}
                    {footer?.AttachmentFiles.length > 0 ? (
                              <img
                                src={
                                  context.pageContext.web.absoluteUrl
  
                                    .split("/")
  
                                    .slice(0, 3)
  
                                    .join("/") +
                                  footer?.AttachmentFiles[0]
                                    ?.ServerRelativeUrl
                                }
                                width={footer.Width}
                              />
                            ) : (
                              <>"No Image"</>
                            )}
                     
                     
                    
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
