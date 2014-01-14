module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    meta:
      bower   : 'bower',
      banner  : '/* <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy/m/d") %>\n' +
              '   <%= pkg.homepage %>\n' +
              '   Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
              ' - Licensed <%= _.pluck(pkg.license, "type").join(", ") %> */\n'

    source:
      core    : [
        'source/helpers/*.coffee'
        'source/*.coffee'
      ]
      test    : [
        'test/test.*.coffee'
        'test/app.coffee'
      ]

    coffee:
      options: concat: true
      core  : files: '<%=meta.bower%>/<%=pkg.name%>.debug.core.js' : '<%=source.core%>'
      test  : files: '<%=meta.bower%>/<%=pkg.name%>.debug.test.js' : '<%=source.test%>'

    uglify:
      core:
        options: mangle: true
        files: '<%=meta.bower%>/<%=pkg.name%>.core.js': '<%=meta.bower%>/<%=pkg.name%>.debug.core.js'
      test:
        options: mangle: true
        files: '<%=meta.bower%>/<%=pkg.name%>.test.js': '<%=meta.bower%>/<%=pkg.name%>.debug.test.js'

    watch:
      core:
        files: ['<%= source.core %>']
        tasks: ['coffee:core', 'uglify:core']
      test:
        files: ['<%= source.test %>']
        tasks: ['coffee:test', 'uglify:test']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-watch'


  grunt.registerTask 'default', ['coffee', 'uglify']
