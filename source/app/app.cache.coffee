App.Cache = do ->

  _article = null
  _cache =
    articles  : {}
    asides    : {}

  init = (app) ->
    _cacheCommons app

  setArticle = (instance) ->
    _article = instance

  _cacheCommons = (app) ->
    for component in app when component.constructor.type in ["Article", "Aside"]
      node_name = component.constructor.type.toLowerCase()
      _cache[node_name] = _cache[node_name] or {}
      _cache[node_name][component.attributes.id] = component


  init        : init
  setArticle  : setArticle
  articles    : -> _cache.article
  asides      : -> _cache.aside
  article     : -> _article
