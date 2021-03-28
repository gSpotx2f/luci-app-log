
module('luci.controller.log', package.seeall)

function index()
	entry({'admin', 'services', 'syslog'}, view('log/syslog'), _('System Log'), 20).acl_depends = { 'luci-app-log' }
	entry({'admin', 'services', 'dmesg'}, view('log/dmesg'), _('Kernel Log'), 21).acl_depends = { 'luci-app-log' }
end
