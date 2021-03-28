module('luci.controller.log', package.seeall)

function index()
	entry({'admin', 'services', 'log'}, firstchild(), _('Log'), 22).acl_depends = { 'luci-app-log' }
	entry({'admin', 'services', 'log', 'messages'}, view('log/multilog/messages'), _('messages'), 10)
	entry({'admin', 'services', 'log', 'secure'}, view('log/multilog/secure'), _('secure'), 20)
	entry({'admin', 'services', 'log', 'maillog'}, view('log/multilog/maillog'), _('maillog'), 30)
	entry({'admin', 'services', 'log', 'cron'}, view('log/multilog/cron'), _('cron'), 40)
	entry({'admin', 'services', 'log', 'boot'}, view('log/multilog/boot'), _('boot'), 50)
	entry({'admin', 'services', 'log', 'dmesg'}, view('log/dmesg'), _('kernel'), 60)
end
