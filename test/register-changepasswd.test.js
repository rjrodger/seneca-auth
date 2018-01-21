'use strict'

var Assert = require('assert')
var agent

var Lab = require('lab')
var lab = (exports.lab = Lab.script())
var suite = lab.suite
var test = lab.test
var before = lab.before

var Util = require('./util.js')

var cookie

suite('register-login-logout suite tests ', function() {
  before({}, function(done) {
    Util.init({}, function(err, agentData) {
      Assert.ok(!err)
      agent = agentData

      done()
    })
  })

  test('auth/register test', function(done) {
    agent
      .post('/auth/register')
      .send({
        nick: 'u1',
        name: 'nu1',
        email: 'u1@example.com',
        password: 'u1',
        active: true
      })
      .expect(200)
      .end(function(err, res) {
        Util.log(res)
        Assert(res.body.ok, 'Not OK')
        Assert(res.body.user, 'No user in response')
        Assert(res.body.login, 'No login in response')
        cookie = Util.checkCookie(res)
        done(err)
      })
  })

  test('verify cookie exists after register', function(done) {
    Assert(cookie)
    done()
  })

  test('auth/change_password test', function(done) {
    agent
      .post('/auth/change_password')
      .send({ password: 'uu1', repeat: 'uu1' })
      .set('Cookie', ['seneca-login=' + cookie])
      .expect(200)
      .end(function(err, res) {
        Util.log(res)
        Assert(res.body.ok, 'Not OK')
        Assert(res.body.user, 'No user in response')
        done(err)
      })
  })

  test('auth/logout test', function(done) {
    agent
      .post('/auth/logout')
      .set('Cookie', ['seneca-login=' + cookie])
      .expect(200)
      .end(function(err, res) {
        Util.log(res)
        Assert(res.body.ok)
        done(err)
      })
  })

  test('auth/login with old password test', function(done) {
    agent
      .post('/auth/login')
      .send({ nick: 'u1', password: 'u1' })
      .expect(200)
      .end(function(err, res) {
        Util.log(res)
        Assert(!res.body.ok, 'Not OK')
        done(err)
      })
  })

  test('auth/login test', function(done) {
    agent
      .post('/auth/login')
      .send({ nick: 'u1', password: 'uu1' })
      .expect(200)
      .end(function(err, res) {
        Util.log(res)
        Assert(res.body.ok, 'Not OK')
        Assert(res.body.user, 'No user in response')
        Assert(res.body.login, 'No login in response')
        cookie = Util.checkCookie(res)
        done(err)
      })
  })

  test('verify cookie exists after register', function(done) {
    Assert(cookie)
    done()
  })
})
