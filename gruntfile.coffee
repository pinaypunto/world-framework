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
        coffee: [
          'source/core/world.coffee'
          'source/core/world.*.coffee'
        ]
      # Atomic
      atomic:
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
        coffee: [
          'source/app/app.coffee'
          'source/app/app.*.coffee'
          'source/app/atoms/*.coffee'
          'source/app/molecules/*.coffee'
          'source/app/organisms/*.coffee'
          'source/app/templates/*.coffee'
          'source/app/app.*.coffee'
        ]
        icons: [
          'source/app/style/icons/atoms.*.styl'
        ]
        style: [
          # # 'source/app/style_new_old/reset.styl'
          # 'source/app/style_new_old/app.styl'
          # 'source/app/style_new_old/app.*.styl'
          'source/app/style_new/elements.styl'
          'source/app/style_new/element.*.styl'
        ]

        # style: [
        #   'source/app/style/reset.styl'
        #   'source/app/style/app.styl'
        #   'source/app/style/app.*.styl'
        #   'source/app/style/atom.*.styl'
        #   'source/app/style/molecule.*.styl'
        #   'source/app/style/organism.*.styl'
        #   'source/app/style/template.*.styl'
        #   # theme
        #   'source/app/style/theme/app.styl'
        #   'source/app/style/theme/atom.*.styl'
        #   'source/app/style/theme/molecule.*.styl'
        #   'source/app/style/theme/organism.*.styl'
        #   'source/app/style/theme/template.*.styl'
        # ]

      # Contacts example
      contacts:
        coffee: [
          'source/examples/contacts/contacts.coffee'
          'source/examples/contacts/contacts.*.coffee'
        ]


    coffee:
      options: concat: true
      core  : files: '<%=meta.builds%>/<%=pkg.name%>.debug.core.js'    : '<%=source.core.coffee%>'
      atomic: files: '<%=meta.builds%>/<%=pkg.name%>.debug.atomic.js'  : '<%=source.atomic.coffee%>'
      app   : files: '<%=meta.builds%>/<%=pkg.name%>.debug.app.js'     : '<%=source.app.coffee%>'
      contacts: files: '<%=meta.builds%>/<%=pkg.name%>.debug.contacts.js'     : '<%=source.contacts.coffee%>'

    uglify:
      core:
        options: mangle: false
        files: '<%=meta.builds%>/<%=pkg.name%>.core.js': '<%=meta.builds%>/<%=pkg.name%>.debug.core.js'
      atomic:
        options: mangle: false
        files: '<%=meta.builds%>/<%=pkg.name%>.atomic.source.js': '<%=meta.builds%>/<%=pkg.name%>.debug.atomic.js'
      app:
        options: mangle: false
        files: '<%=meta.builds%>/<%=pkg.name%>.app.js': '<%=meta.builds%>/<%=pkg.name%>.debug.app.js'
      contacts:
        options: mangle: false
        files: '<%=meta.builds%>/<%=pkg.name%>.contacts.js': '<%=meta.builds%>/<%=pkg.name%>.debug.contacts.js'

    concat:
      atomic:
        files: '<%=meta.builds%>/<%=pkg.name%>.atomic.js': [
          '<%= source.atomic.components %>',
          '<%=meta.builds%>/<%=pkg.name%>.atomic.source.js'
        ]

    stylus:
      app:
        options: compress: true, import: [ '__init']
        files: '<%=meta.builds%>/<%=pkg.name%>.app.css': '<%=source.app.style%>'
      icons:
        options: compress: true
        files: '<%=meta.builds%>/<%=pkg.name%>.app.icons.css': '<%=source.app.icons%>'

    copy:
      examples:
        files: [{
          expand: true
          flatten: true
          filter: 'isFile'
          src: [
            '<%=meta.builds%>/world.core.js'
            '<%=meta.builds%>/world.atomic.js'
            '<%=meta.builds%>/world.app.js'
            '<%=meta.builds%>/world.contacts.js'
          ]
          dest: 'test/example/js/'
        },{
          expand: true
          flatten: true
          filter: 'isFile'
          src: [
            '<%=meta.builds%>/world.app.css'
            '<%=meta.builds%>/world.app.icons.css'
          ]
          dest: 'test/example/css/'
        }]


    watch:
      core:
        files: ['<%= source.core.coffee %>']
        tasks: ['coffee:core', 'uglify:core']
      atomic:
        files: ['<%= source.atomic.coffee %>']
        tasks: ['coffee:atomic', 'uglify:atomic', 'concat:atomic']
      app:
        files: ['<%= source.app.coffee %>']
        tasks: ['coffee:app', 'uglify:app']
      app_style:
        files: ['<%= source.app.style %>', 'source/app/style_new/__init.styl']
        tasks: ['stylus:app', 'copy']
      app_icons:
        files: ['<%= source.app.icons %>']
        tasks: ['stylus:icons']
      contacts:
        files: ['<%= source.contacts.coffee %>']
        tasks: ['coffee:contacts', 'uglify:contacts', 'copy']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-copy'


  grunt.registerTask 'default', ['coffee', 'uglify', 'concat', 'stylus', 'copy']
