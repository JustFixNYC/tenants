'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/trowel',
  app: {
    title: 'JustFix.nyc'
  },
  superuser: {
    phone: process.env.SUPERUSERPHONE,
    pwd: process.env.SUPERUSERPASS
  },
  assets: {
    lib: {
      css: [
        'lib/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.css',
				'public/lib/ui-select/dist/select.min.css',
				'public/lib/cartodb.js/themes/css/cartodb.css',
				'https://api.tiles.mapbox.com/mapbox-gl-js/v0.14.3/mapbox-gl.css',
        'public/dist/vendor.min.css'
      ],
      js: [
        'public/dist/vendor.min.js'
      ]
    },
    css: 'public/dist/style.min.css',
    js: 'public/dist/application.min.js'
  },
  heap: {
    token: process.env.HEAPTOKEN
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
