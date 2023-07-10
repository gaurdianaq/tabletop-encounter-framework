import { buildTestServer } from "./server.mjs";

const testServer = buildTestServer();

//TODO figure out where/why tests are hanging/which promise isn't resolving
export const mochaHooks = {
  async beforeAll() {
    try {
      await testServer.listen({port: 3001});
    } catch (error) {
      process.exit(1);
    }
  },
  async afterAll() {
    await testServer.close();
  },
};
