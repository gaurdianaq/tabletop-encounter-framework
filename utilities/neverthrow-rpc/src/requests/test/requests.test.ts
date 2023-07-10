import { expect } from "chai";
import { createRequest } from "../requests.mjs";
describe("createRequest", function () {
  context("when the server returns a valid response", function () {
    it("should return a result with an ok value if the json object returned has data in the response", async function () {
      const result = await createRequest(
        "someFunc",
        "somePayload",
        "http://127.0.0.1:3001/validresponsesuccess"
      );
      expect(result.isOk()).to.be.true;
      expect(result._unsafeUnwrap().statusCode).to.equal(200);
      expect(result._unsafeUnwrap().data).to.equal("somedata");
    });
    it("should return a result with an err value if the JSON object has error in the response", async function () {
      const result = await createRequest("someFunc", "somePayload", "http://127.0.0.1:3001/validresponseerror");
      expect(result.isErr()).to.be.true;
      expect(result._unsafeUnwrapErr().statusCode).to.equal(400); //Status code will be the one provided by the server;
      expect(result._unsafeUnwrapErr().error).to.equal("someerror");
    });
  });
  context("when server returns an invalid response", function () {
    it(
      "should return a result with an err value if the JSON object has neither data nor error in the response"
      , async function () {
        const result = await createRequest("someFunc", "somePayload", "http://127.0.0.1:3001/invalidresponse");
        expect(result.isErr()).to.be.true;
        expect(result._unsafeUnwrapErr().statusCode).to.equal(500); //Status code will be provided by the createRequest code ignoring the server status code as the shape of the data was wrong
        expect(result._unsafeUnwrapErr().error).to.equal("Invalid response received from server, must return json object with data or error key");
      });
    it(
      "should return a result with an err value if the server does not return JSON"
      , async function () {
        const result = await createRequest("someFunc", "somePayload", "http://127.0.0.1:3001/stringresponse");
        expect(result.isErr()).to.be.true;
        expect(result._unsafeUnwrapErr().statusCode).to.equal(500); //Status code will be provided by the createRequest code ignoring the server status code because JSON was not provided
      });
  });
});
