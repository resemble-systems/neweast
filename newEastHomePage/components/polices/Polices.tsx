import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Row, Col, Empty } from "antd";
import styles from "../HomePage.module.scss";

interface IPolicesProps {
  context: WebPartContext;
}

interface IPolicesState {
  PublicationsListItems: any;
}

export default class Polices extends React.Component<
  IPolicesProps,
  IPolicesState
> {
  public constructor(props: IPolicesProps, state: IPolicesState) {
    super(props);
    this.state = {
      PublicationsListItems: null,
    };
  }

  public componentDidMount() {
    const { context } = this.props;

    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Documents')/items?$select=ID,FileRef,Created,Modified/FileRef,Editor/Title&$expand=Editor`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .catch((error) => {
        console.log(error, "ERROR");
      })
      .then((listItems: any) => {
        console.log("Res Policies listItems", listItems);
        const sortedItems: any = listItems.value.sort(
          (a: any, b: any) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        console.log("Policies sortedItems", sortedItems);
        this.setState({
          PublicationsListItems: sortedItems,
        });
        console.log(this.state.PublicationsListItems, "Policies");
      });
  }

  public render(): React.ReactElement<IPolicesProps> {
    const { PublicationsListItems } = this.state;
    const { context } = this.props;
    console.log(context.pageContext.web.title);
    console.log(context.pageContext.web.serverRelativeUrl);
    return (
      <div
        className={`my-3 ${styles.scroll}`}
        style={{ height: "420px", overflowY: "scroll" }}
      >
        {PublicationsListItems?.length > 0 ? (
          PublicationsListItems?.map((driveData: any) => {
            let fileIcon: any;
            switch (
              driveData.FileRef.split(".")[
                driveData.FileRef.split(".").length - 1
              ]
            ) {
              case "docx" || "doc":
                fileIcon = require("./word.png");
                break;
              case "xlsx":
                fileIcon = require("./xlsx.png");
                break;
              case "pptx" || "ppt":
                fileIcon = require("./ppt.png");
                break;
              case "png":
                fileIcon = require("./png.png");
                break;
              case "jpg" || "jpeg":
                fileIcon = require("./jpeg.png");
                break;
              case "pdf":
                fileIcon = require("./pdf.png");
                break;
              default:
                fileIcon = require("./folder.png");
                break;
            }
            console.log(
              driveData.FileRef.split("/")[
                driveData.FileRef.split("/").length - 1
              ],
              driveData.FileRef.split(context.pageContext.web.title)[
                driveData.FileRef.split(context.pageContext.web.title).length -
                  1
              ],
              "Data Policies"
            );

            let absoluteUrl = context.pageContext.web.absoluteUrl;
            let subtUrl = driveData.FileRef.split(
              context.pageContext.web.title
            )[
              driveData.FileRef.split(context.pageContext.web.title).length - 1
            ];
            let documentUrl = absoluteUrl.concat(subtUrl);
            console.log(documentUrl);

            return (
              <a href={documentUrl} className="text-decoration-none text-dark">
                <div
                  className="d-flex mb-3 me-2 border-bottom border-secondary"
                  style={{ fontSize: "16px", fontWeight: "400" }}
                >
                  <div className="pb-2">
                    <img src={fileIcon} width="30px" height="30px" />
                  </div>
                  <div
                    className="d-flex align-items-center ms-3"
                    style={{ fontSize: "18px", fontWeight: "500" }}
                  >
                    {
                      driveData.FileRef.split("/")[
                        driveData.FileRef.split("/").length - 1
                      ]
                    }
                  </div>
                </div>
              </a>
            );
          })
        ) : (
          <Row className="w-100">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="d-flex w-100 justify-content-center align-items-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span className="text-secondary">No Data</span>}
                ></Empty>
              </div>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}
