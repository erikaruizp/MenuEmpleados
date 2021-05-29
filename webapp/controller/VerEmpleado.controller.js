//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/UploadCollectionParameter",
        "sap/m/MessageBox"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.m.UploadCollectionParameter} UploadCollectionParameter
     * @param {typeof sap.m.MessageBox} MessageBox
     */
	function (Controller,Filter,FilterOperator,UploadCollectionParameter,MessageBox) {
		"use strict";

        function onBeforeRendering(params) {
            var filters = [];
            filters.push(new Filter("SapId",FilterOperator.EQ,this._sapId));

            var oLista = this.getView().byId("listaEmpleado");
            var oBinding = oLista.getBinding("items");
            oBinding.filter(filters);  
        }
		function onInit() {
            this._sapId = this.getOwnerComponent().SapId;
            this._splitApp = this.byId("splitApp");                           
        };
        function onPressVolver() {
            //Regresar al menú principal
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMenu",{},true);            
        };
        function onBuscarEmpleado() {
            var oTexto = this.getView().byId("textoBuscar").getValue();
            var filters = [];
            filters.push(new Filter("SapId",FilterOperator.EQ,this._sapId));

            if (oTexto !== "") {
                filters.push(new Filter("FirstName",FilterOperator.Contains,oTexto));
            }

            var oLista = this.getView().byId("listaEmpleado");
            var oBinding = oLista.getBinding("items");
            oBinding.filter(filters);            
        };
        function onPressEmpleado(oEvent) {
            this._splitApp.to(this.createId("detalleEmpleado"));
            this.employeeId = oEvent.getParameter("listItem").getBindingContext("employeeModel").getProperty("EmployeeId");
            this.byId("detalleEmpleado").bindElement("employeeModel>/Users(EmployeeId='" + this.employeeId +"',SapId='" + this._sapId +"')");            
        };
        function onBeforeUpload(oEvent) {
            let filename = oEvent.getParameter("fileName");
            let parameterSlug = new UploadCollectionParameter({
                name: "slug",
                value: this._sapId + ";" + this.employeeId + ";" + filename
            });
            oEvent.getParameters().addHeaderParameter(parameterSlug);            
        };
        function onFileChange(oEvent) {
            let oUploadCollection = oEvent.getSource();
            //Header Token CSRF
            let parameterToken = new UploadCollectionParameter({
                name: "x-csrf-token",
                value: this.getView().getModel("employeeModel").getSecurityToken()
            });
            oUploadCollection.addHeaderParameter(parameterToken);            
        };
        function onUploadComplete(oEvent) {
            oEvent.getSource().getBinding("items").refresh();            
        };
        function onFileDeleted(oEvent) {
            let oUploadCollection = oEvent.getSource();
            let sPath = oEvent.getParameter("item").getBindingContext("employeeModel").getPath();
            this.getView().getModel("employeeModel").remove(sPath,{
                success: function () {
                    oUploadCollection.getBinding("items").refresh();
                },
                error: function (e) {
                    let oResourceB = this.oView.getModel("i18n").getResourceBundle();
                    let oMensaje = oResourceB.getText("archivoErrorTxt");
                    MessageBox.information(oMensaje);      
                    sap.base.Log.info(e);              
                }
            });            
        };
        function downloadFile(oEvent) {
            let sPath = oEvent.getSource().getBindingContext("employeeModel").getPath();
            window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");            
        };
        function onBajaEmpleado() {
            let oResourceB = this.oView.getModel("i18n").getResourceBundle();
            let oMensaje = oResourceB.getText("eliminaEmpleadoTxt");            
            let oMensajeOk = oResourceB.getText("eliminaEmpleadoOkTxt");
            let oMensajeError = oResourceB.getText("eliminaEmpleadoErrorTxt");

            MessageBox.confirm(oMensaje,{
                onClose: function(oRpta){
                            if(oRpta === "OK"){
                                this.getView().getModel("employeeModel").remove("/Users(EmployeeId='" + this.employeeId + "',SapId='"+this._sapId+"')",{
                                    success : function(data){
                                        MessageBox.information(oMensajeOk);
                                        this._splitApp.to(this.createId("inicioEmpleado"));
                                    }.bind(this),
                                    error : function(e){
                                        MessageBox.information(oMensajeError); 
                                        sap.base.Log.info(e);
                                    }.bind(this)
                                });
                        }
                }.bind(this)
            });            
        };
        function onAscenderEmpleado() {
            
        };
              
        var Main = Controller.extend("logaligroup.Empleados.controller.VerEmpleado", { });
        
        Main.prototype.onInit = onInit;
        Main.prototype.onBeforeRendering = onBeforeRendering;
        Main.prototype.onPressVolver = onPressVolver;
        Main.prototype.onBuscarEmpleado = onBuscarEmpleado;
        Main.prototype.onPressEmpleado = onPressEmpleado;
        Main.prototype.onBeforeUpload = onBeforeUpload;
        Main.prototype.onFileChange = onFileChange;
        Main.prototype.onUploadComplete = onUploadComplete;
        Main.prototype.onFileDeleted = onFileDeleted;
        Main.prototype.downloadFile = downloadFile;
        Main.prototype.onBajaEmpleado = onBajaEmpleado;
        Main.prototype.onAscenderEmpleado = onAscenderEmpleado;

		return Main;
	});