import { lazy } from "../../core";
import { getGoogleAuthorizationService } from "../shared/injections";
import { GoogleCalendarClient } from "../shared/data/clients/GoogleCalendarClient";
import { CreateEventQueryImpl } from "./data/repoQueries/CreateEventQueryImpl";
import { DeleteEventQueryImpl } from "./data/repoQueries/DeleteEventQueryImpl";
import { GetEventQueryImpl } from "./data/repoQueries/GetEventQueryImpl";
import { ListEventsQueryImpl } from "./data/repoQueries/ListEventsQueryImpl";
import { UpdateEventQueryImpl } from "./data/repoQueries/UpdateEventQueryImpl";
import { CreateEvent } from "./domain/useCases/CreateEvent";
import { DeleteEvent } from "./domain/useCases/DeleteEvent";
import { GetEvent } from "./domain/useCases/GetEvent";
import { ListEvents } from "./domain/useCases/ListEvents";
import { UpdateEvent } from "./domain/useCases/UpdateEvent";

const getCalendarClient = lazy(
  () => new GoogleCalendarClient(getGoogleAuthorizationService()),
);

const getGetEventQuery = lazy(
  () => new GetEventQueryImpl(getCalendarClient()),
);

export const getListEvents = lazy(
  () => new ListEvents(new ListEventsQueryImpl(getCalendarClient())),
);

export const getEvent = lazy(
  () => new GetEvent(getGetEventQuery()),
);

export const getCreateEvent = lazy(
  () => new CreateEvent(new CreateEventQueryImpl(getCalendarClient())),
);

export const getUpdateEvent = lazy(
  () => new UpdateEvent(new UpdateEventQueryImpl(getCalendarClient())),
);

export const getDeleteEvent = lazy(
  () =>
    new DeleteEvent(
      new DeleteEventQueryImpl(getCalendarClient(), getGetEventQuery()),
    ),
);
