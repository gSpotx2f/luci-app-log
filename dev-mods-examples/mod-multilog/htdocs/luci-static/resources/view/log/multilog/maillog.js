'use strict';
'require view.log.multilog.abstract-multilog as abc';

return abc.view.extend({
	viewName: 'multilog-maillog',
	title: _('Log') + ' - ' + _('maillog'),
	logFile: '/var/log/maillog',
});
