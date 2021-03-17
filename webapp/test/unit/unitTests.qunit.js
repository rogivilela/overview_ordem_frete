/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"renovRetailOverviewOrdemFrete./overview_ordem_frete/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
