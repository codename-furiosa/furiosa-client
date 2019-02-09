const routes = require('next-routes')();

routes.add('/auth/login', '/auth/login');
routes.add('/auth/logout', '/auth/logout');
routes.add('/auth/user', '/auth/user');
routes.add('/campaigns/new', '/campaigns/new');
routes.add('/campaigns/:address', '/campaigns/show');
routes.add('/campaigns/:address/contracts/new', '/campaigns/contracts/new');
routes.add('/freelancers', '/freelancers/index');
routes.add('/freelancers/new', '/freelancers/new');
routes.add('/freelancers/:address', '/freelancers/show');

module.exports = routes;
