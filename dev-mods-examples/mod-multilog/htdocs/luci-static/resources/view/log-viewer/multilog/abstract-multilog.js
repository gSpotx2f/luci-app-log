'use strict';
'require baseclass';
'require fs';
'require ui';
'require view.log-viewer.log-widget as abc';

return baseclass.extend({
	view: abc.view.extend({
		testRegexp     : new RegExp(/([0-9]{2}:){2}[0-9]{2}/),

		logdRegexp     : new RegExp(/^([^\s]{3}\s+[^\s]{3}\s+\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2}\s+\d{4})\s+([a-z0-9]+)\.([a-z]+)\s+(.*)$/),

		syslog_ngRegexp: new RegExp(/^([^\s]{3}\s+\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2})\s+([^\s]+)\s+(.*)$/),

		entryRegexp    : null,

		isLoggerChecked: false,

		entriesHandler : null,

		logFile        : null,

		getLogHash() {
			return fs.stat(this.logFile).then((data) => {
				return data || '';
			}).catch(e => {});
		},

		// logd
		logdHandler(strArray, lineNum) {
			return [
				lineNum,                               // #         (Number)
				strArray[1],                           // Timestamp (String)
				null,                                  // Host      (String)
				strArray[2],                           // Facility  (String)
				strArray[3],                           // Level     (String)
				this.htmlEntities(strArray[4]) || ' ', // Message   (String)
			];
		},

		// syslog-ng
		syslog_ngHandler(strArray, lineNum) {
			if(!(strArray[2] in this.logHosts)) {
				this.logHosts[strArray[2]] = this.makeLogHostsDropdownItem(strArray[2]);
			};
			return [
				lineNum,                               // #         (Number)
				strArray[1],                           // Timestamp (String)
				strArray[2],                           // Host      (String)
				null,                                  // Facility  (String)
				null,                                  // Level     (String)
				this.htmlEntities(strArray[3]) || ' ', // Message   (String)
			];
		},

		getLogData(tail) {
			return L.resolveDefault(fs.read_direct(this.logFile, 'text'), '');
		},

		parseLogData(logdata, tail) {
			if(!logdata) {
				return [];
			};

			let unsupportedLog = false;
			let strings        = logdata.trim().split(/\n/);

			if(tail && tail > 0 && strings) {
				strings = strings.slice(-tail);
			};

			this.totalLogLines = strings.length;

			let entriesArray   = strings.map((e, i) => {
				if(!this.isLoggerChecked) {
					if(this.logdRegexp.test(e)) {
						this.entryRegexp    = this.logdRegexp;
						this.isFacilities   = true;
						this.isLevels       = true;
						this.logHosts       = {};
						this.entriesHandler = this.logdHandler;
					}
					else if(this.syslog_ngRegexp.test(e)) {
						this.entryRegexp    = this.syslog_ngRegexp;
						this.isHosts        = true;
						this.logFacilities  = {};
						this.logLevels      = {};
						this.entriesHandler = this.syslog_ngHandler;
					} else {
						unsupportedLog = true;
						return;
					};
					this.isLoggerChecked = true;
				};

				let strArray = e.match(this.entryRegexp);
				if(strArray) {
					return this.entriesHandler(strArray, i + 1);
				} else {
					unsupportedLog = true;
					return;
				};
			});

			if(unsupportedLog) {
				throw new Error(_('Unable to load log data:') + ' ' + _('Unsupported log format'));
			} else {
				if(this.logSortingValue === 'desc') {
					entriesArray.reverse();
				};
				return entriesArray;
			};
		},
	}),
});
