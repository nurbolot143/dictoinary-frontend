import {EndpointResponse} from "../../../utils/api-utils/types";

type RequestFunc<TParams> = (params: TParams) => Promise<EndpointResponse>

export default RequestFunc;
