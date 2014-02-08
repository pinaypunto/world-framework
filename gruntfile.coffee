module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    meta:
      builds  : 'builds',
      banner  : '/* <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy/m/d") %>\n' +
              '   <%= pkg.homepage %>\n' +
              '   Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
              ' - Licensed <%= _.pluck(pkg.license, "type").join(", ") %> */\n'

    source:

      # Core
      core:
        coffee_ns: 'source/core/ns.coffee'
        coffee: [
          'source/core/world.coffee'
          'source/core/world.*.coffee'
        ]

      # Atomic
      atomic:
        coffee_ns: 'source/atomic/ns.coffee'
        coffee: [
          'source/atomic/atomic.coffee'
          'source/atomic/chemistry/base_class.coffee'
          'source/atomic/chemistry/atomic.*.coffee'
          'source/atomic/atomic.*.coffee'
        ]
        components: [
          'source/atomic/components/*.js'
        ]

      # App
      app:
        coffee_ns: 'source/app/ns.coffee'
        coffee: [
          'source/app/app.coffee'
          'source/app/app.*.coffee'
          'source/app/atoms/*.coffee'
          'source/app/molecules/*.coffee'
          'source/app/organisms/*.coffee'
          'source/app/templates/*.coffee'
          'source/app/app.*.coffee'
        ]
        style: [
          'source/app/style/elements.styl'
          'source/app/style/element.*.styl'
        ]
        css: [
          'source/app/style/reset.css'
          'source/app/style/icons.css'
        ]

      # Editor
      editor:
        coffee: [
          'source/app_editor/editor.coffee'
          'source/app_editor/editor.*.coffee'
        ]
        style: [
          'source/app_editor/styles/editor.styl'
          'source/app_editor/styles/editor.*.styl'
        ]

      # Contacts example
      contacts:
        coffee: [
          'source/examples/contacts/contacts.coffee'
          'source/examples/contacts/contacts.*.coffee'
        ]


    # ========================================================================
    # Stylus compilations
    # ========================================================================
    stylus:
      app:
        options: compress: true, import: [ '__init']
        files: '<%= meta.builds %>/<%= pkg.name %>.app.css': '<%= source.app.style %>'
      editor:
        options: compress: true, import: [ '__init']
        files: '<%= meta.builds %>/<%= pkg.name %>.editor.css': '<%= source.editor.style %>'

    # ========================================================================
    # Concats: Prepares all coffees to compile and concats some csss...
    # ========================================================================
    concat:

      core:
        files: '<%= meta.builds %>/<%= pkg.name %>.core.coffee': [
          '<%= source.core.coffee %>'
          '<%= source.core.coffee_ns %>'
        ]

      atomic:
        files: '<%= meta.builds %>/<%= pkg.name %>.atomic.coffee': [
          '<%= source.core.coffee %>'
          '<%= source.atomic.coffee %>'
          '<%= source.atomic.coffee_ns %>'
        ]

      app:
        files: '<%= meta.builds %>/<%= pkg.name %>.app.coffee': [
          '<%= source.core.coffee %>'
          '<%= source.atomic.coffee %>'
          '<%= source.app.coffee %>'
          '<%= source.app.coffee_ns %>'
        ]

      app_styles:
        files:
          '<%= meta.builds %>/<%= pkg.name %>.app.all.css': [
            '<%= source.app.css %>',
            '<%= meta.builds %>/<%= pkg.name %>.app.css'
          ]

    # ========================================================================
    # Compile coffees
    # ========================================================================
    coffee:
      core: files: '<%= meta.builds %>/<%= pkg.name %>.debug.core.js': '<%= meta.builds %>/<%= pkg.name %>.core.coffee'
      atomic: files: '<%= meta.builds %>/<%= pkg.name %>.debug.atomic.js': '<%= meta.builds %>/<%= pkg.name %>.atomic.coffee'
      app: files: '<%= meta.builds %>/<%= pkg.name %>.debug.app.js': '<%= meta.builds %>/<%= pkg.name %>.app.coffee'

    # ========================================================================
    # Then uglify them
    # ========================================================================
    uglify:
      core: files: '<%=meta.builds%>/<%=pkg.name%>.core.js': '<%=meta.builds%>/<%=pkg.name%>.debug.core.js'
      atomic: files: '<%=meta.builds%>/<%=pkg.name%>.atomic.source.js': '<%=meta.builds%>/<%=pkg.name%>.debug.atomic.js'
      app:
        options: mangle: false
        files: '<%=meta.builds%>/<%=pkg.name%>.app.js': '<%=meta.builds%>/<%=pkg.name%>.debug.app.js'
      editor: files: '<%=meta.builds%>/<%=pkg.name%>.editor.js': '<%=meta.builds%>/<%=pkg.name%>.debug.editor.js'
      contacts: files: '<%=meta.builds%>/<%=pkg.name%>.contacts.js': '<%=meta.builds%>/<%=pkg.name%>.debug.contacts.js'

    # ========================================================================
    # Copy some files to test/app...
    # ========================================================================
    copy:
      app_test:
        files: [
          {src: '<%= meta.builds %>/world.app.js', dest: 'test/app/js/app.js'}
          {src: '<%= meta.builds %>/world.app.all.css', dest: 'test/app/css/app.css'}
        ]


    watch:
      core:
        files: ['<%= source.core.coffee %>']
        tasks: ['concat:core', 'concat:atomic', 'concat:app','uglify:core', 'uglify:atomic', 'uglify:app', 'copy']
      atomic:
        files: ['<%= source.atomic.coffee %>']
        tasks: ['concat:atomic', 'concat:app','uglify:atomic', 'uglify:app', 'copy']
      app:
        files: ['<%= source.app.coffee %>']
        tasks: ['concat:app', 'coffee:app', 'uglify:app', 'copy']
      app_style:
        files: ['<%= source.app.style %>', 'source/app/style/__init.styl']
        tasks: ['stylus:app', 'concat:app_styles', 'copy']



  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-copy'


  grunt.registerTask 'default', ['stylus', 'concat', 'coffee', 'uglify', 'copy']

