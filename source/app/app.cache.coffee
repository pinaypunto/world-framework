App.Cache = do ->

  _cache     = null
  _article   = null
  _articles  = {}
  _asides    = {}

  set = (app) ->
    _cache = app
    do _cacheCommons

  get =  ->
    return _cache

  setArticle = (instance) ->
    _article = instance

  addArticle = (instance) ->
    _articles[instance.attributes.id] = instance

  _cacheCommons = ->
    for component in _cache when component.constructor.type is "Article"
      _articles[component.attributes.id] = component
    for component in _cache when component.constructor.type is "Aside"
      _asides[component.attributes.id] = component


  set         : set
  get         : get
  setArticle  : setArticle
  articles    : -> _articles
  article     : -> _article
  asides      : -> _asides
