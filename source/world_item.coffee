class WorldCore.Item

  ###*
   * [constructor description]
   * @param  {[type]} @attributes={}
   * @param  {[type]} @childs=[]
   * @return {[type]}
  ###
  constructor: (@attributes={}, @childs=[]) ->
    @uid = guid()
    @namespace = @constructor.name
    if @template        then do @__createElement__
    if @events and @el  then do @__bindEvents__
    if @listenFor       then do @__listenEvents__
    if @childs.length   then do @__setChildsCreator__

  ###*
   * [setAttributes description]
   * @param {[type]} @attributes
  ###
  setAttributes: (@attributes) ->
    do @__createElement__
    if @events and @el then do @__bindEvents__

  ###*
   * [appendChilds description]
   * @param  {[type]} childs
   * @return {[type]}
  ###
  appendChilds: (childs) ->
    child.__setSuper__(@) for child in childs
    @childs = @childs.concat childs

  ###*
   * [bubble description]
   * @param  {[type]} event
   * @param  {[type]} data={}
   * @param  {[type]} namespace=@namespace
   * @return {[type]}
  ###
  bubble: (event, data={}, namespace=@namespace) ->
    data.caller = data.caller or @
    if @superClass
      WorldCore.Events.inform @superClass.uid, "#{namespace}:#{event}", data
      @superClass.bubble event, data, namespace

  ###*
   * [tunnel description]
   * @param  {[type]} event
   * @param  {[type]} data={}
   * @param  {[type]} namespace=@namespace
   * @return {[type]}
  ###
  tunnel: (event, data={}, namespace=@namespace) ->
    data.caller = data.caller or @
    if @childs.length
      for child in @childs
        WorldCore.Events.inform(child.uid, "#{namespace}:#{event}", data)
        child.tunnel event, data, namespace

  ###*
   * [listen description]
   * @param  {[type]}   eventName
   * @param  {Function} callback
   * @return {[type]}
  ###
  listen: (eventName, callback) ->
    WorldCore.Events.listen @uid, eventName, callback

  ###*
   * [render description]
   * @param  {[type]} container
   * @return {[type]}
  ###
  render: (container) ->
    @container = @container or container
    @container.append @el
    if @childs.length > 0
      childs_container = do @__getChildsContainer__
      child.render(childs_container) for child in @childs


  # Private methods
  __getChildsContainer__: ->
    childs_container = @el.find("[data-childs-container]")
    return if childs_container.length is 0 then @el else childs_container

  __listenEvents__: ->
    @listen(event, @[callback]) for event, callback of @listenFor

  __setChildsCreator__: ->
    child.__setSuper__(@) for child in @childs

  __createElement__: ->
    @el = $$ WorldCore.templayed(@template)(@attributes)

  __setSuper__: (klass) ->
    @superClass = klass

  __bindEvents__: ->
    for evt, callback of @events
      parts = evt.split(" ")
      htmlEl = if parts.length is 1 then @el else @el.find(parts.slice(1).join(" "))
      htmlEl.on evt, @[callback]


guid = ->
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g, (c) ->
    r = Math.random() * 16 | 0
    v = if c is 'x' then r else r & 3 | 8
    v.toString 16
  .toUpperCase()
