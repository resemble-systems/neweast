import * as React from "react";
import { INewEastHeaderProps } from "./INewEastHeaderProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import Navbar from "./Navbar/Navbar";
import "antd/dist/reset.css";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export default class NewEastHeader extends React.Component<
  INewEastHeaderProps,
  {}
> {
  public componentDidMount() {
    const appBar: any = document?.getElementById("sp-appBar");
    appBar.style.display = "none";

    const paddingCanvas: any = document.getElementsByClassName("k_c_50a7110f");
    console.log("paddingCanvas", paddingCanvas);

    const spSiteHeader: any = document?.getElementById("spSiteHeader");
    spSiteHeader
      ? (spSiteHeader.style.display = "none")
      : console.log("spSiteHeader", spSiteHeader);

    const spLeftNav: any = document?.getElementById("spLeftNav");
    spLeftNav
      ? (spLeftNav.style.display = "none")
      : console.log("spLeftNav", spLeftNav);

    const spAppBar: any = document?.getElementById("sp-appBar");
    spAppBar
      ? (spAppBar.style.display = "none")
      : console.log("spAppBar", spAppBar);

    const SuiteNavWrapper: any = document?.getElementById(
      "SuiteNavPlaceholder"
    );
    SuiteNavWrapper
      ? (SuiteNavWrapper.style.display = "none")
      : console.log("SuiteNavWrapper", SuiteNavWrapper);

    const { context } = this.props;

    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Admin')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )

      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })

      .then((listItems: any) => {
        console.log("Admin listItems", listItems);
        const adminUser = listItems.value;
        let adminList = adminUser.map((item: any) => item.Title);
        console.log("adminList", adminList);
        if (adminList.length > 0) {
          let filteredAdminList = adminList.filter(
            (item: any) => item === context.pageContext.user.email
          );
          console.log("Current User", context.pageContext.user.email);
          console.log("filteredAdminList", filteredAdminList);
          const spCommandBar: any = document?.getElementById("spCommandBar");
          if ((filteredAdminList.length = 0)) {
            spCommandBar.style.display = "none";
          } else {
            console.log("Admin User");
          }
        } else {
          console.log("Admin User List Not Found");
        }
      });
  }

  public render(): React.ReactElement<INewEastHeaderProps> {
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
        <Navbar context={context} />
      </>
    );
  }
}
