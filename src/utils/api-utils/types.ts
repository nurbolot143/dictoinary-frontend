export type EndpointResponse<TResult = any> = {
  readonly error: EndpointResponseError | null,
  readonly result: TResult
}

export class EndpointResponseError {
  public status: number;
  public message: string | null;
  public parameterErrors: Record<string, string> | undefined;

  public constructor(status: number,
                     message: string | undefined,
                     parameterErrors: Record<string, string> | undefined = undefined) {
    this.status = status;
    this.message = message!;
    this.parameterErrors = parameterErrors;
  }
}

export type ProcessHttpResponseOptions = {
  filename?: string
}