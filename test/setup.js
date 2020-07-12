const { expect } = require('chai')
const supertest = require('supertest')


process.env.TEST_DATABASE_URL =
process.env.TEST_DATABASE_URL || "postgresql://jsmglorenzo@localhost/indie-pin-db";

global.expect = expect
global.supertest = supertest