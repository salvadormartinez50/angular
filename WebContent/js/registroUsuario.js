var app = window.angular.module('registroUsuario', ['ngResource']);

app.controller('registroUsuarioController', ['$scope', '$http', '$window', '$rootScope',
    function ($scope, $http, $window, $rootScope) {

        $scope.getEstados = function () {
            $http.get(global_uri+'/catalogos/estado')
                .then(function (data) {
                   $scope.estados = data.data.estadoDTO;
                   console.log(data)
            });
        }


        $scope.validaMail = function () {
            processing();
            $scope.curp = $scope.curp.toUpperCase();

            var to = $scope.correo;
            var curp = $scope.curp;
            var nombre = $scope.nombre;
            var primerAp = $scope.primerAp;
            var segundoAp = $scope.segundoAp;
            var pass =  $scope.password;

            var mensaje2 = '';

            var expreg = /^([A-Z]{4})([0-9]{6})([HM]{1})(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;

            if (expreg.test($scope.curp)) {
                noprocessing();
                modalEnviado();
                $http.get(global_mail_uri + '/modulos/mailActivar/?'
                    + '&to=' + to
                    + '&curp=' + curp
                    + '&nombre=' + nombre
                    + '&primerap=' + primerAp
                    + '&segundoap=' + segundoAp
                    + '&pass=' + pass)
                .then(function (data) {
                    if (data.data.Enviado == 1){
                        //noprocessing();
                        //modalEnviado();
                    } else {
                        console.log("hubo un error al enviar el correo");
                        noprocessing();
                        //modalNoEnviado();
                    }

                });

            } else {
                alert("El formato de la curp no es valida");
                noprocessing();
            }
        }

        $scope.insertarTutor = function () {

            processing();

            var curp = $scope.curp;
            var nombre = $scope.nombre;
            var primerAp = $scope.primerAp;
            var segundoAp = $scope.segundoAp;
            var entidad = $scope.entidad.id;
            var correo = $scope.correo;
            var password = $scope.password;
            var usuaio = $scope.curp + '@siged.sep.gob.mx';

            console.info(correo);
            console.info(usuaio);

            var expreg = /^([A-Z]{4})([0-9]{6})([HM]{1})(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;

            if (expreg.test($scope.curp)) {

                $http.get(global_uri + '/padreFamilia/datosTutor/?'
                    + '&curp=' + curp
                    + '&nombre=' + nombre
                    + '&primerap=' + primerAp
                    + '&segundoap=' + segundoAp
                    + '&entidad=' + entidad
                    + '&correo=' + correo
                    + '&password=' + password)

                .then(function (data) {
                    if (data.data.guardado == 1){

                    } else {
                        console.log("hubo un error al enviar los datos");
                        noprocessing();
                        modalNoEnviado();
                    }

                });

                $http.get(global_uri + '/padreFamilia/saveUsuario/?'
                    + '&usuario=' + usuaio
                    + '&password=' + password
                    + '&curp=' + curp
                    + '&correo=' + correo
                    + '&nombre=' + nombre
                    + '&primerAp=' + primerAp
                    + '&segundoAp=' + segundoAp)

                .then(function (data) {
                    if (data.data.guardado == 1){
                    } else {
                        console.log("hubo un error al enviar los datos");
                        noprocessing();
                        modalNoEnviado();
                    }

                });



            } else {
                console.log("El formato de la curp no es valida");
                noprocessing();
            }
        }


        var processing = function () {
            $("#modal-loading").modal('show');
            $('.tiempo_fuera').hide();
            setTimeout(revisaModal, 30000);
        }

        var modalEnviado = function () {
            document.getElementById("formTutor").reset();
            $("#modalEnviado").modal('show');
        }

        var modalNoEnviado = function (){
            $("#modalNoEnviado").modal('show');
        }

        var noprocessing = function () {
            $("#modal-loading").modal('hide');
        }

        var revisaModal = function (){
            if(($("#modal-loading").data('bs.modal') || {}).isShown){
                $('.tiempo_fuera').show();
            }
        }

        var checkPasswordMatch = function () {
            var password = $("#pass1").val();
            var confirmPassword = $("#pass2").val();

            if (password != confirmPassword){
                $("#validaPass").html("El password no coincide");
                $("#validaPass").css({'color': 'red'});
            }
            else{
                $("#validaPass").html("Password correcto");
                $("#validaPass").css({'color': 'green'});
            }
        }
        
        $scope.getEstados();

        $(document).ready(function () {
           $("#pass2").keyup(checkPasswordMatch);
        });

    }]
);
