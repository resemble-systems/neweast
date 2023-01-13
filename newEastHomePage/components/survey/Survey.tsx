import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import styles from "../HomePage.module.scss";
import { Row, Col, Empty } from "antd";

interface ISurveyProps {
  context: WebPartContext;
}

interface ISurveyState {
  surveyAsRecent: any;
}

export default class Survey extends React.Component<
  ISurveyProps,
  ISurveyState
> {
  public constructor(props: ISurveyProps, state: ISurveyState) {
    super(props);
    this.state = {
      surveyAsRecent: [],
    };
  }

  public componentDidMount(): void {
    const { context } = this.props;

    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Survays')/items?$select=*&$expand=AttachmentFiles`,
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
        console.log("surveyAsRecent", sortedItems);
        this.setState({ surveyAsRecent: sortedItems });
      });
  }

  public render(): React.ReactElement<ISurveyProps> {
    const { surveyAsRecent } = this.state;
    const { context } = this.props;

    return (
      <>
        {surveyAsRecent?.length > 0 ? (
          <div
            className={`mb-3 ${styles.scroll}`}
            style={{ height: "420px", overflowY: "scroll" }}
          >
            {surveyAsRecent.map((survey: any) => {
              return (
                <a
                  key={survey.ID}
                  className="text-dark"
                  href={`${context.pageContext.web.absoluteUrl}/SitePages/Page%20Details.aspx?pp=home&lname=survey&pid=${survey.ID}`}
                >
                  <div
                    className={`${styles.surveyDescription} p-2 rounded-3 mt-4 me-2 text-decoration-underline`}
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      backgroundColor: "#ededed",
                      cursor: "pointer",
                      height: "85px",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: survey.Description,
                    }}
                  ></div>
                </a>
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
