import { IManageLibrary } from "./IManageLibrary";

export class NoteView {
  id: number;
  feedbackRequestId: number;
  requesterClearyKey: string;
  requesterLastName: string;
  requesterFirstName: string;
  requesterFullName: string;
  contributorClearyKey: string;
  contributorLastName: string;
  contributorFirstName: string;
  contributorFullName: string;
  createdOn: string;
  createdBy: string;
  createdByLastName: string;
  createdByFirstName: string;  
  createdByFullName: string;
  title: string;
  details: string;
  iManageDocNumber: string;
  iManageLibrary: IManageLibrary;
  iManageDocUrl: string;

  
}

