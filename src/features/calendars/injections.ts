import { lazy } from "../../core";
import { getGoogleAuthorizationService } from "../shared/injections";
import { GoogleCalendarClient } from "../shared/data/clients/GoogleCalendarClient";
import { ListCalendars } from "./domain/useCases/ListCalendars";
import { ListCalendarsQueryImpl } from "./data/repoQueries/ListCalendarsQueryImpl";
import { GetCalendar } from "./domain/useCases/GetCalendar";
import { GetCalendarQueryImpl } from "./data/repoQueries/GetCalendarQueryImpl";
import { DeleteCalendar } from "./domain/useCases/DeleteCalendar";
import { DeleteCalendarQueryImpl } from "./data/repoQueries/DeleteCalendarQueryImpl";
import { CreateCalendar } from "./domain/useCases/CreateCalendar";
import { CreateCalendarQueryImpl } from "./data/repoQueries/CreateCalendarQueryImpl";
import { UpdateCalendar } from "./domain/useCases/UpdateCalendar";
import { UpdateCalendarQueryImpl } from "./data/repoQueries/UpdateCalendarQueryImpl";

const getCalendarClient = lazy(
  () => new GoogleCalendarClient(getGoogleAuthorizationService()),
);

export const getListCalendars = lazy(
  () => new ListCalendars(new ListCalendarsQueryImpl(getCalendarClient())),
);

export const getCalendar = lazy(
  () => new GetCalendar(new GetCalendarQueryImpl(getCalendarClient())),
);

export const getDeleteCalendar = lazy(
  () => new DeleteCalendar(new DeleteCalendarQueryImpl(getCalendarClient())),
);

export const getCreateCalendar = lazy(
  () => new CreateCalendar(new CreateCalendarQueryImpl(getCalendarClient())),
);

export const getUpdateCalendar = lazy(
  () => new UpdateCalendar(new UpdateCalendarQueryImpl(getCalendarClient())),
);
