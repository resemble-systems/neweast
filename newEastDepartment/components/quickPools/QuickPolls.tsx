import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import styles from "../NewEastDepartment.module.scss";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";

interface IQuickPollsProps {
  context: WebPartContext;
}
interface IQuickPollsState {
  submit: any;
  currentPage: number;
  quickPollsAsSorted: any;
  quickPollsChoice: any;
}

export default class QuickPolls extends React.Component<
  IQuickPollsProps,
  IQuickPollsState
> {
  public constructor(props: IQuickPollsProps, state: IQuickPollsState) {
    super(props);
    this.state = {
      submit: false,
      currentPage: 1,
      quickPollsAsSorted: [],
      quickPollsChoice: {},
    };
  }

  public componentDidMount(): void {
    this.getQuickPolls();
  }
  public getQuickPolls = () => {
    const { context } = this.props;

    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('QuickPolls')/items?$select=*&$expand=AttachmentFiles`,
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
        console.log("quickPollsAsSorted", sortedItems);
        this.setState({ quickPollsAsSorted: sortedItems });
      });
  };

  public updateItem = (pollResponse: any, ID: any) => {
    const { context } = this.props;
    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Choice: pollResponse,
      }),
    };
    context.spHttpClient
      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('QuickPolls')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((r) => {
        console.log(r, "Post Response");
        this.getQuickPolls();
        this.setState({ quickPollsChoice: {} });
      });
  };

  public handleSubmit = (ID: any, ANSWER: any) => {
    const { context } = this.props;
    let result = {
      RespondantName: context.pageContext.user.displayName,
      RespondantEmail: context.pageContext.user.email,
      RespondantChoice: this.state.quickPollsChoice,
    };
    let pollArray = JSON.parse(ANSWER);
    console.log(pollArray, "TEST");

    if (!pollArray) {
      let pollResult = [result];
      let pollResponse = JSON.stringify(pollResult);
      if (this.state.quickPollsChoice.ID === ID) {
        this.updateItem(pollResponse, ID);
        alert("Submitted");
      } else {
        this.setState({ quickPollsChoice: {} });
        alert("Please select valid options");
      }
    } else {
      let pollResult = [...pollArray, result];
      let pollResponse = JSON.stringify(pollResult);
      if (this.state.quickPollsChoice.ID === ID) {
        this.updateItem(pollResponse, ID);
        alert("Submitted");
      } else {
        this.setState({ quickPollsChoice: {} });
        alert("Please select valid options");
      }
    }
  };

  public handleEdit = (ID: any, CHOICE: any) => {
    const { context } = this.props;
    let pollArray = JSON.parse(CHOICE);

    let isUserExist: any = [];
    if (pollArray) {
      isUserExist = pollArray.filter(
        (item: any) =>
          item.RespondantName !== context.pageContext.user.displayName &&
          item.RespondantEmail !== context.pageContext.user.email
      );
    }
    let pollResult = isUserExist;
    let pollResponse = JSON.stringify(pollResult);
    this.updateItem(pollResponse, ID);
  };

  public render(): React.ReactElement<IQuickPollsProps> {
    const { currentPage, quickPollsAsSorted } = this.state;
    const { context } = this.props;

    const document = require("./document.svg");

    const exercisesPerPage = 2;
    const numberOfElements = quickPollsAsSorted.length;
    const numberOfPages = Math.round(numberOfElements / exercisesPerPage);
    const indexOfLastPage = currentPage * exercisesPerPage;
    const indexOfFirstPage = indexOfLastPage - exercisesPerPage;
    const currentData = quickPollsAsSorted.slice(
      indexOfFirstPage,
      indexOfLastPage
    );
    console.log(this.state.quickPollsChoice, "quickPollsChoice");

    return (
      <>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-start align-items-center">
            <div>
              <img src={document} />
            </div>
            <div
              className="ps-3"
              style={{ fontSize: "20px", fontWeight: "700" }}
            >
              Quick Pools
            </div>
          </div>
          <div className="d-flex align-items-center">
            <span
              onClick={() => {
                this.setState({
                  currentPage:
                    currentPage > 1 ? currentPage - 1 : currentPage - 0,
                });
              }}
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-chevron-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </span>
            <span
              className="d-flex align-items-center"
              style={{ fontWeight: 700, fontSize: "12px" }}
            >
              {currentPage}
            </span>
            <span
              className="d-flex align-items-center"
              style={{ fontWeight: 600, fontSize: "12px" }}
            >
              /
            </span>
            <span
              className="d-flex align-items-center"
              style={{ fontWeight: 700, fontSize: "12px" }}
            >
              {numberOfPages}
            </span>
            <span
              onClick={() => {
                this.setState({
                  currentPage:
                    currentPage >= numberOfPages
                      ? currentPage + 0
                      : currentPage + 1,
                });
              }}
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-chevron-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </span>
          </div>
        </div>
        <div>
          {/* Quick Poll */}
          <div
            className={`mb-3 ${styles.scroll}`}
            style={{ height: "420px", overflowY: "scroll" }}
          >
            {currentData.map((quickpolls: any) => {
              console.log(
                "Quick Poll Condition",
                JSON.parse(quickpolls.Choice)
              );
              const ChoiceSelected = JSON.parse(quickpolls.Choice);
              let isUserExist: any = [];
              if (ChoiceSelected) {
                isUserExist = ChoiceSelected.filter(
                  (item: any) =>
                    item.RespondantName ===
                      context.pageContext.user.displayName &&
                    item.RespondantEmail === context.pageContext.user.email
                );
              }
              console.log("Poll", isUserExist, isUserExist.length);

              if (isUserExist.length === 0) {
                return (
                  <div className="d-flex my-3">
                    <div style={{ fontSize: "16px", fontWeight: "500" }}>
                      Q{}
                    </div>
                    <div className="ms-2 w-100">
                      <div style={{ fontSize: "16px", fontWeight: "500" }}>
                        {quickpolls.Title}
                      </div>
                      <div className="mt-2">
                        <div
                          className="d-flex"
                          style={{ height: "30px", cursor: "pointer" }}
                          onClick={() => {
                            this.setState({
                              quickPollsChoice: {
                                ID: quickpolls.ID,
                                Option: quickpolls.Option1,
                              },
                            });
                          }}
                        >
                          <div className="d-flex h-100 align-items-center">
                            <div
                              className="border border-2 border-dark rounded-circle "
                              style={{
                                height: "15px",
                                width: "15px",
                                backgroundColor:
                                  this.state.quickPollsChoice.Option ===
                                    quickpolls.Option1 &&
                                  this.state.quickPollsChoice.ID ===
                                    quickpolls.ID
                                    ? "#f75b52"
                                    : "#ffffff",
                              }}
                            ></div>
                          </div>
                          <div className="d-flex h-100 align-items-center ps-2">
                            {quickpolls.Option1}
                          </div>
                        </div>
                        <div
                          className="d-flex"
                          style={{ height: "30px", cursor: "pointer" }}
                          onClick={() => {
                            this.setState({
                              quickPollsChoice: {
                                ID: quickpolls.ID,
                                Option: quickpolls.Option2,
                              },
                            });
                          }}
                        >
                          <div className="d-flex h-100 align-items-center">
                            <div
                              className="border border-2 border-dark rounded-circle "
                              style={{
                                height: "15px",
                                width: "15px",
                                backgroundColor:
                                  this.state.quickPollsChoice.Option ===
                                    quickpolls.Option2 &&
                                  this.state.quickPollsChoice.ID ===
                                    quickpolls.ID
                                    ? "#f75b52"
                                    : "#ffffff",
                              }}
                            ></div>
                          </div>
                          <div className="d-flex h-100 align-items-center ps-2">
                            {quickpolls.Option2}
                          </div>
                        </div>
                        <div
                          className="d-flex"
                          style={{ height: "30px", cursor: "pointer" }}
                          onClick={() => {
                            this.setState({
                              quickPollsChoice: {
                                ID: quickpolls.ID,
                                Option: quickpolls.Option3,
                              },
                            });
                          }}
                        >
                          <div className="d-flex h-100 align-items-center">
                            <div
                              className="border border-2 border-dark rounded-circle "
                              style={{
                                height: "15px",
                                width: "15px",
                                backgroundColor:
                                  this.state.quickPollsChoice.Option ===
                                    quickpolls.Option3 &&
                                  this.state.quickPollsChoice.ID ===
                                    quickpolls.ID
                                    ? "#f75b52"
                                    : "#ffffff",
                              }}
                            ></div>
                          </div>
                          <div className="d-flex h-100 align-items-center ps-2">
                            {quickpolls.Option3}
                          </div>
                        </div>
                        <div
                          className="d-flex"
                          style={{ height: "30px", cursor: "pointer" }}
                          onClick={() => {
                            this.setState({
                              quickPollsChoice: {
                                ID: quickpolls.ID,
                                Option: quickpolls.Option4,
                              },
                            });
                          }}
                        >
                          <div className="d-flex h-100 align-items-center">
                            <div
                              className="border border-2 border-dark rounded-circle "
                              style={{
                                height: "15px",
                                width: "15px",
                                backgroundColor:
                                  this.state.quickPollsChoice.Option ===
                                    quickpolls.Option4 &&
                                  this.state.quickPollsChoice.ID ===
                                    quickpolls.ID
                                    ? "#f75b52"
                                    : "#ffffff",
                              }}
                            ></div>
                          </div>
                          <div className="d-flex h-100 align-items-center ps-2">
                            {quickpolls.Option4}
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <div
                            className="d-flex justify-content-center mt-2 rounded text-white w-25 p-2"
                            style={{
                              backgroundColor: "#f75b52",
                              fontSize: "16px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (this.state.quickPollsChoice !== "") {
                                this.handleSubmit(
                                  quickpolls.ID,
                                  quickpolls.Choice
                                );
                              } else {
                                alert("Please select an option");
                              }
                            }}
                          >
                            Submit
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                const selectOption = isUserExist[0].RespondantChoice.Option;
                const selectID = isUserExist[0].RespondantChoice.ID;
                console.log("Selected Choice", selectOption, selectID);
                return (
                  <div className="d-flex my-3">
                    <div style={{ fontSize: "16px", fontWeight: "500" }}>
                      Q{}
                    </div>
                    <div className="ms-2 w-100">
                      <div style={{ fontSize: "16px", fontWeight: "500" }}>
                        {quickpolls.Title}
                      </div>
                      <div className="mt-2">
                        <div
                          className="d-flex"
                          style={{ height: "30px", cursor: "not-allowed" }}
                        >
                          <div className="d-flex h-100 align-items-center">
                            <div
                              className="border border-2 border-dark rounded-circle "
                              style={{
                                height: "15px",
                                width: "15px",
                                backgroundColor:
                                  selectOption === quickpolls.Option1 &&
                                  selectID === quickpolls.ID
                                    ? "#f75b52"
                                    : "#ffffff",
                              }}
                            ></div>
                          </div>
                          <div className="d-flex h-100 align-items-center ps-2">
                            {quickpolls.Option1}
                          </div>
                        </div>
                        <div
                          className="d-flex"
                          style={{ height: "30px", cursor: "not-allowed" }}
                        >
                          <div className="d-flex h-100 align-items-center">
                            <div
                              className="border border-2 border-dark rounded-circle "
                              style={{
                                height: "15px",
                                width: "15px",
                                backgroundColor:
                                  selectOption === quickpolls.Option2 &&
                                  selectID === quickpolls.ID
                                    ? "#f75b52"
                                    : "#ffffff",
                              }}
                            ></div>
                          </div>
                          <div className="d-flex h-100 align-items-center ps-2">
                            {quickpolls.Option2}
                          </div>
                        </div>
                        <div
                          className="d-flex"
                          style={{ height: "30px", cursor: "not-allowed" }}
                        >
                          <div className="d-flex h-100 align-items-center">
                            <div
                              className="border border-2 border-dark rounded-circle "
                              style={{
                                height: "15px",
                                width: "15px",
                                backgroundColor:
                                  selectOption === quickpolls.Option3 &&
                                  selectID === quickpolls.ID
                                    ? "#f75b52"
                                    : "#ffffff",
                              }}
                            ></div>
                          </div>
                          <div className="d-flex h-100 align-items-center ps-2">
                            {quickpolls.Option3}
                          </div>
                        </div>
                        <div
                          className="d-flex"
                          style={{ height: "30px", cursor: "not-allowed" }}
                        >
                          <div className="d-flex h-100 align-items-center">
                            <div
                              className="border border-2 border-dark rounded-circle "
                              style={{
                                height: "15px",
                                width: "15px",
                                backgroundColor:
                                  selectOption === quickpolls.Option4 &&
                                  selectID === quickpolls.ID
                                    ? "#f75b52"
                                    : "#ffffff",
                              }}
                            ></div>
                          </div>
                          <div className="d-flex h-100 align-items-center ps-2">
                            {quickpolls.Option4}
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <div
                            className="d-flex justify-content-center mt-2 rounded text-dark w-25 p-2"
                            style={{
                              fontSize: "16px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              this.handleEdit(quickpolls.ID, quickpolls.Choice);
                            }}
                          >
                            Edit
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </>
    );
  }
}
