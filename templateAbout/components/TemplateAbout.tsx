import * as React from "react";
import styles from "./TemplateAbout.module.scss";
import { ITemplateAboutProps } from "./ITemplateAboutProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Row, Col, Carousel, Empty } from "antd";
import "antd/dist/reset.css";

interface ITemplateAboutState {
  aboutSortedAsRecent: any;
}
export default class TemplateAbout extends React.Component<
  ITemplateAboutProps,
  ITemplateAboutState
> {
  public constructor(props: ITemplateAboutProps, state: ITemplateAboutState) {
    super(props);
    this.state = {
      aboutSortedAsRecent: [],
    };
  }

  public componentDidMount(): void {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('About')/items?$select=*&$expand=AttachmentFiles`,
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
        console.log("aboutSortedItems", sortedItems);
        this.setState({ aboutSortedAsRecent: sortedItems });
      });
  }

  public render(): React.ReactElement<ITemplateAboutProps> {
    //  const desc = [
    //   {
    //     parag:
    //       " It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy."
    //   },
    //   {
    //     parag:
    //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    //   },
    // ];
    let carouselOneAction: any = {};
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    // let bootstarp5JS =
    //   "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";

    SPComponentLoader.loadCss(bootstarp5CSS);
    const { aboutSortedAsRecent } = this.state;
    const { context } = this.props;
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
                  <a
                    href={`${context.pageContext.web.absoluteUrl}/SitePages/Home.aspx`}
                  >
                    <img
                      src={require("../assets/arrow-left.svg")}
                      height="20px"
                      width="50px"
                    />
                  </a>
                  {/* <a href="">
                  <img src={ans} alt="folder" height="20px" width="50px" />
                </a> */}
                  About Us
                </h4>
              </div>
            </div>
          </Col>
        </Row>

        <Row
          className="mt-3 px-5 py-3"
          style={{
            boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
            backgroundColor: " #fff",
            borderRadius: "5px",
          }}
        >
          <Col xs={24} md={24} lg={24} xl={24}>
            <div className="d-flex justify-content-center">
              <div className="my-5 w-50" style={{ position: "relative" }}>
                <Carousel
                  autoplay={false}
                  dots={false}
                  ref={(ref) => {
                    carouselOneAction = ref;
                  }}
                >
                  {aboutSortedAsRecent?.length > 0 ? (
                    aboutSortedAsRecent[0]?.AttachmentFiles?.map(
                      (file: any) => {
                        return (
                          <div className="d-flex h-100 justify-content-center align-items-center">
                             {/* <img className="rounded w-100" src={
                        context.pageContext.web.absoluteUrl.substring(0,33) +
                        file.ServerRelativeUrl
                      } />  */}
                          <img className="rounded w-100"  style={{aspectRatio:"1.5/1"}} src=
                            {context.pageContext.web.absoluteUrl

                              .split("/")

                              .slice(0, 3)

                              .join("/") +
                              file.ServerRelativeUrl
                                } 
                                />
                          </div>
                        );
                      }
                    )
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
                    top: "44%",
                  }}
                >
                  <div
                    style= {{ cursor: "pointer" }}
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
                    <img className={`${styles.bannerInfoArrows}`} src={require("../assets/right.svg")} />
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={24} lg={24} xl={24}>
            {aboutSortedAsRecent?.length > 0 ? (
              aboutSortedAsRecent.map((about: any) => {
                return (
                  <div className="d-flex justify-content-start align-items-center">
                    <div
                      className={`${styles.description}my-2`}
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#292929",
                        textAlign: "justify",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: about.Description,
                      }}
                    ></div>
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
          </Col>
        </Row>
      </div>
    );
  }
}
