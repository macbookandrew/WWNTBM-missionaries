module.exports = function (grunt) {
  grunt.initConfig({
    // Watch task config
    watch: {
        javascript: {
            files: ["js/*.js", "!js/*.min.js"],
            tasks: ['uglify'],
        },
    },
    uglify: {
        custom: {
            files: {
                'js/initializeMap.min.js': ['js/initializeMap.js', 'js/marker-clusterer.js'],
                'js/backend.min.js': ['js/backend.js'],
            },
        },
    },
    browserSync: {
        dev: {
            bsFiles: {
                src : ['**/*.css', '**/*.php', '**/*.js', '!node_modules'],
            },
            options: {
                watchTask: true,
                proxy: "http://wwntbm.wordpress.dev",
            },
        },
    },
  });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.registerTask('default', [
        'browserSync',
        'watch',
    ]);
};
