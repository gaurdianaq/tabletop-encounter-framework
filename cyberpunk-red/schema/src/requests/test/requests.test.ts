import { expect } from "chai";

describe("createRequest", function () {
  context("when making a successful call with a valid response", function () {
    it("hi", function () {
      expect(5).to.equal(5);
    });
  });
  context("when making a successful call with an error response", function () {
    it("bye");
  });
});
