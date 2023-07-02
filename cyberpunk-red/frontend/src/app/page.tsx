import {
  getUserFunctionSignature,
  TGetUserPayload,
  createRequest,
  TUser,
  IApiError,
} from 'beyond-cyberpunk-red-schema';
import { okAsync } from 'neverthrow';
import { headers } from 'next/dist/client/components/headers.js';

export const BACKEND_URL = 'http://127.0.0.1:3001/rpc';

//TODO figure out module resolution issues I'm having, fallback plan is switch to whatever next is set to use by default
export const getUser: getUserFunctionSignature = (payload: TGetUserPayload) => {
  return createRequest<TGetUserPayload, TUser>('getUser', payload, BACKEND_URL).andThen<TUser, IApiError>(
    (response) => {
      console.log('response');
      console.log(response);
      return okAsync(response.data);
    }
  );
};

export default async function Home() {
  const headersFromClient = headers();
  const user = (await getUser({ id: 5, cheese: 'cheese' })).match(
    (data) => {
      return (
        <>
          <p>{data.email}</p>
          <p>
            {data.firstName} {data.lastName}
          </p>
        </>
      );
    },
    (error) => {
      return <>{error.error}</>;
    }
  );

  return <main className="flex min-h-screen flex-col items-center justify-between p-24">{user}</main>;
}
