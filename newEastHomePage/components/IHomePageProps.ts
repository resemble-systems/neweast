import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IHomePageProps {
  description: string;
  isDarkTheme: boolean;
  context: WebPartContext;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
