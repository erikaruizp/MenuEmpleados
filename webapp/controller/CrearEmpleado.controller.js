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
                _nombreState :"None",
                _apellidoState :"None",
                _dniState :"None",                                             
                _fechaState :"None",
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
            this._model.setProperty("/tipo","0");
            this._model.setProperty("/sueldo",24000);                                    
            this._wizard.nextStep();        
        };
        function onPressAutonomo(oEvent) {
            this._model.setProperty("/_tipoEmpleado","Autonomo");
            this._model.setProperty("/_min",100);
            this._model.setProperty("/_max",2000);
            this._model.setProperty("/tipo","1");
            this._model.setProperty("/sueldo",400);                
            this._wizard.nextStep();        
        };
        function onPressGerente(oEvent) {
            this._model.setProperty("/_tipoEmpleado","Gerente");
            this._model.setProperty("/_min",50000);
            this._model.setProperty("/_max",200000);
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
                            tabla.push({DocName:archivos[i].getFileName(),MimeType:archivos[i].getMimeType()});	
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
        }
              
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

		return Main;
	});