@World.Event = do ->

  _listeners = {}

  listen = (eventName, callback) ->
    _listeners[eventName] = _listeners[eventName] or []
    _listeners[eventName].push callback

  inform = (eventName, data) ->
    return false unless _listeners[namespace]
    listener.call(listener, data) for listener in _listeners[namespace]

  listen: listen
  inform: inform
  listeners: -> _listeners
