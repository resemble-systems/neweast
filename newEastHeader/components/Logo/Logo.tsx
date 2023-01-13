import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

interface ILogoProps {
  context: WebPartContext;
}

interface ILogoState {
  headerLogo: any;
}

export default class Logo extends React.Component<ILogoProps, ILogoState> {
  public constructor(props: ILogoProps, state: ILogoState) {
    super(props);
    this.state = {
      headerLogo: [],
    };
  }

  public componentDidMount(): void {
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
        const headerLogo: any = listItems.value.filter(
          (item: any) => item.Title.toLowerCase() === "header"
        );
        console.log("headerLogo", headerLogo);
        this.setState({ headerLogo: headerLogo });
      });
  }

  public render(): React.ReactElement<ILogoProps> {
    const { context } = this.props;
    const { headerLogo } = this.state;

    return (
      <>
        {headerLogo.map((header: any) => {
          return (
            <div className="w-25 h-100 d-flex align-items-center justify-content-start">
              <a
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Home.aspx`}
              >
                <img
                 src={
                  context.pageContext.web.absoluteUrl
                    .split("/")
                    .slice(0, 3)
                    .join("/") +
                    header?.AttachmentFiles[0]
                    ?.ServerRelativeUrl
                }
                  height={header.Height}
                  width={header.Width}
                  alt="Logo"
                />
              </a>
            </div>
          );
        })}
      </>
    );
  }
}
