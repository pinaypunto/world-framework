App.Router = do ->

  _routes = null

  init = (article_id) ->
    _routes = []
    article(article_id)

  article = (id, is_back = false) ->
    unless App.Template.Article._isAnimating()
      instance = App.Cache.articles()[id]
      instance.show(is_back)
      if is_back then _routes.length--
      else _routes.push(id)

  section = (id) ->
    App.Cache.article().section(id)

  aside = () ->
    App.Cache.article().toggleAside()

  back = ->
    len = _routes.length
    if len <= 1 then return false
    article _routes[len - 2], true


  init        : init
  article     : article
  section     : section
  back        : back
  aside       : aside
