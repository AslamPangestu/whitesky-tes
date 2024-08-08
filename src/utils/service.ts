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

export const Post = async (url: string, { arg }: { arg: PostRequest }) => {
  return await fetch(`/api${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(arg?.token && {
        Authorization: `Bearer ${arg.token}`,
      }),
    },
    body: JSON.stringify(arg.payload),
  });
};

export const Get = (arg: GetRequest) => async (url: string) => {
  return await fetch(`/api${url}${generateQuery(arg.query)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(arg?.token && {
        Authorization: `Bearer ${arg.token}`,
      }),
    },
  });
};
