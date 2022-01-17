
$(function(){

  $('.tipo_busqueda').click(function(){
      $("input[name='tipo_busqueda']").prop('checked',false)
      $(this).children("input[name='tipo_busqueda']").prop('checked',true)
      $('.input_container').hide();
      $('#'+$(this).children("input[name='tipo_busqueda']").val()).show('fast');
  });

  $('.buscador_caja').click(function(){

    //if($(window).width() > 768){
      if($(this).attr('rel') == 1){
        //$('#kevin').show();
        $('.filtros_container').show();
        $(this).animate({top: '0px'},'fast');
      }
      $('#mensaje_apartados').show();
    //}
    
  }/*,function(){
    if($(this).attr('rel') == 1){
      $('.filtros_container').hide();
      $(".buscador_caja").animate({top: '80px'},'fast');
    }
  }*/);
});
