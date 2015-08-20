'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/trowel',
  assets: {
    lib: {
      css: [
      ],
      js: [
        // 'public/lib/angular/angular.min.js',
        // 'public/lib/angular-resource/angular-resource.js', 
        // 'public/lib/angular-animate/angular-animate.js', 
        // 'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        // 'public/lib/angular-ui-utils/ui-utils.min.js',
        // 'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'
      ]
    },
    css: 'public/dist/style.min.css',
    js: 'public/dist/application.min.js'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  }
};