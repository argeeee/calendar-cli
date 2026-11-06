import type { RepoQuery, Result } from "../../../../core";
import type { Calendar } from "../entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { UpdateCalendarRequest } from "../models/UpdateCalendarRequest";

export interface UpdateCalendarQuery
  extends RepoQuery<UpdateCalendarRequest, Result<Calendar, EventFailure>> {}
