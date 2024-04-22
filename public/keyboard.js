$(document).on("keydown",function (event){
    console.log(event.key);

    if(
        event.key === '=' ||
        event.key === '[' ||
        event.key === ']' ||
        event.key === ';' ||
        event.key === ',' ||
        event.key === '.' ||
        event.key === '/'
    ){
        $("#\\"+event.key).css('background-color','#157347');
        setTimeout(function (){
            $("#\\"+event.key).css('background-color','#191a1c');
        },400);
    }else if(event.key === '\''){
        $('#single-quotes').css('background-color','#157347');
        setTimeout(function (){
            $('#single-quotes').css('background-color','#191a1c');
        },400);
    }else if(event.key === '\\'){
        $('#back-slash').css('background-color','#157347');
        setTimeout(function (){
            $('#back-slash').css('background-color','#191a1c');
        },400);
    }else if(event.which === 32){
        $('#spacebar').css('background-color','#157347');
        setTimeout(function (){
            $('#spacebar').css('background-color','#191a1c');
        },400);
    }else{
        $("#"+event.key).css('background-color','#157347');
        setTimeout(function (){
            $("#"+event.key).css('background-color','#191a1c');
        },400);
    }
});
