'use strict';
'require view.log.multilog.abstract-multilog as abc';

return abc.view.extend({
	viewName: 'multilog-secure',
	title   : _('Log') + ' - ' + _('secure'),
	logFile : '/var/log/secure',
});
