import type { RepoQuery, Result } from "../../../../core";
import type { Calendar } from "../entities/Calendar";
import type { EventFailure } from "../../../shared/domain/failures/EventFailure";
import type { CreateCalendarRequest } from "../models/CreateCalendarRequest";

export interface CreateCalendarQuery
  extends RepoQuery<CreateCalendarRequest, Result<Calendar, EventFailure>> {}
