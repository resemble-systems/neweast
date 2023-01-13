import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "NewEastBannerWebPartStrings";
import NewEastBanner from "./components/NewEastBanner";
import { INewEastBannerProps } from "./components/INewEastBannerProps";

export interface INewEastBannerWebPartProps {
  description: string;
}

export default class NewEastBannerWebPart extends BaseClientSideWebPart<INewEastBannerWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  
  public render(): void {
    const element: React.ReactElement<INewEastBannerProps> = React.createElement(
      NewEastBanner,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        context: this.context,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      } 
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
