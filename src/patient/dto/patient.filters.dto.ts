import { PageFilterDto } from "../../shared/dto/page.filter.dto";

export default class PatientFiltersDto extends PageFilterDto {
  name: string;
  status: number;
  renewalDate: Date;
  lastPrinted: Date;
}