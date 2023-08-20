import {useState} from "react";
import EndpointCallState from "./types/endpoint-call-state";
import EndpointCall from "./types/endpoint-call";
import State from "./types/state";
import RequestFunc from "./types/request-func";
import stateHelper from "./state-helper";
import {EndpointResponseError} from "../../utils/api-utils/types";

export default function useEndpoint<TResult, TParams = void>(requestFunc: RequestFunc<TParams>, defaultResult: TResult): EndpointCall<TParams, TResult> {
  const [state, setState] = useState<State<TResult>>(stateHelper.initial(defaultResult));

  async function call(params: TParams) {
    setState(stateHelper.pending());

    const response = await requestFunc(params);

    if (response.error) {
      setState(stateHelper.error(response.error));
    }

    if (response.result) {
      setState(stateHelper.success(response.result));
    }

    return response;
  }

  function setResponseResult(result: TResult) {
    setState(stateHelper.setResponseResult(result));
  }

  function setResponseError(error: EndpointResponseError) {
    setState(stateHelper.setResponseError(error));
  }

  function setCallState(callState: EndpointCallState) {
    setState(stateHelper.setCallState(callState));
  }

  return {
    result: state.responseResult,
    error: state.responseError,
    state: state.callState,
    isLoading: state.callState === EndpointCallState.PENDING,
    call: call,
    setResult: setResponseResult,
    setError: setResponseError,
    setState: setCallState
  };
}
