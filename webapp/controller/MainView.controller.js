sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		function onInit() {

        };
              
        var Main = Controller.extend("logaligroup.Empleados.controller.MainView", { });
        
        Main.prototype.onInit = onInit;

		return Main;
	});
