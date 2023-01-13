import * as React from "react";
import { Row, Col, Carousel } from "antd";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import styles from "./banner.module.sass";
import { WebPartContext } from "@microsoft/sp-webpart-base";

import BannerNav from "../bannerNav/BannerNav";

export interface IBannerProps {
  context: WebPartContext;
}
export interface IBannerState {
  BannerListItems: any;
}

export default class Banner extends React.Component<
  IBannerProps,
  IBannerState
> {
  private ref: any = null;

  public constructor(props: IBannerProps, state: IBannerState) {
    super(props);
    this.state = {
      BannerListItems: [],
    };
  }
  public componentDidMount(): void {
    const { context } = this.props;

    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Banner')/items?$select=*&$expand=AttachmentFiles`,
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
        console.log("BannerListItems", sortedItems);
        this.setState({ BannerListItems: sortedItems });
      });
  }

  public render(): React.ReactElement<IBannerProps> {
    const { BannerListItems } = this.state;
    const { context } = this.props;
    return (
      <>
        <div style={{ position: "relative" }}>
          <div
            id="banner-container"
            className={`container-fluid p-0 ${styles.bannerContainer}`}
          >
            <Row className={`h-100`}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Carousel
                  autoplay
                  dots={false}
                  ref={(ref: any) => {
                    console.log("ref", ref);
                    this.ref = ref;
                    console.log("ref", this.ref);
                  }}
                >
                  {BannerListItems.map((banner: any) => {
                    return (
                      <div className={`d-flex ${styles.bannerImgContainer}`}>
                        <img
                          id="banner-img"
                          src={
                            context.pageContext.web.absoluteUrl
                              .split("/")
                              .slice(0, 3)
                              .join("/") +
                              banner?.AttachmentFiles[0]
                              ?.ServerRelativeUrl
                          }
                          alt="bannerImg"
                          className={`${styles.bannerImg}`}
                        />
                        <div
                          className={`h-100 w-100 ${styles.bannerImgLayer} `}
                        ></div>
                        <div className={`w-100 ${styles.bannerInfoContainer}`}>
                          <div className="d-flex justify-content-between">
                            <div className="d-flex justify-content-start align-items-center" style={{width:'5vw'}}>
                              <img
                                src={require("../assets/banner/cleft.png")}
                                alt="leftArr"
                                style={{ cursor: "pointer" }}
                                className={`${styles.bannerInfoArrows}`}
                                onClick={() => {
                                  this.ref.prev();
                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-start" style={{width:'80vw'}}>
                              <div
                                className="p-3"
                                style={{
                                  width: "max-content",
                                  backgroundColor: "rgba(25, 25, 25, 0.6)",
                                }}
                              >
                                <div
                                  className={`${styles.bannerInfoTitle}`}
                                >
                                  {banner.Title}
                                </div>
                                <div
                                  className={`mb-0 ${styles.bannerInfoDes}`}
                                  dangerouslySetInnerHTML={{
                                    __html: banner.Description,
                                  }}
                                ></div>
                                <div
                                  className={`mt-2 px-3 py-1 ${styles.bannerInfoMore} fs-bold`}
                                  style={{
                                    backgroundColor: "#f75b52",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    width: "max-content",
                                  }}
                                >
                                  <a
                                    className="text-decoration-none text-white"
                                    href={banner.Link}
                                  >
                                    Know More
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex justify-content-end align-items-center" style={{width:'5vw'}}>
                              <img
                                src={require("../assets/banner/cright.png")}
                                alt="rightArr"
                                style={{ cursor: "pointer" }}
                                className={`ms-4 ${styles.bannerInfoArrows}`}
                                onClick={() => {
                                  this.ref.next();
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Carousel>
              </Col>
            </Row>
          </div>
          <Col
            xs={0}
            sm={0}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            style={{
              position: "absolute",
              right: "0",
              left: "0",
              bottom: "-3rem",
            }}
          >
            <BannerNav context={context} />
          </Col>
          <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
            <BannerNav context={context} />
          </Col>
        </div>
      </>
    );
  }
}
