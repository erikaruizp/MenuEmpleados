sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.MessageBox} MessageBox
     */
	function (Controller,JSONModel,MessageBox) {
		"use strict";

        function onBeforeRendering(){
            this._model.setData({
                _layout : "OneColumn",
                _tipoEmpleado : "",
                _min: 0,
                _max: 0,   
                _escala: 0,
                _nombreState :"None",
                _apellidoState :"None",
                _dniState :"None",                                             
                _fechaState :"None",
                sapId : this.getOwnerComponent().SapId,
                tipo: "",
                nombres: "",
                apellidos: "",
                dni: "",
                sueldo: 0,
                comentarios: "",
                numArchivos: 0,
                archivos: []                       
            });  

            var oPaso1 = this._wizard.getSteps()[0];
            this._wizard.discardProgress(oPaso1);
            this._wizard.goToStep(oPaso1);
            oPaso1.setValidated(false);
        };        
        function onInit() {
            this._model = new sap.ui.model.json.JSONModel({});
            this.getView().setModel(this._model);

            this._wizard = this.byId("wizard");
            this._empleadoID = "";
        };
        function onCancel(){
            var oResource = this.getView().getModel("i18n").getResourceBundle(); 
            var pregunta = oResource.getText("textoCancelar");
            MessageBox.confirm(pregunta,{
                onClose : function(oAction){
                    if(oAction === "OK"){
                        //Regresar al menú principal
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("RouteMenu",{},true);
                    }
                }.bind(this)
            });
            
        };       
        function onPressInterno(oEvent) {                                               
            this._model.setProperty("/_tipoEmpleado","Interno");
            this._model.setProperty("/_min",12000);
            this._model.setProperty("/_max",80000);
            this._model.setProperty("/_escala", 1000);
            this._model.setProperty("/tipo","0");
            this._model.setProperty("/sueldo",24000);                                    
            this._wizard.nextStep();        
        };
        function onPressAutonomo(oEvent) {
            this._model.setProperty("/_tipoEmpleado","Autonomo");
            this._model.setProperty("/_min",100);
            this._model.setProperty("/_max",2000);
            this._model.setProperty("/_escala", 50);
            this._model.setProperty("/tipo","1");
            this._model.setProperty("/sueldo",400);                
            this._wizard.nextStep();        
        };
        function onPressGerente(oEvent) {
            this._model.setProperty("/_tipoEmpleado","Gerente");
            this._model.setProperty("/_min",50000);
            this._model.setProperty("/_max",200000);
            this._model.setProperty("/_escala", 1000);
            this._model.setProperty("/tipo","2");
            this._model.setProperty("/sueldo",70000);              
            this._wizard.nextStep();        
        };        
        function onValidarEmpleado(oEvent,callback) {
            var oData = this._model.getData();
            var isValid = true;

            if(!oData.nombres){
                oData._nombreState = "Error";
                isValid = false;
            }else{
                oData._nombreState = "None";
            }
            
            if(!oData.apellidos){
                oData._apellidoState = "Error";
                isValid = false;
            }else{
                oData._apellidoState = "None";
            }
            
            if(!oData.fechaIn){
                oData._fechaState = "Error";
                isValid = false;
            }else{
                oData._fechaState = "None";
            }
            
            if(!oData.dni){
                oData._dniState = "Error";
                isValid = false;
            }else{
                oData._dniState = "None";
            }

            if(isValid) {
                this._wizard.validateStep(this.byId("dataEmployeeStep"));
            } else {
                this._wizard.invalidateStep(this.byId("dataEmployeeStep"));
            }

            if(callback){
                callback(isValid);
            }
        
        };
        function onValidarDNI(oEvent) {
            if(this._model.getProperty("_tipoEmpleado") !== "Autonomo"){
                var dni = oEvent.getParameter("value");
                var number;
                var letter;
                var letterList;
                var regularExp = /^\d{8}[a-zA-Z]$/;

                if(regularExp.test (dni) === true){
                    //Número
                    number = dni.substr(0,dni.length-1);
                    //Letra
                    letter = dni.substr(dni.length-1,1);
                    number = number % 23;
                    letterList="TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList=letterList.substring(number,number+1);

                    if (letterList !== letter.toUpperCase()) {
                        this._model.setProperty("/_dniState","Error");
                    }else{
                        this._model.setProperty("/_dniState","None");
                        this.onValidarEmpleado();
                    }
                }else{
                    this._model.setProperty("/_dniState","Error");
                }
            }         
        };
        function onWizardCompleted(oEvent) {
            this.onValidarEmpleado(oEvent, function(isValid){
                if(isValid){
                    var uploadCollection = this.byId("UploadCollection");
                    var archivos = uploadCollection.getItems();
                    var tabla = [];                                      

                    if (archivos.length > 0) {
                        for(var i in archivos){
                            tabla.push({NombreDoc:archivos[i].getFileName(),TipoMime:archivos[i].getMimeType()});	
                        }
                    }
                    //Ir a página Resumen
                    this._model.setProperty("/_layout", "MidColumnFullScreen");
                    this._model.setProperty("/numArchivos", archivos.length);                    
                    this._model.setProperty("/archivos", tabla);                                        
                }else{
                    this._wizard.goToStep(this.byId("dataEmployeeStep"));
                }
            }.bind(this));
            var oData = this._model.getData();
        };
        function onIrPaso1() {
            //Ir a sección Tipo Empleado
            this._model.setProperty("/_layout", "OneColumn");            
            this._wizard.goToStep(this.byId("typeEmployeeStep"));            
        };
        function onIrPaso2() {
            //Ir a sección Datos Empleado
            this._model.setProperty("/_layout", "OneColumn");            
            this._wizard.goToStep(this.byId("dataEmployeeStep"));            
        };        
        function onIrPaso3() {
            //Ir a sección Datos Opcionales
            this._model.setProperty("/_layout", "OneColumn");            
            this._wizard.goToStep(this.byId("OptionalInfoStep"));            
        };  
        function onFileChange(oEvent) {
            let oUploadCollection = oEvent.getSource();
            //Header Token CSRF
            let parameterToken = new sap.m.UploadCollectionParameter({
                name: "x-csrf-token",
                value: this.getView().getModel("employeeModel").getSecurityToken()                
            });
            oUploadCollection.addHeaderParameter(parameterToken);            
        };     
        function onBeforeUpload (oEvent) {
            let parameterSlug = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: this.getOwnerComponent().SapId + ";" + this._empleadoID + ";" + oEvent.getParameter("fileName")
            });
            oEvent.getParameters().addHeaderParameter(parameterSlug);            
        };         
        function onGrabar() {
            var oData = this.getView().getModel().getData();
            var body = {
                SapId : oData.sapId,
                Type : oData.tipo,
                FirstName : oData.nombres,
                LastName: oData.apellidos,
                Dni: oData.dni,
                CreationDate: oData.fechaIn,
                Comments: oData.comentarios,
                UserToSalary: [
                    {Ammount : parseFloat(oData.sueldo).toString(),
                     Comments : oData.comentarios,
                     Waers : "EUR"}
                    ]
            };
            this.getView().setBusy(true);
            this.getView().getModel("employeeModel").create("/Users",body,{
                success : function(data){
                    var oResourceB = this.oView.getModel("i18n").getResourceBundle();
                    var oMensaje = oResourceB.getText("empleadoNuevoTxt");
                    this.getView().setBusy(false);
                    //ID del nuevo usuario
                    this._empleadoID = data.EmployeeId;
                    oMensaje = oMensaje + this._empleadoID;
                    sap.m.MessageBox.information( oMensaje ,{
                        onClose : function(){
                            //Ir al wizard
                            this._model.setProperty("/_layout", "OneColumn");            
//                            this._wizard.goToStep(this.byId("typeEmployeeStep"));
                            //Ir al menú principal
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteMenu",{},true);
                        }.bind(this)
                    });
                    this.onSubirArchivos();
                }.bind(this),
                error : function(){
                    var oResourceB = this.oView.getModel("i18n").getResourceBundle();
                    var oMensaje = oResourceB.getText("empleadoErrorTxt");                    
                    sap.m.MessageBox.information(oMensaje);
                                       
                    this.getView().setBusy(false);
                }.bind(this)
            });            
        };
        function onSubirArchivos (ioNum) {
            var contexto = this;
            var oUploadCollection = contexto.byId("UploadCollection");
            oUploadCollection.upload();
        };  

        var Main = Controller.extend("logaligroup.Empleados.controller.CrearEmpleado", { });
        
        Main.prototype.onBeforeRendering = onBeforeRendering;
        Main.prototype.onInit = onInit;
        Main.prototype.onCancel = onCancel;
        Main.prototype.onPressInterno = onPressInterno;
        Main.prototype.onPressAutonomo = onPressAutonomo;
        Main.prototype.onPressGerente = onPressGerente;
        Main.prototype.onValidarEmpleado = onValidarEmpleado;
        Main.prototype.onValidarDNI = onValidarDNI;
        Main.prototype.onWizardCompleted = onWizardCompleted;
        Main.prototype.onIrPaso1 = onIrPaso1;
        Main.prototype.onIrPaso2 = onIrPaso2;
        Main.prototype.onIrPaso3 = onIrPaso3;   
        Main.prototype.onFileChange = onFileChange;   
        Main.prototype.onBeforeUpload = onBeforeUpload;
        Main.prototype.onGrabar = onGrabar;
        Main.prototype.onSubirArchivos = onSubirArchivos;        

		return Main;
	});