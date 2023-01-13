import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface INewEastHeaderProps {
  description: string;
  context: WebPartContext;
  userDisplayName: string;
}
