import type { RepoQuery, Result } from "../../../../core";
import type { Calendar } from "../entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { GetCalendarRequest } from "../models/GetCalendarRequest";

export interface GetCalendarQuery
  extends RepoQuery<GetCalendarRequest, Result<Calendar, EventFailure>> {}
