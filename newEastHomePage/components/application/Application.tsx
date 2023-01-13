import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Row, Col, Empty } from "antd";
import styles from "../HomePage.module.scss";

interface IApplicationProps {
  context: WebPartContext;
}

interface IApplicationState {
  applicationAsRecent: any;
}

export default class Application extends React.Component<
  IApplicationProps,
  IApplicationState
> {
  public constructor(props: IApplicationProps, state: IApplicationState) {
    super(props);
    this.state = {
      applicationAsRecent: [],
    };
  }

  public componentDidMount(): void {
    const { context } = this.props;

    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Applications')/items?$select=*&$expand=AttachmentFiles`,
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
        console.log("applicationAsRecent", sortedItems);
        this.setState({ applicationAsRecent: sortedItems });
      });
  }

  public render(): React.ReactElement<IApplicationProps> {
    const { applicationAsRecent } = this.state;
    const { context } = this.props;
    const mail = require("./mail.svg");

    return (
      <>
        {applicationAsRecent?.length > 0 ? (
          <div
            className="my-3 row row-cols-sm-auto row-cols-md-3 row-cols-lg-2 row-cols-xl-3"
            style={{ maxHeight: "420px", overflowY: "scroll" }}
          >
            {applicationAsRecent.map((application: any) => {
              return (
                <div className="col py-2 px-3" key={application.ID}>
                  <a
                    className="text-decoration-none text-dark"
                    href={application.Link}
                  >
                    <div
                      className="d-flex py-3 rounded-2  justify-content-center align-items-center"
                      style={{
                        backgroundColor: "#f4f4f4",
                        height: "100px",
                        width: "90px",
                      }}
                    >
                      <div>
                        <div className="d-flex justify-content-center">
                          {application?.AttachmentFiles.length > 0 ? (
                            <img
                              src={
                                context.pageContext.web.absoluteUrl
                                  .split("/")
                                  .slice(0, 3)
                                  .join("/") +
                                application?.AttachmentFiles[0]
                                  ?.ServerRelativeUrl
                              }
                              width="25px"
                              height="25px"
                              alt="App"
                            />
                          ) : (
                            <img
                              src={mail}
                              width="25px"
                              height="25px"
                              alt="App"
                            />
                          )}
                        </div>
                        <div
                          className={`d-flex pt-1 justify-content-center text-center ${styles.headingOne}`}
                          style={{ fontSize: "14px", fontWeight: "500" }}
                        >
                          {application.Title}
                        </div>
                      </div>
                    </div>
                  </a>
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
                  description={<span className="text-secondary">No Data</span>}
                ></Empty>
              </div>
            </Col>
          </Row>
        )}
      </>
    );
  }
}
