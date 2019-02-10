const withCSS = require('@zeit/next-css');

module.exports = withCSS({
    /*
    The below config is a workaround for the issue reported here:
        https://github.com/zeit/next.js/issues/5478
        https://github.com/zeit/next.js/issues/5598
        https://github.com/zeit/next.js/pull/5994

    Update to Nextjs 8 should fix it when it's released
    */
    onDemandEntries: {
        // period (in ms) where the server will keep pages in the buffer
        maxInactiveAge: 25 * 1000,
        // number of pages that should be kept simultaneously without being disposed
        pagesBufferLength: 5
    },
    publicRuntimeConfig: {
        API_URI: process.env.API_URI,
        BOT_URI: process.env.BOT_URI
    }
});
