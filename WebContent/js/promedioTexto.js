function Unidades(num){

  switch(num)
  {
  
  	case 0: return "UNO";
    case 1: return "UNO";
    case 2: return "DOS";
    case 3: return "TRES";
    case 4: return "CUATRO";
    case 5: return "CINCO";
    case 6: return "SEIS";
    case 7: return "SIETE";
    case 8: return "OCHO";
    case 9: return "NUEVE";
    case 10: return "DIEZ";
  }

  return "";
}



function NumeroALetras(num){
  var data = {
    numero: num,
    enteros: Math.floor(num),
    centavos: (((Math.round(num * 10)) - (Math.floor(num) * 10))),
    letrasCentavos: "",
    letrasMonedaPlural: "",
    letrasMonedaSingular: "PUNTO"
  };

  if (data.centavos > 0)
    data.letrasCentavos = Unidades(data.centavos);
  else
	data.letrasCentavos = 'CERO'

    return Unidades(data.enteros) + " PUNTO " +  data.letrasCentavos;
}//NumeroALetras()