type ResponseData = {
  status: string;
  message: string;
  data?: any;
  errors?: any;
};

export interface ApiResponse {
  status: number;
  data: ResponseData;
}

export default class HttpGateway {
  static requestJson = async (
    method: string,
    url: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse> => {
    let responseJson = {
      status: "",
      message: "",
    };

    const response = await fetch(url, {
      method,
      body,
      headers: { "Content-Type": "application/json", ...headers },
    });

    if (response.headers.get("Content-Type")?.includes("application/json")) {
      responseJson = (await response.json()) as ResponseData;
    }

    return { status: response.status, data: responseJson };
  };

  static httpRefreshToken = async () => {
    HttpGateway.requestJson("POST", "/api/auth/refresh");
  };

  static httpGet = async (url: string) => {
    const { status, data } = await HttpGateway.requestJson("GET", url);
    return { status, data };
  };

  static httpPost = async (url: string, body: any = "{}") => {
    const { status, data } = await HttpGateway.requestJson("POST", url, body);
    return { status, data };
  };

  static httpPut = async (url: string, body: any = "{}") => {
    const { status, data } = await HttpGateway.requestJson("PUT", url, body);
    return { status, data };
  };

  static httpPatch = async (url: string, body: any = "{}") => {
    const { status, data } = await HttpGateway.requestJson("PATCH", url, body);
    return { status, data };
  };

  static httpDelete = async (url: string) => {
    const { status, data } = await HttpGateway.requestJson("DELETE", url);
    return { status, data };
  };

  static secureHttpGet = async (url: string) => {
    const { status, data } = await HttpGateway.requestJson("GET", url);

    if (status === 401) {
      await HttpGateway.httpRefreshToken();
      const { status, data } = await HttpGateway.requestJson("GET", url);
      return { status, data };
    }

    return { status, data };
  };

  static secureHttpPost = async (url: string, body: any = "{}") => {
    const { status, data } = await HttpGateway.requestJson("POST", url, body);

    if (status === 401) {
      await HttpGateway.httpRefreshToken();
      const { status, data } = await HttpGateway.requestJson("POST", url, body);
      return { status, data };
    }

    return { status, data };
  };

  static secureHttpPut = async (url: string, body: any = "{}") => {
    const { status, data } = await HttpGateway.requestJson("PUT", url, body);

    if (status === 401) {
      await HttpGateway.httpRefreshToken();
      const { status, data } = await HttpGateway.requestJson("PUT", url, body);
      return { status, data };
    }

    return { status, data };
  };

  static secureHttpPatch = async (url: string, body: any = "{}") => {
    const { status, data } = await HttpGateway.requestJson("PATCH", url, body);

    if (status === 401) {
      await HttpGateway.httpRefreshToken();
      const { status, data } = await HttpGateway.requestJson(
        "PATCH",
        url,
        body
      );
      return { status, data };
    }

    return { status, data };
  };

  static secureHttpDelete = async (url: string) => {
    const { status, data } = await HttpGateway.requestJson("DELETE", url);

    if (status === 401) {
      await HttpGateway.httpRefreshToken();
      const { status, data } = await HttpGateway.requestJson("DELETE", url);
    }

    return { status, data };
  };
}
