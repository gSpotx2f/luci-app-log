'require fs';
'require ui';
'require view.log.baselog as baselog';

return baselog.view.extend({
	viewName: 'syslog',

	title: _('System Log'),

	getLogData: function(tail) {
		return Promise.all([
			L.resolveDefault(fs.stat('/sbin/logread'), null),
			L.resolveDefault(fs.stat('/usr/sbin/logread'), null),
		]).then(stat => {
			let logger = (stat[0]) ? stat[0].path : (stat[1]) ? stat[1].path : null;

			if(logger) {
				return fs.exec_direct(logger, [ '-l', tail, '-e', '^' ]).catch(err => {
					ui.addNotification(null, E('p', {}, _('Unable to load log data: ' + err.message)));
					return '';
				});
			};
		});
	},

	parseLogData: function(logdata, tail) {
		if(!logdata) {
			return [];
		};

		let strings = logdata.trim().split(/\n/);
		this.totalLogLines = strings.length;

		let entriesArray = strings.map((e, i) => {
			let strArray = e.split(/\s+/);
			let logLevel = strArray[5].split('.');

			return [
				i + 1,											// #			(Number)
				strArray.slice(0, 5).join(' '),					// Timestamp	(String)
				logLevel[1],									// Level		(String)
				logLevel[0],									// Facility		(String)
				this.htmlEntities(strArray.slice(6).join(' ')),	// Message		(String)
			];
		});

		if(this.logSortingValue === 'desc') {
			entriesArray.reverse();
		};

		return entriesArray;
	},
});
