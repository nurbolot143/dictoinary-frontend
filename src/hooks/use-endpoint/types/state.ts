import EndpointCallState from "./endpoint-call-state";
import {EndpointResponseError} from "../../../utils/api-utils/types";

type State<TResult> = {
  callState: EndpointCallState,
  responseError: EndpointResponseError | null,
  responseResult: TResult
}

export default State;