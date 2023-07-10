import { z } from "zod";
import { ResultAsync } from "neverthrow";
import { IApiError, IdSchema } from "neverthrow-rpc";

export const GetUserPayloadSchema = z.object({
  id: IdSchema,
  cheese: z.string(),
});
export type TGetUserPayload = z.infer<typeof GetUserPayloadSchema>;

export const UserSchema = z.object({
  id: IdSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

export type TUser = z.infer<typeof UserSchema>;

//What if something doesn't need to be async? Like what if only the client call needs to be async but not the server call?
//dumb question I guess, all the server calls should be async, otherwise you're blocking the entire server every time one person makes a call, so having everything be resultasync works well
//would there be any value in having a generic type signature that takes a payload of some type, and returns ResultAsync<T, IApiError>?
//I think the original idea was to have different function signatures take different parameters, but if I'm wrapping everything in a generic payload type then I could just have the one.
//could have it be something like getData = <TPayload, TReturn>(payload: TPayload) => ResultAsync<TReturn, IApiError>
export type getUserFunctionSignature = (
  payload: TGetUserPayload
) => ResultAsync<TUser, IApiError>;
