import { describe, it, beforeEach, afterEach } from "mocha";
const supertest = require("supertest");

describe("GET /", function() {
  let server;
  beforeEach(function () {
    server = require('../src/server');
  });
  afterEach(function () {
    server.close();
  });
  it("it should has status code 200", function(done) {
    supertest(server)
      .get("/")
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });
  it("it shoud has response with hope key with value of loop", function(done){
    supertest(server)
      .get("/")
      .expect({ message: "Hello World !" })
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });
});

describe("POST /", function(){
  let server;
  beforeEach(function () {
    server = require('../src/server');
  });
  afterEach(function () {
    server.close();
  });
  it("it shoud return status code 200 is name exists", function(done) {
    supertest(server)
      .post("/")
      .send({ name: "Hope" })
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });
  it("it shoud return status code 400 if no name", function(done) {
    supertest(server)
      .post("/")
      .expect(400)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });
  it("it shoud return status code 200 and hook", function(done) {
    supertest(server)
      .post("/iot/hook")
      .send({response: "hook working !"})
      .expect(200)
      .end(function(err, res){
        if (err) done(err);
        done();
      });
  });
});
