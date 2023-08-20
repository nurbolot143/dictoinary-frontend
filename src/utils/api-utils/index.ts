import {EndpointResponse, EndpointResponseError, ProcessHttpResponseOptions} from "./types";

export const apiInterceptors = {
  unauthorizedCallback: async () => {
  },

  onUnauthorized: function (callback: any) {
    this.unauthorizedCallback = callback;
  }
};

export async function httpGet(url: string, params: any = {}): Promise<EndpointResponse> {
  for (let param in params) {
    if (params[param] === undefined
      || params[param] === null
      || params[param] === ""
    ) {
      delete params[param];
    }
  }

  url += "?" + new URLSearchParams(JSON.parse(JSON.stringify(params))).toString();

  return await processHttpResponse(() => {
    return fetch(url, {
      method: "get",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      credentials: "same-origin",
    });
  });
}

export async function httpPost(url: string, body?: object): Promise<EndpointResponse> {
  return await processHttpResponse(() => fetch(url, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    credentials: "same-origin",
  }));
}

export async function httpPostForm(url: string, formData: FormData): Promise<EndpointResponse> {
  return await processHttpResponse(() => fetch(url, {
    method: "post",
    body: formData,
    credentials: "same-origin"
  }));
}

export async function downloadFile(url: string, params: any, filename: string): Promise<EndpointResponse> {
  for (let param in params) {
    if (params[param] === undefined
      || params[param] === null
      || params[param] === ""
    ) {
      delete params[param];
    }
  }

  if (params) {
    url += "?" + new URLSearchParams(JSON.parse(JSON.stringify(params))).toString();
  }

  return await processHttpResponse(() => fetch(url, {
    method: "GET",
    headers: {
      "Accept": "image/jpeg",
    }
  }), {
    filename: filename
  });
}

function success(payload: any): EndpointResponse {
  return response(null, payload);
}

function failure(error: EndpointResponseError): EndpointResponse {
  return response(error, null);
}

function response(error: EndpointResponseError | null, success: any): EndpointResponse {
  return {
    error: error,
    result: success
  };
}

function systemError(): EndpointResponse {
  return failure(new EndpointResponseError(500, "Ошибка системы"));
}

async function processHttpResponse(requestFunc: () => Promise<Response>, options?: ProcessHttpResponseOptions): Promise<EndpointResponse> {
  try {
    const result = await requestFunc();

    if (result.ok) {
      const contentType = result.headers.get("content-type");
      const isJson = contentType != null && contentType.indexOf("application/json") !== -1;

      if (isJson) {
        const resultJson = await result.json();
        return success(resultJson);
      }

      const isHtml = contentType != null && contentType.indexOf("text/html") !== -1;

      if (isHtml) {
        const html = await result.text();
        return success(html);
      }

      const isXlsx = contentType != null && contentType.indexOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") !== -1;
      if (isXlsx) {
        const blob = await result.blob();
        const windowUrl = window.URL || window.webkitURL;

        const url = windowUrl.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = url;
        if (options && options.filename) {
          anchor.download = options.filename;
        }
        anchor.click();

        anchor.remove();
        return success({});
      }

      return success({});
    }

    if (result.status === 400) {
      const errorJson = await result.json();

      console.warn("errorJson", errorJson);

      return failure(new EndpointResponseError(result.status, errorJson.message, errorJson.parameterErrors));
    }

    if (result.status === 401) {
      await apiInterceptors.unauthorizedCallback();

      const error = new EndpointResponseError(
        result.status,
        "Пожалуйста, авторизуйтесь снова"
      );

      return failure(error);
    }

    if (result.status === 403) {
      const error = new EndpointResponseError(
        result.status,
        "Недостаточно прав доступа"
      );
      
      return failure(error);
    }

    console.error("error result", result);

    return systemError();
  } catch (e) {
    console.error("caught error", e);
    return systemError();
  }
}