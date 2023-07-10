import Fastify from "fastify";

export const buildTestServer = () => {
  const fastify = Fastify({
    logger: false,
  });

  //Always returns a valid success response
  fastify.post("/validresponsesuccess", (request, reply) => {
    reply.code(200).send({ data: "somedata" });
  });

  //Always returns a valid error response
  fastify.post("/validresponseerror", (request, reply) => {
    reply.code(400).send({ error: "someerror" });
  });

  //Always returns an invalid response
  fastify.post("/invalidresponse", (request, reply) => {
    reply.code(400).send({ whatisthis: "whateven?!" });
  });

  fastify.post("/stringresponse", (request, reply) => {
    reply.code(400).send("thisisastring");
  });
  return fastify;
};
