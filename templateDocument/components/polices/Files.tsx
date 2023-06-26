import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface IFilesProps {
  fileFilter: any;
  context: WebPartContext;
  margin: string;
  searchText: string;
}

interface IFilesState {}

export default class Files extends React.Component<IFilesProps, IFilesState> {
  public constructor(props: IFilesProps, state: IFilesState) {
    super(props);
    this.state = {};
  }

  public render(): React.ReactElement<IFilesProps> {
    const {} = this.state;
    const { fileFilter, context, margin } = this.props;

    return (
      <div className="ps-3">
        {fileFilter?.length > 0 &&
          fileFilter?.map((driveData: any) => {
            let fileIcon: any;
            switch (
              driveData.Name.split(".")[driveData.Name.split(".").length - 1]
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
                case "PNG":
                  fileIcon = require("./png.png");
                  break;
              case "jpg" || "jpeg":
                fileIcon = require("./jpeg.png");
                break;
              case "pdf":
                fileIcon = require("./pdf.png");
                break;
              default:
                fileIcon = require("./word.png");
                break;
            }
            console.log(
              driveData.ServerRelativeUrl.split("/")[
                driveData.ServerRelativeUrl.split("/").length - 1
              ],
              driveData.ServerRelativeUrl.split(context.pageContext.web.title)[
                driveData.ServerRelativeUrl.split(context.pageContext.web.title)
                  .length - 1
              ],
              "Data Policies"
            );

            let absoluteUrl = context.pageContext.web.absoluteUrl;
            console.log(absoluteUrl,"absoluteurl")
            let subtUrl = driveData.ServerRelativeUrl.split(
              context.pageContext.web.title
            )[
              driveData.ServerRelativeUrl.split(context.pageContext.web.title)
                .length - 1
            ];
            console.log(subtUrl,"subturl")
             let documentUrl :any
           
             switch (absoluteUrl.split("/").length) {
               case 6:
                 documentUrl = `${absoluteUrl}/`.concat(
                   subtUrl.split("/").splice(4).join("/")
                 );
                 break;

               default:
                 documentUrl = absoluteUrl.concat(subtUrl);
                 }
            // let documentUrl = absoluteUrl.concat(subtUrl)
            // console.log(documentUrl,"documentsssurl");

            return (
              <a
                href={documentUrl}
                className="text-decoration-none text-dark"
                target="_blank"
                rel="noopener noreferrer"
                data-interception="off"
              >
                <div
                  className={`d-flex ${margin} mb-3 mt-3 me-2 border-bottom border-secondary`}
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
                      /* driveData.FileRef.split("/")[
                            driveData.FileRef.split("/").length - 1
                          ] */
                      driveData.Name
                    }
                  </div>
                </div>
              </a>
            );
          })}
      </div>
    );
  }
}
