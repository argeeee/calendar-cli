import { lazy } from "../../core";
import { getGoogleAuthorizationService } from "../shared/injections";
import { GoogleCalendarClient } from "../shared/data/clients/GoogleCalendarClient";
import { ListEventLabelsQueryImpl } from "./data/repoQueries/ListEventLabelsQueryImpl";
import { ListEventLabels } from "./domain/useCases/ListEventLabels";

const getCalendarClient = lazy(
  () => new GoogleCalendarClient(getGoogleAuthorizationService()),
);

export const getListEventLabels = lazy(
  () => new ListEventLabels(new ListEventLabelsQueryImpl(getCalendarClient())),
);
