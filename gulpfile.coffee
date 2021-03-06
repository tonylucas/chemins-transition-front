require 'coffee-script/register'

gulp           = require('gulp')
pngquant       = require('imagemin-pngquant');
$              = require('gulp-load-plugins')()
tasks          = ['concat', 'ngAnnotate', 'js-compress', 'compass', 'css-concat', 'css-compress', 'index-dev', 'bower']
productions    = ['concat', 'ngAnnotate', 'js-compress', 'compass', 'css-concat', 'css-compress','bower', 'partials']
angularFile    = ['app/src/js/angular/app.js','app/src/js/angular/**/*.js']
browsers       = ["ie >= 9", "ie_mob >= 10", "ff >= 30", "chrome >= 34", "safari >= 7", "opera >= 23", "ios >= 7", "android >= 4.4", "bb >= 10"]

watch = ->
    gulp.watch angularFile, ['concat', 'ngAnnotate', 'js-compress', 'index-dev']
    gulp.watch 'app/src/scss/*.scss', ['compass', 'css-concat', 'css-compress', 'index-dev']

    gulp.watch 'app/src/images/*.png', ['image']
    gulp.watch 'app/src/images/*.jpg', ['image']
    gulp.watch 'app/src/images/*.gif', ['image']
    gulp.watch 'app/src/partials/**/*.html', ['index-dev']
    gulp.watch 'bower.json', ['bower', 'index-dev']



#js concatenation
gulp.task 'concat', ->
    gulp.src 'app/src/js/angular/**/*.js'
    .pipe $.concat 'main.js' 
    .pipe gulp.dest 'public/javascripts'

gulp.task 'ngAnnotate', ['concat'], ->
    gulp.src 'public/javascripts/main.js'
    .pipe $.ngAnnotate() 
    .pipe gulp.dest 'public/javascripts'

#js compression
gulp.task 'js-compress', ['ngAnnotate'], ->
    gulp.src 'public/javascripts/main.js'
    .pipe $.uglify()
    .pipe $.uglify()
    .pipe gulp.dest 'public/javascripts'
    .pipe $.connect.reload()

#compass
gulp.task 'compass', ->
    #foundation scss
    gulp.src 'bower_components/foundation/scss/*.scss'
        .pipe $.sass
            onError: console.error.bind(console, 'SASS error:')
        .pipe gulp.dest 'bower_components/foundation/css'

    gulp.src 'app/src/scss/*.scss'
        .pipe $.sass
            onError: console.error.bind(console, 'SASS error:')
        .pipe $.autoprefixer
            browsers: browsers 
        .pipe gulp.dest 'app/src/css'
        .pipe $.size()
        
#css concat
gulp.task 'css-concat', ['compass'], ->
    gulp.src 'app/src/css/*.css'
    .pipe $.concat 'main.css' 
    .pipe gulp.dest 'public/stylesheets'

#css compression
gulp.task 'css-compress', ['css-concat'], ->
    gulp.src 'public/stylesheets/main.css'
    .pipe $.minifyCss keepBreaks:true
    .pipe gulp.dest 'public/stylesheets'
    .pipe $.connect.reload()


#bower
gulp.task 'bower', ->
    $.bower({'/bower_components'})
    .pipe gulp.dest 'public/lib'
    .pipe gulp.dest 'app/src/lib'

#image compress
options =
    progressive: true,
    svgoPlugins: [removeViewBox: false],
    use: [pngquant()]

gulp.task 'partials', ->
  gulp.src('app/src/partials/*.html')
  .pipe gulp.dest 'public/partials'

gulp.task 'image', ->
    gulp.src 'app/src/images/*' 
    .pipe $.imagemin options 
    .pipe gulp.dest 'app/images'

gulp.task 'connect', ->
    $.connect.server
        root: 'app'
        livereload: true

gulp.task 'connect-dev', ->
    $.connect.server
        root: 'app/src'
        livereload: true

gulp.task 'html-dev', ->
    gulp.src 'app/src/*.html'
    .pipe $.connect.reload()

gulp.task 'html', ->
    gulp.src 'app/*.html'
    .pipe $.connect.reload()

gulp.task 'index-dev', ->
    gulp.src('app/src/index.html')
    .pipe($.inject(gulp.src(['app/src/js/**/*.js','app/src/css/*.css' ], {read: false}), {relative: true}))
    .pipe gulp.dest 'app/src'
    .pipe $.connect.reload()

gulp.task 'watch', ['connect'], ->
    gulp.watch 'app/*.html', ['html']
    watch()

gulp.task 'watch-dev', ['connect-dev'], ->
    gulp.watch 'app/src/*.html', ['html-dev']
    watch()



gulp.task 'default', productions