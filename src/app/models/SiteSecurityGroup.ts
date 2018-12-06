import { SiteSecurityRole } from "./SiteSecurityRole";

export class SiteSecurityGroup {
  id: number;
  groupName: string;
  role: SiteSecurityRole;
  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  updatedBy: string;
}
