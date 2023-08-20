import EndpointCallState from "./endpoint-call-state";
import {EndpointResponse, EndpointResponseError} from "../../../utils/api-utils/types";

type EndpointCall<TParams, TResult> = {
  readonly result: TResult,
  readonly error: EndpointResponseError | null,
  readonly state: EndpointCallState,
  readonly isLoading: boolean,
  readonly call: (params: TParams) => Promise<EndpointResponse<TResult>>
  readonly setResult: (nextResult: TResult) => void
  readonly setError: (nextResult: EndpointResponseError) => void,
  readonly setState: (nextResult: EndpointCallState) => void
}

export default EndpointCall;