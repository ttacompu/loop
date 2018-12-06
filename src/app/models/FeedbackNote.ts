import { IManageLibrary } from "./IManageLibrary";
export class FeedbackNote {
  id: number;
  feedbackRequestId: number;
  title: string;
  details: string;
  iManageDocNumber: string;
  iManageLibrary: IManageLibrary;
  iManageDocUrl: string;
  isSharedWithProfDevelopment: boolean;
  CreatedOn: string;
  CreatedBy: string;
  popupViewType: string;
}
