import State from "./types/state";
import EndpointCallState from "./types/endpoint-call-state";
import {EndpointResponseError} from "../../utils/api-utils/types";

function initial<TResult>(defaultResult: TResult): State<TResult> {
  return {
    callState: EndpointCallState.NO_OPERATION,
    responseResult: defaultResult,
    responseError: null
  };
}

function pending<TResult>(): (prevState: State<TResult>) => State<TResult> {
  return (prevState) => ({
    ...prevState,
    callState: EndpointCallState.PENDING
  });
}

function error<TResult>(error: EndpointResponseError): (prevState: State<TResult>) => State<TResult> {
  return (prevState) => ({
    ...prevState,
    callState: EndpointCallState.ERROR,
    responseError: error
  });
}

function success<TResult>(result: TResult): (prevState: State<TResult>) => State<TResult> {
  return (prevState) => ({
    ...prevState,
    callState: EndpointCallState.SUCCESS,
    responseResult: result,
    responseError: null
  });
}

function setResponseResult<TResult>(result: TResult): (prevState: State<TResult>) => State<TResult> {
  return (prevState) => ({
    ...prevState,
    responseResult: result
  });
}

function setResponseError<TResult>(error: EndpointResponseError): (prevState: State<TResult>) => State<TResult> {
  return (prevState) => ({
    ...prevState,
    responseError: error
  });
}

function setCallState<TResult>(callState: EndpointCallState): (prevState: State<TResult>) => State<TResult> {
  return (prevState) => ({
    ...prevState,
    callState: callState
  });
}

export default {
  initial,
  pending,
  error,
  success,
  setResponseResult,
  setResponseError,
  setCallState
};