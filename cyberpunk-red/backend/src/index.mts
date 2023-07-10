// ESM
import { GetUserPayloadSchema, TGetUserPayload, TUser, getUserFunctionSignature } from 'beyond-cyberpunk-red-schema';
import Fastify from 'fastify';
import { errAsync, okAsync } from 'neverthrow';
import { parseZodResult, validateRequestBody } from 'neverthrow-rpc';
const fastify = Fastify({
  logger: true,
});

const getUser: getUserFunctionSignature = (payload: TGetUserPayload) => {
  return okAsync({ email: 'cooldude@cool.cool', firstName: 'Cool', lastName: 'Dude', id: 5 } as TUser);
};

fastify.post('/rpc', async (request, reply) => {
  return validateRequestBody(request.body as string)
    .asyncAndThen<TUser, unknown>((result) => {
      if (result.funcName === 'getUser') {
        //TODO move parseZodResult into the getUser call
        return parseZodResult(GetUserPayloadSchema, result.payload).asyncAndThen((payload) => {
          return getUser(payload);
        });
      }
      return errAsync('No matching function was found');
    })
    .match<{ data: TUser } | { error: unknown }>(
      (user) => {
        return { data: user };
      },
      (error) => {
        return { error: error };
      }
    );
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    //TODO assign port and URL and other things via config
    await fastify.listen({ port: 3001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
