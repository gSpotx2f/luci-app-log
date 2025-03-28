#
# Copyright (C) 2025 gSpot (https://github.com/gSpotx2f/luci-app-log)
#
# This is free software, licensed under the MIT License.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-log-viewer
PKG_VERSION:=1.2.1
PKG_RELEASE:=1
LUCI_TITLE:=Advanced syslog and kernel log (tail, search, etc)
LUCI_PKGARCH:=all
#LUCI_PKGARCH:=noarch
PKG_LICENSE:=MIT

#include ../../luci.mk
include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
