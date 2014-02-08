class App.Template.Article extends Atomic.Template

  @autorender   : false
  @type         : "Article"
  @template     : """
    <article id="{{id}}" class="{{class}}"></article>
  """

  # ========================================
  # Router Animation FUnctions
  # ========================================
  @_animations_in_progress = 0

  @_startRouterAnimation = (element, animation, direction) =>
    element.addClass("active").attr "data-animation", animation
    element.attr "data-direction", direction

  @_onAnimationEnd = (ev = event) =>
    el = $$ ev.target
    el.unbind "webkitAnimationEnd", @_onAnimationEnd
    if el.attr("data-direction") in ["out", "back-out"] then el.removeClass("active")
    else
      article = App.Cache.articles()[el.attr("id")]
      if article.aside then App.Cache.asides()[article.aside].el.addClass("active")

    el.removeAttr("data-direction").removeAttr("data-animation")
    setTimeout (=> @_animations_in_progress--), 50

  @_isAnimating = =>
    @_animations_in_progress > 0


  # ========================================
  # Aside Transition Functions
  # ========================================
  @_swiped_px = 0
  @_aside_open = false
  @_aside_transforming = false

  @_bindToSwipe = (article) =>
    article.bind "swipingHorizontal", @_onSwiping
    article.bind "touchend", @_onSwipingEnd

  @_onTransitionEnd = (ev = event) =>
    target = $$(ev.target).closest "article"
    target.unbind("webkitTransitionEnd", @_onTransitionEnd)
    if target.hasClass("aside") and !target.attr("data-aside")
      target.removeClass("aside")
    @_aside_transforming = false

  @_onSwiping = (ev=event) =>
    delta = ev.quoData.delta.x
    if delta >= 0
      @_swiped_px = delta
      ev.originalEvent.preventDefault()
      article = $$(ev.target).closest("article")
      article.style "webkitTransform", "translateX(#{delta}px)"
    else @_swiped_px = 0

  @_onSwipingEnd = (ev=event) =>
    article = $$(ev.target).closest("article")
    if (!@_aside_open and @_swiped_px > 100) or @_aside_open
      App.Cache.article().toggleAside()
    else if @_swiped_px > 0
      article.bind("webkitTransitionEnd", @_onTransitionEnd)
      article.addClass("aside")
    article.removeAttr("style")
    @_swiped_px = 0



  # ========================================
  # Instance methods
  # ========================================
  constructor: (attributes, children, options) ->
    super
    if options
      @animation = options.animation
      @aside = options.aside

  show: (is_back = false) ->
    if not @el or @el.length is 0
      @render(@container, true)
      if @aside then @constructor._bindToSwipe @el
      setTimeout (=> @_show(is_back))
    else @_show(is_back)

  _show: (is_back) =>
    current = App.Cache.article()
    App.Cache.setArticle @
    @el.addClass("active")
    App.Cache.asides()[@aside].deactivate() if @aside
    App.Cache.asides()[current.aside].deactivate() if current?.aside
    unless current
      if @aside then App.Cache.asides()[@aside].activate()
      return

    @constructor._animations_in_progress += 2
    current.el.bind "webkitAnimationEnd", @constructor._onAnimationEnd
    @el.bind "webkitAnimationEnd", @constructor._onAnimationEnd
    if is_back
      @constructor._startRouterAnimation(@el, current.animation, "back-in")
      @constructor._startRouterAnimation(current.el, current.animation, "back-out")
    else
      @constructor._startRouterAnimation(@el, @animation, "in")
      @constructor._startRouterAnimation(current.el, @animation, "out")

  section: (id) ->
    sections = @el.children("section")
    sections.removeClass("active").filter("##{id}").addClass("active")
    if @constructor._aside_open
      @toggleAside()

  toggleAside: ->
    return false if @constructor._aside_transforming is true
    @constructor._aside_transforming = true
    App.Cache.asides()[@aside].el.addClass("active")
    @el.bind "webkitTransitionEnd", @constructor._onTransitionEnd
    if @el.attr("data-aside")
      @constructor._aside_open = false
      @el.addClass("aside").removeAttr("data-aside")
    else
      @constructor._aside_open = true
      @el.addClass("aside").attr("data-aside", "show")



