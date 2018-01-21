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
var user = {
  nick: 'u1',
  name: 'nu1',
  email: 'u1@example.com',
  password: 'u1',
  active: true
}
var newName = 'nu2'

suite('register-update suite tests ', function() {
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
      .send(user)
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

  test('auth/update_user test', function(done) {
    agent
      .post('/auth/update_user')
      .set('Cookie', ['seneca-login=' + cookie])
      .send({ nick: user.nick, name: newName })
      .expect(200)
      .end(function(err, res) {
        Util.log(res)
        Assert(res.body.ok)
        Assert(res.body.user, 'No user in response')
        Assert(res.body.user.name, newName, 'New name is not correct')
        done(err)
      })
  })

  test('auth/user after update-user', function(done) {
    agent
      .get('/auth/user')
      .set('Cookie', ['seneca-login=' + cookie])
      .expect(200)
      .end(function(err, res) {
        Util.log(res)
        Assert(res.body.ok, 'Not OK')
        Assert(res.body.user, 'No user in response')
        Assert(res.body.login, 'No login in response')
        Assert(res.body.user.name, newName, 'New name is not correct')
        done(err)
      })
  })
})
