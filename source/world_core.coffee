@WorldCore =

  Events: do ->

    LISTENERS = {}

    listen = (namespace, ev, callback) ->
      LISTENERS[namespace] = LISTENERS[namespace] or {}
      LISTENERS[namespace][ev] = LISTENERS[namespace][ev] or []
      LISTENERS[namespace][ev].push callback

    inform = (namespace, ev, data) ->
      if LISTENERS[namespace] and LISTENERS[namespace][ev]
        listeners = LISTENERS[namespace][ev]
        listener.call(listener, data) for listener in listeners

    listen: listen
    inform: inform
    listeners: -> LISTENERS