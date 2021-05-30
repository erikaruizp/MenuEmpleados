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
        function onAfterRendering(){
            // Error en el framework : Al agregar la dirección URL de "Firmar pedidos", el componente GenericTile debería navegar directamente a dicha URL,
            // pero no funciona en la version 1.78. Por tanto, una solución  encontrada es eliminando la propiedad id del componente por jquery
            var genericTileFirmarPedido = this.byId("linkFirmarPedido");
            //Id del dom
            var idGenericTileFirmarPedido = genericTileFirmarPedido.getId();
            //Se vacia el id
            jQuery("#"+idGenericTileFirmarPedido)[0].id = "";
        };       
              
        var Main = Controller.extend("logaligroup.Empleados.controller.Menu", { });
        
        Main.prototype.onInit = onInit;
        Main.prototype.onMenuCrearEmpleado = onMenuCrearEmpleado;
        Main.prototype.onMenuVerEmpleado = onMenuVerEmpleado;
        Main.prototype.onAfterRendering = onAfterRendering;

		return Main;
	});