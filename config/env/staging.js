'use strict';

module.exports = {
  db: process.env.MONGOLAB_URI,
  app: {
    title: 'JustFix.nyc',
    description: 'JustFix.nyc is a tool for New Yorkers to document, organize, and take action in getting repairs made on your apartment.',
    keywords: 'something'
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