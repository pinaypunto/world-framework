class World.Item

  ###*
   * [constructor description]
   * @param  {[type]} @attributes={}
   * @param  {[type]} @children=[]
   * @return {[type]}
  ###
  constructor: (@attributes={}, @children=[]) ->
    @uid = guid()
    @namespace = @constructor.name
    @listeners = {}
    child.parent = @ for child in @children

  ###*
   * [appendChild description]
   * @param  {[type]} children
   * @return {[type]}
  ###
  appendChild: (instance) ->
    instance.parent = @
    @children.push instance

  ###*
   * [bubble description]
   * @param  {[type]} event
   * @param  {[type]} data
   * @return {[type]}
  ###
  bubble: (event_name, data = {}, emmiter = @) ->
    if @parent
      result = @parent.trigger(event_name, data, emmiter)
      unless @preventBubbling is true or result is false
        @parent.bubble(event_name, data, emmiter)

  ###*
   * [tunnel description]
   * @param  {[type]} eventName
   * @param  {[type]} data
   * @return {[type]}
  ###
  tunnel: (event_name, data = {}, emmiter = @) ->
    for child in @children
      result = child.trigger(event_name, data)
      unless child.preventTunneling is true or result is false
        child.tunnel(event_name, data, emmiter)

  ###*
   * [listen description]
   * @param  {[type]}   eventName
   * @param  {Function} callback
   * @return {[type]}
  ###
  listen: (eventName, callback) ->
    @listeners[eventName] = @listeners[eventName] or []
    @listeners[eventName].push callback

  ###*
   * [unlisten description]
   * @param  {[type]}   eventName [description]
   * @param  {Function} callback  [description]
   * @return {[type]}             [description]
  ###
  unlisten: (eventName, callback) ->
    return false unless @listeners[eventName]
    index = @listeners[eventName].indexOf(callback)
    if index > -1 then @listeners[eventName].splice(index, 1)

  ###*
   * [trigger description]
   * @param  {[type]} eventName [description]
   * @param  {[type]} data      [description]
   * @return {[type]}           [description]
  ###
  trigger: (eventName, data, emmiter) ->
    if @listeners[eventName] then for callback in @listeners[eventName]
      callback.call(callback, data, emmiter)


guid = ->
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g, (c) ->
    r = Math.random() * 16 | 0
    v = if c is 'x' then r else r & 3 | 8
    v.toString 16
  .toUpperCase()
