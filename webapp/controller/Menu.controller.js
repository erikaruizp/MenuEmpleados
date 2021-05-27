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
        function onMenuCrearEmpleado(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteCrearEmpleado",{},false);
        };    
        function onMenuVerEmpleado() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteVerEmpleado",{},false);            
        };
              
        var Main = Controller.extend("logaligroup.Empleados.controller.Menu", { });
        
        Main.prototype.onInit = onInit;
        Main.prototype.onMenuCrearEmpleado = onMenuCrearEmpleado;
        Main.prototype.onMenuVerEmpleado = onMenuVerEmpleado;

		return Main;
	});