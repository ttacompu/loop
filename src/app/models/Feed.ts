import { FeedType } from "./FeedType";
import { Office } from "./Office";
import { ContentOwner } from "./ContentOwner";
import { SubscriptionGroup } from "./SubscriptionGroup";
import { Person } from "./Person";
import { AccessType } from "./AccessType";
import { Category } from "./Category";
import { PracticeArea } from "./PracticeArea";
import { Region } from "./Region";
import { Topic } from "./Topic";



export class Feed {
  feedID: number;
  feedContact: Person;
  description: string;
  externalType: FeedType;
  isDisabled: boolean;
  status: string;
  isInternal: boolean;
  name: string;
  postCount: number;
  rssLink: string;
  lastSyncUpdatedOn: string;
  clientNumber: string;
  accessType: AccessType;
  subscriptionGroups: SubscriptionGroup[];
  offices: Office[];
  categories: Category[];
  practiceAreas: PracticeArea[];
  regions: Region[];
  topics: Topic[];

  listEvents: any;

  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  updatedBy: string;
  
}
