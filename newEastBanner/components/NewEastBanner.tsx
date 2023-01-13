import * as React from "react";

import { INewEastBannerProps } from "./INewEastBannerProps";

import "antd/dist/reset.css";
import Banner from "./banner/Banner";
import { Row, Col } from "antd";
import { SPComponentLoader } from "@microsoft/sp-loader";

export default class NewEastBanner extends React.Component<
  INewEastBannerProps,
  {}
> {
  public render(): React.ReactElement<INewEastBannerProps> {
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    let fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Montserrat =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:wght@600&display=swap";
    let Roboto =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap";
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Montserrat);
    SPComponentLoader.loadCss(Roboto);

    const { context } = this.props;

    return (
      <>
         <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Banner
                context={context}
              />
            </Col>
          </Row>
      </>
    );
  }
}
