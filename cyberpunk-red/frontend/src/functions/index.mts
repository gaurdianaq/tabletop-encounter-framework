import { BACKEND_URL } from '../constants.mjs';
import { getUserFunctionSignature, TGetUserPayload, TUser } from 'beyond-cyberpunk-red-schema';
import { okAsync } from 'neverthrow';
import { createRequest, IApiError } from 'neverthrow-rpc';

export const getUser: getUserFunctionSignature = (payload: TGetUserPayload) => {
  return createRequest<TGetUserPayload, TUser>('getUser', payload, BACKEND_URL).andThen<TUser, IApiError>(
    (response) => {
      return okAsync(response.data);
    }
  );
};
