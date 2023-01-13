import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Row, Col, Empty, Modal, Carousel } from "antd";
import styles from "../HomePage.module.scss";

interface INewslettersProps {
  context: WebPartContext;
}

interface INewslettersState {
  newslettersAsRecent: any;
  newsLetter: any;
  currentPage: number;
  isModalOpen: any;
  modalData: any;
  editionNumber: any;
}

export default class Newsletters extends React.Component<
  INewslettersProps,
  INewslettersState
> {
  public constructor(props: INewslettersProps, state: INewslettersState) {
    super(props);
    this.state = {
      newslettersAsRecent: [],
      newsLetter: [],
      currentPage: 1,
      isModalOpen: false,
      modalData: [],
      editionNumber: "",
    };
  }

  public componentDidMount(): void {
    const { context } = this.props;

    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Newsletter')/items?$select=*&$expand=AttachmentFiles`,
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
        console.log("newslettersAsRecent", sortedItems);
        this.setState({ newslettersAsRecent: sortedItems });
      });

    /* context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Letter')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )

      .then((res: SPHttpClientResponse) => {
        console.log("Letter Success");
        return res.json();
      })

      .then((listItems: any) => {
        console.log("Letter listItems", listItems);
        const letterArray = listItems.value;
        let editionList = letterArray.map((item: any) => item.vlab);
        console.log("editionList", editionList);
        let filterEdeditionList = editionList.filter(
          (item: any, index: any) => editionList.indexOf(item) === index
        );
        console.log("filterEdeditionList", filterEdeditionList);
        let newsLetter: [] = filterEdeditionList.map((item: any) =>
          letterArray.filter((elements: any) => item === elements.vlab)
        );
        console.log("newsLetter", newsLetter);
      });
 */
    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('NewsletterDetails')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )

      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })

      .then((listItems: any) => {
        console.log("NewsletterDetails", listItems);
        const newsLetter = listItems.value;
        this.setState({ modalData: newsLetter });
      });
  }

  public render(): React.ReactElement<INewslettersProps> {
    const {
      currentPage,
      isModalOpen,
      modalData,
      newslettersAsRecent,
      editionNumber,
    } = this.state;
    const gallery = require("./gallery.svg");
    const alternate = require("./alternate.svg");
    const cleft = require("./left.png");
    const cright = require("./right.png");
    const { context } = this.props;
    const handleOk = () => {
      this.setState({ isModalOpen: false });
      console.log("modalData", modalData);
    };

    const handleCancel = () => {
      this.setState({ isModalOpen: false });
      console.log("modalData", modalData);
    };
    let modalCarouselAction: any = {};
    const newsLetterPerPage = 6;
    const numberOfElements = newslettersAsRecent.length;
    const PageNumber = Math.round(numberOfElements / newsLetterPerPage);
    const indexOfLastPage = currentPage * newsLetterPerPage;
    const indexOfFirstPage = indexOfLastPage - newsLetterPerPage;
    const currentData = newslettersAsRecent.slice(
      indexOfFirstPage,
      indexOfLastPage
    );

    return (
      <>
        <div
          className="border rounded mb-4 shadow-lg bg-white p-4"
          style={{ height: "540px" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-start align-items-center">
              <div>
                <img src={gallery} alt="I" />
              </div>
              <div
                className="ps-3"
                style={{ fontSize: "20px", fontWeight: "700" }}
              >
                Newsletters
              </div>
            </div>
            <div>
              <div className="d-flex align-items-center">
                <span
                  onClick={() => {
                    this.setState({
                      currentPage:
                        currentPage > 1 ? currentPage - 1 : currentPage - 0,
                    });
                  }}
                  style={{ cursor: "pointer" }}
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
                </span>
                <span
                  className="d-flex align-items-center"
                  style={{ fontWeight: 700, fontSize: "12px" }}
                >
                  {currentPage}
                </span>
                <span
                  className="d-flex align-items-center"
                  style={{ fontWeight: 600, fontSize: "12px" }}
                >
                  /
                </span>
                <span
                  className="d-flex align-items-center"
                  style={{ fontWeight: 700, fontSize: "12px" }}
                >
                  {PageNumber}
                </span>
                <span
                  onClick={() => {
                    this.setState({
                      currentPage:
                        currentPage >= PageNumber
                          ? currentPage + 0
                          : currentPage + 1,
                    });
                  }}
                  style={{ cursor: "pointer" }}
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
            </div>
          </div>
          <div>
            {currentData?.length > 0 ? (
              <div
                className="my-3 row row-cols-3 g-2 row-cols-sm-2 row-cols-md-3"
                style={{
                  position: "relative",
                }}
              >
                {currentData.map((item: any) => {
                  console.log("modalData", modalData);
                  return (
                    <div className="col">
                      {item?.AttachmentFiles.length > 0 ? (
                        <img
                          onClick={() => {
                            console.log("Edition", item.Edition);
                            this.setState({
                              editionNumber: item.Edition,
                              isModalOpen: true,
                            });
                            console.log("modalData", modalData);
                          }}
                          src={
                            context.pageContext.web.absoluteUrl
                              .split("/")
                              .slice(0, 3)
                              .join("/") +
                            item?.AttachmentFiles[0]?.ServerRelativeUrl
                          }
                          height="200px"
                          width="100%"
                          alt="logo"
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <img
                          src={alternate}
                          height="200px"
                          width="100%"
                          alt="logo"
                        />
                      )}
                    </div>
                  );
                })}
                <Modal
                  title="Newsletter"
                  centered
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={null}
                  width={1200}
                  style={{ position: "relative" }}
                >
                  <div style={{ height: "max-content" }} className="p-4 pt-3">
                    <Carousel
                      autoplay={false}
                      dots={false}
                      ref={(ref) => {
                        modalCarouselAction = ref;
                      }}
                    >
                      {modalData
                        .filter(
                          (data: any) => editionNumber === data.EditionsId
                        )
                        .sort((a: any, b: any) => a.Sequence - b.Sequence)
                        .map((item: any) => (
                          <div>
                            <div className="row">
                              <div className="col-6" style={{ height: "40vh" }}>
                                <Carousel autoplay={true} dots={true}>
                                  {item.AttachmentFiles.map((img: any) => {
                                    return (
                                      <>
                                        <img
                                          src={
                                            context.pageContext.web.absoluteUrl
                                              .split("/")
                                              .slice(0, 3)
                                              .join("/") +
                                            img?.ServerRelativeUrl
                                          }
                                          height="56.25%"
                                          width="100%"
                                          alt="logo"
                                          style={{ cursor: "pointer" }}
                                        />
                                      </>
                                    );
                                  })}
                                </Carousel>
                              </div>
                              <div
                                className="col-6"
                                style={{
                                  height: "40vh",
                                }}
                              >
                                <div
                                  className={`${styles.headingOne} mb-2`}
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    color: "#292929",
                                  }}
                                >
                                  {item.Title}
                                </div>
                                <div
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "400",
                                    color: "#292929",
                                    height: "34vh",
                                    overflowY: "scroll",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: item.Description,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </Carousel>
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{
                      position: "absolute",
                      left: "0",
                      right: "0",
                      top: "45%",
                    }}
                  >
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => modalCarouselAction.prev()}
                    >
                      <img src={cleft} alt="<" width="40px" height="40px" />
                    </div>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => modalCarouselAction.next()}
                    >
                      <img src={cright} alt=">" width="40px" height="40px" />
                    </div>
                  </div>
                </Modal>
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

          <div
            className="d-flex justify-content-center"
            style={{
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          ></div>
        </div>
      </>
    );
  }
}
