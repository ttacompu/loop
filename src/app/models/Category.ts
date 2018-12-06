import { CategoryType } from "./CategoryType";

export class Category {
  id: number;
  name: string;
  categoryType: CategoryType;
  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  updatedBy: string;
}
