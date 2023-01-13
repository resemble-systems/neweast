import * as React from "react";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Row, Col, Empty } from "antd";
import styles from "../HomePage.module.scss";

interface IDocumentsProps {
  context: WebPartContext;
}

interface IDocumentsState {
  id: any;
  isBookMarked: any;
  onedriveData: any;
  UserData: any;
  sharedData: any;
  toggleButton: any;
}

export default class Document extends React.Component<
  IDocumentsProps,
  IDocumentsState
> {
  public constructor(props: IDocumentsProps, state: IDocumentsState) {
    super(props);
    this.state = {
      id: 0,
      isBookMarked: false,
      onedriveData: null,
      UserData: null,
      sharedData: null,
      toggleButton: false,
    };
  }

  public componentDidMount() {
    /* const { context } = this.props; */
    this.props.context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api("/me/drive/root/children")
          .version("v1.0")
          .select("*")
          .get((error: any, drive: any, rawResponse?: any) => {
            if (error) {
              console.log("Drive Error Msg:", error);
              return;
            }
            console.log("drive", drive);
            console.log("driveData", drive.value);
            this.setState({ onedriveData: drive.value });
            console.log("rawResponse==>>", rawResponse);
          });
      });

    this.props.context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api("/me/drive/sharedWithMe")
          .version("v1.0")
          .select("*")
          .get((error: any, drive: any, rawResponse?: any) => {
            if (error) {
              console.log("sharedData Error Msg:", error);
              return;
            }
            console.log("sharedData", drive);

            console.log("sharedData", drive.value);
            this.setState({ sharedData: drive.value });
          });
      });
  }
  public render(): React.ReactElement<{}> {
    const document = require("./document.svg");
    const transfer = require("./transfer.png");
    const { onedriveData, sharedData, toggleButton } = this.state;

    return (
      <>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-start align-items-center">
            <div className="pb-2">
              <img src={document} />
            </div>
            <div
              className="ps-3"
              style={{ fontSize: "20px", fontWeight: "700" }}
            >
              {toggleButton ? "Shared Documents" : "My Documents"}
            </div>
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              this.setState({ toggleButton: !toggleButton });
            }}
          >
            <img src={transfer} height="25px" width="25px" />
          </div>
        </div>
        {toggleButton ? (
          <div>
            <div
              className={`my-3 ${styles.scroll}`}
              style={{ height: "420px", overflowY: "scroll" }}
            >
              {sharedData?.length > 0 ? (
                sharedData?.map((driveData: any) => {
                  console.log("sharedDataSate", sharedData);
                  let fileIcon: any;
                  switch (
                    driveData.name.split(".")[
                      driveData.name.split(".").length - 1
                    ]
                  ) {
                    case "docx" || "doc":
                      fileIcon = require("./word.png");
                      break;
                    case "dwp":
                      fileIcon = require("./word.png");
                      break;
                    case "xlsx":
                      fileIcon = require("./xlsx.png");
                      break;
                    case "pptx" || "ppt":
                      fileIcon = require("./ppt.png");
                      break;
                    case "png" || "PNG":
                      fileIcon = require("./png.png");
                      break;
                    case "jpg" || "jpeg":
                      fileIcon = require("./jpeg.png");
                      break;
                    case "JPG" || "JPEG":
                      fileIcon = require("./jpeg.png");
                      break;
                    case "pdf" || "PDF":
                      fileIcon = require("./pdf.png");
                      break;
                    case "mp4":
                      fileIcon = require("./audio.png");
                      break;
                    case "mp3":
                      fileIcon = require("./mp3.png");
                      break;
                    case "html" || "HTML":
                      fileIcon = require("./html.png");
                      break;
                    case "js" || "JS":
                      fileIcon = require("./js.png");
                      break;
                    case "css" || "CSS":
                      fileIcon = require("./css-3.png");
                      break;
                    case "svg" || "SVG":
                      fileIcon = require("./svg.png");
                      break;
                    case "zip" || "ZIP" || "rar":
                      fileIcon = require("./zip.png");
                      break;
                    default:
                      fileIcon = require("./default.png");
                      break;
                  }
                  return (
                    <>
                      <a
                        key={driveData.ID}
                        href={driveData.webUrl}
                        className="text-decoration-none text-dark"
                      >
                        <div
                          className="d-flex mb-3 me-2 border-bottom border-secondary"
                          style={{ fontSize: "16px", fontWeight: "400" }}
                        >
                          <div className="pb-2">
                            <img src={fileIcon} width="30px" height="30px" />
                          </div>
                          <div className="d-flex align-items-center ms-3">
                            {driveData.name}
                          </div>
                        </div>
                      </a>
                    </>
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
            </div>
          </div>
        ) : (
          <div>
            <div
              className={`my-3 ${styles.scroll}`}
              style={{ height: "420px", overflowY: "scroll" }}
            >
              {onedriveData?.length > 0 ? (
                onedriveData?.map((driveData: any) => {
                  console.log("sharedDataSate", sharedData);
                  let fileIcon: any;
                  switch (
                    driveData.name.split(".")[
                      driveData.name.split(".").length - 1
                    ]
                  ) {
                    case "docx" || "doc":
                      fileIcon = require("./word.png");
                      break;
                    case "dwp":
                      fileIcon = require("./word.png");
                      break;
                    case "xlsx":
                      fileIcon = require("./xlsx.png");
                      break;
                    case "pptx" || "ppt":
                      fileIcon = require("./ppt.png");
                      break;
                    case "png" || "PNG":
                      fileIcon = require("./png.png");
                      break;
                    case "jpg" || "jpeg":
                      fileIcon = require("./jpeg.png");
                      break;
                    case "JPG" || "JPEG":
                      fileIcon = require("./jpeg.png");
                      break;
                    case "pdf" || "PDF":
                      fileIcon = require("./pdf.png");
                      break;
                    case "mp4":
                      fileIcon = require("./audio.png");
                      break;
                    case "mp3":
                      fileIcon = require("./mp3.png");
                      break;
                    case "html" || "HTML":
                      fileIcon = require("./html.png");
                      break;
                    case "js" || "JS":
                      fileIcon = require("./js.png");
                      break;
                    case "css" || "CSS":
                      fileIcon = require("./css-3.png");
                      break;
                    case "svg" || "SVG":
                      fileIcon = require("./svg.png");
                      break;
                    case "zip" || "ZIP" || "rar":
                      fileIcon = require("./zip.png");
                      break;
                    default:
                      fileIcon = require("./default.png");
                      break;
                  }
                  return (
                    <>
                      <a
                        key={driveData.ID}
                        href={driveData.webUrl}
                        className="text-decoration-none text-dark"
                      >
                        <div
                          className="d-flex mb-3 me-2 border-bottom border-secondary"
                          style={{ fontSize: "16px", fontWeight: "400" }}
                        >
                          <div className="pb-2">
                            <img src={fileIcon} width="30px" height="30px" />
                          </div>
                          <div className="d-flex align-items-center ms-3">
                            {driveData.name}
                          </div>
                        </div>
                      </a>
                    </>
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
            </div>
          </div>
        )}
      </>
    );
  }
}
