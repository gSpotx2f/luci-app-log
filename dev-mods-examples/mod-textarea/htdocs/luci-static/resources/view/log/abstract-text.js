'use strict';
'require fs';
'require ui';
'require view.log.abstract-log as abc';

return L.Class.extend({
	view: abc.view.extend({
		rowsDefault: 20,

		//regexpFilterHighlightFunc: null,
		regexpFilterHighlightFunc: function(match) {
			return `►${match}◄`;
		},

		padNumber: function(number, length) {
			try {
				number = String(number).padStart(length, ' ');
			} catch(e) {
				if(e.name != 'TypeError') {
					throw e;
				};
			};
			return number;
		},

		makeLogArea: function(logdataArray) {
			let lines = _('No entries available...');
			let logTextarea = E('textarea', {
				'id': 'syslog',
				'class': 'cbi-input-textarea',
				'style': 'width:100% !important; margin-bottom:1em; resize:horizontal; font-size:12px; font-family:monospace !important',
				'readonly': 'readonly',
				'wrap': 'off',
				'rows': this.rowsDefault,
				'spellcheck': 'false',
			});

			for(let level of Object.keys(this.logLevels)) {
				this.logLevelsStat[level] = 0;
			};

			let logdataArrayLen = logdataArray.length;

			if(logdataArrayLen > 0) {
				lines = [];
				logdataArray.forEach((e, i) => {
					if(e[3] in this.logLevels) {
						this.logLevelsStat[e[3]] = this.logLevelsStat[e[3]] + 1;
					};

					e[0] = this.padNumber(e[0], String(logdataArray[logdataArrayLen - 1][0]).length);
					e[5] = '\t' + e[5];
					lines.push(e.filter(e => (e)).join(' '));
				});
				lines = lines.join('\n');
			};

			logTextarea.value = lines;
			logTextarea.rows = (logdataArrayLen < this.rowsDefault) ? this.rowsDefault : logdataArrayLen;

			let levelsStatString = '';
			if((Object.values(this.logLevelsStat).reduce((s,c) => s + c, 0)) > 0) {
				Object.entries(this.logLevelsStat).forEach(e => {
					if(e[0] in this.logLevels && e[1] > 0) {
						levelsStatString += `<span class="log-entries-count-level log-${e[0]}" title="${e[0]}">${e[1]}</span>`;
					};
				});
			};

			return E([
				E('div', { 'class': 'log-entries-count' },
					`${_('Entries')}: ${logdataArrayLen} / ${this.totalLogLines}${levelsStatString}`
				),
				logTextarea,
			]);
		},
	}),
});
