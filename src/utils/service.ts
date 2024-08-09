interface Request {
  [key: string]: any;
}

export interface PostRequest {
  token?: string;
  payload: Request;
}

export interface GetRequest {
  token?: string;
  query: Request;
}

export interface Response {
  status: boolean;
  message: string;
  data: any | null;
  eror: any | null;
}

const generateQuery = (obj: Request) => {
  const query = Object.keys(obj)
    .reduce((carry, key) => {
      if (obj[key] || obj[key] === 0) {
        return carry + `${key}=${obj[key]}&`;
      }
      return carry;
    }, "")
    .replace(/&+$/, "");
  return `?${query}`;
};

export const Post = async (
  url: string,
  { arg }: { arg: PostRequest },
): Promise<Response> => {
  const response = await fetch(`/api${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(arg?.token && {
        Authorization: `Bearer ${arg.token}`,
      }),
    },
    body: JSON.stringify(arg.payload),
  });
  const body = await response.json();
  return { ...body, status: `${response.status}`.charAt(0) === "2" };
};

export const Get =
  (arg: GetRequest) =>
  async (url: string): Promise<Response> => {
    const response = await fetch(`/api${url}${generateQuery(arg.query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(arg?.token && {
          Authorization: `Bearer ${arg.token}`,
        }),
      },
    });
    const body = await response.json();
    return { ...body, status: `${response.status}`.charAt(0) === "2" };
  };
