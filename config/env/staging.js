'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/trowel',
  app: {
    title: '[testing] JustFix.nyc'
  },
  assets: {
    lib: {
      css: [
        'public/dist/bootstrap.min.css',
        'public/dist/bootflat.min.css',
        'public/lib/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.css'
      ],
      js: [
        'public/dist/vendor.min.js'
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
