'use strict'

controllers = null

describe 'Controllers provider', ->

  beforeEach ->
    mockery.enable
      warnOnUnregistered: false
      useCleanCache: true

    controllers = require '../../../lib/controllers'

  afterEach mockery.disable

  it 'should return list of configured controllers', ->
    expect(controllers).to.have.keys ['products', 'users', 'roles']

  it 'should return list of replaced blueprint actions', ->
    expect(controllers).to.have.property '_replaced'

  describe 'controller object', ->
    it 'should contain blueprint methods with custom methods', ->
      expect(controllers.users).to.have.keys [
        'find', 'findAll', 'create', 'update', 'destroy',
        'listAvatarImages', 'addAvatarImage'
      ]
    it 'blueprint overwritten actions should call user custom action', ->
      expect(controllers.users.find.fn).to.be.a 'function'
      expect(controllers.users.find.route).to.eql /^\/([\w\.]+@[\w\.]+)$/i
    it 'actions altered by configuration should be correctly registered', ->
      expect(controllers.users.addAvatarImage.methods).to.eql ['post']
      expect(controllers.users.addAvatarImage.route).to.equal '/add-image'

  describe 'replaced actions', ->
    it 'should contain reference to blueprint routes with custom method attached', ->
      expect(controllers._replaced.users.find.fn).to.be.a 'function'
      expect(controllers._replaced.users.find.route).to.eql /^\/(\d+)$/


