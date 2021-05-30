//@ts-nocheck
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/UploadCollectionParameter",
        "sap/m/MessageBox",
        "sap/ui/model/FilterType"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.m.UploadCollectionParameter} UploadCollectionParameter
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.model.FilterType} FilterType
     */
	function (Controller,Filter,FilterOperator,UploadCollectionParameter,MessageBox,FilterType) {
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
            var oBinding = this.getView().byId("listaEmpleado").getBinding("items");
            var oTexto = this.getView().byId("textoBuscar").getValue();
            var filters = [];

/*            if (oTexto !== "") {
                var filters_aux = [];
                filters_aux.push(new Filter("FirstName",FilterOperator.Contains,oTexto));
                filters_aux.push(new Filter("LastName",FilterOperator.Contains,oTexto));                
                filters.push(new Filter({
                    filters: [new Filter("SapId",FilterOperator.EQ,this._sapId),
                              new Filter({filters: filters_aux,and:false}),
                             ],
                    and:true                   
                }));           
                oBinding.filter(filters, FilterType.Application);              
            }
            else{ filters.push(new Filter("SapId",FilterOperator.EQ,this._sapId)); 
                  oBinding.filter(filters);}*/            

            filters.push(new Filter("SapId",FilterOperator.EQ,this._sapId));            
            if (oTexto !== "") {
                filters.push(new Filter("FirstName",FilterOperator.Contains,oTexto));
            }
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
            if(!this._dialogoAscenso){
                this._dialogoAscenso = sap.ui.xmlfragment("logaligroup/Empleados/fragment/Ascenso", this);
                this.getView().addDependent(this._dialogoAscenso);
            }
            this._dialogoAscenso.setModel(new sap.ui.model.json.JSONModel({}),"_ascensoModel");
            this._dialogoAscenso.open();            
        };
        function onAceptaAscenso(oEvent) {
            let oDatos = this._dialogoAscenso.getModel("_ascensoModel").getData();
            let oResourceB = this.oView.getModel("i18n").getResourceBundle();     
            let oMensajeOk = oResourceB.getText("ascensoEmpleadoOkTxt");
            let oMensajeError = oResourceB.getText("ascensoEmpleadoErrorTxt");            
            let body = {
                Ammount : oDatos.sueldo,
                CreationDate : oDatos.fecha,
                Comments : oDatos.comentario,
                SapId : this._sapId,
                EmployeeId : this.employeeId
            };
            this.getView().setBusy(true);
            this.getView().getModel("employeeModel").create("/Salaries",body,{
                success : function(){
                    this.getView().setBusy(false);
                    MessageBox.information(oMensajeOk);
                    this.onCancelaAscenso();
                }.bind(this),
                error : function(e){
                    this.getView().setBusy(false);
                    MessageBox.information(oMensajeError);
                    sap.base.Log.info(e);
                }.bind(this)
            });            
        };
        function onCancelaAscenso() {
            this._dialogoAscenso.close();
//            this.byId("timeLine").refreshContent();
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
        Main.prototype.onAceptaAscenso = onAceptaAscenso;
        Main.prototype.onCancelaAscenso = onCancelaAscenso;

		return Main;
	});