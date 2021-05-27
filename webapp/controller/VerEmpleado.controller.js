sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		function onInit() {
            this._model = new sap.ui.model.json.JSONModel({});
            this.getView().setModel(this._model);
            
            var rutaFilter = "path:'employeeModel>/Users',filters:[{path:'SapId',operator:'EQ',value1:'" + 
                              this.getOwnerComponent().SapId + "'}]";

            this._model.setData({
                sapId : this.getOwnerComponent().SapId,             
                pathList: rutaFilter      
            });           
        };
        function onPressVolver() {
            //Regresar al menú principal
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMenu",{},true);            
        };
        function onBuscarEmpleado() {
            
        };
        function onBajaEmpleado() {
            
        };
        function onAscenderEmpleado() {
            
        };
              
        var Main = Controller.extend("logaligroup.Empleados.controller.VerEmpleado", { });
        
        Main.prototype.onInit = onInit;
        Main.prototype.onPressVolver = onPressVolver;
        Main.prototype.onBuscarEmpleado = onBuscarEmpleado;
        Main.prototype.onBajaEmpleado = onBajaEmpleado;
        Main.prototype.onAscenderEmpleado = onAscenderEmpleado;

		return Main;
	});