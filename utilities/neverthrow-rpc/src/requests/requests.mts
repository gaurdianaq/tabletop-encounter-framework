import { z } from "zod";
import { okAsync, errAsync, ResultAsync, Result, ok, err } from "neverthrow";
import { safeJSONParse } from "../base.mjs";

export interface IApiError {
  statusCode: number;
  error: unknown;
}

export interface IApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface IRequest<T> {
  funcName: string;
  payload?: T;
}

//TODO test response on funcName not being passed
//TODO test result on body being undefined
//TODO test result on JSON.parse failing
/**
 * Takes request body, ensures that it provides a funcName and returns it as IRequest<unknown>
 * The intention is that this will then be passed to a function that will validate the actual payload using Zod
 * @param body
 * @returns IRequest<unknown>
 */
export const validateRequestBody = (
  body: string
): Result<IRequest<unknown>, IApiError> => {
  return safeJSONParse(body)
    .mapErr((error) => {
      return {
        statusCode: 400,
        error: "Could not parse body, body must be valid json",
      } as IApiError;
    })
    .andThen((result: unknown) => {
      if (typeof result === "object" && result !== null) {
        if ("funcName" in result) {
          return ok(result as IRequest<unknown>);
        }
        return err({
          statusCode: 400,
          error: "funcName not provided, rejecting",
        } as IApiError);
      }
      return err({
        statusCode: 400,
        error: "request body must be of type object",
      } as IApiError);
    });
};

//TODO simulate and test fetch rejecting
//TODO simulate and test the endpoint not returning json
//TODO test data and error parsing
export const createRequest = <TPayload, TReturn>(
  funcName: string,
  payload: TPayload,
  backendURL: string
): ResultAsync<IApiResponse<TReturn>, IApiError> => {
  return ResultAsync.fromPromise(
    fetch(backendURL, {
      method: "POST",
      body: JSON.stringify({ funcName, payload }),
    }),
    (error) => {
      return {
        statusCode: 500,
        error,
      };
    }
  ).andThen((response) => {
    return ResultAsync.fromPromise<IApiResponse<TReturn>, IApiError>(
      response.json(),
      (error) => {
        return {
          statusCode: 500,
          error: error,
        };
      }
    ).andThen<IApiResponse<TReturn>, IApiError>(
      (
        json: IApiResponse<TReturn> | IApiError
      ): ResultAsync<IApiResponse<TReturn>, IApiError> => {
        if ("data" in json) {
          return okAsync({ statusCode: response.status, data: json.data });
        } else if ("error" in json) {
          return errAsync({ statusCode: response.status, error: json.error });
        }
        return errAsync({
          statusCode: 500,
          error:
            "Invalid response received from server, must return json object with data or error key",
        });
      }
    );
  });
};
