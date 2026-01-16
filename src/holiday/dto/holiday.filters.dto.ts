import { PageFilterDto } from "../../shared/dto/page.filter.dto";

export default class HolidayFiltersDto extends PageFilterDto {
  description: string;
  date: string;
}
