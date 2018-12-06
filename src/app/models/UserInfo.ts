import { Person } from "./Person";
import { SiteSecurityRole } from "./SiteSecurityRole";

export class UserInfo {
  person: Person;
  userSharePointPhotoURL: string;
  roles: any[];
  impersonatedUserInfo: any;
}
