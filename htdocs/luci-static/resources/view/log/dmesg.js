'use strict';
'require fs';
'require ui';
'require view.log.abstract-log as abc';

return abc.view.extend({
	viewName: 'dmesg',

	title: _('Kernel Log'),

	logFacilities: [
		'kern',
		'user',
		'mail',
		'daemon',
		'auth',
		'syslog',
		'lpr',
		'news',
	],

	getLogData: function(tail) {
		return fs.exec_direct('/bin/dmesg', [ '-r' ]).catch(err => {
			ui.addNotification(null, E('p', {}, _('Unable to load log data:') + ' ' + err.message));
			return '';
		});
	},

	parseLogData: function(logdata, tail) {
		if(!logdata) {
			return [];
		};
		this.isLevels = true;

		let strings = logdata.trim().split(/\n/).map(line => line.replace(/^<(\d+)>/, '$1'));

		if(tail && tail > 0 && strings) {
			strings = strings.slice(-tail);
		};

		this.totalLogLines = strings.length;

		let entriesArray = strings.map((e, i) => {
			let strArray = e.split(/[\]\[]/);

			let logLevelsTranslate = Object.keys(this.logLevels);

			let level = 0;
			let facility = 0;
			if(strArray[0].length > 1) {
				let fieldArray = Number(strArray[0]).toString(8).split('');
				level = logLevelsTranslate[Number(fieldArray[1])];
				facility = Number(fieldArray[0]);
			} else {
				level = logLevelsTranslate[Number(strArray[0]).toString(8)];
			};

			return [
				i + 1,													// #			(Number)
				strArray[1].trim(),										// Timestamp	(String)
				null,													// Host			(String)
				level,													// Level		(String)
				this.logFacilities[facility],							// Facility		(String)
				this.htmlEntities(strArray.slice(2).join(' ').trim()),	// Message		(String)
			];
		});

		if(this.logSortingValue === 'desc') {
			entriesArray.reverse();
		};

		return entriesArray;
	},
});
