let menu =
{
    punctuations : false,
    numbers : false,
    time : 30,
    word : 50
}
$('#punctuations').click(function() {
    menu.punctuations = !menu.punctuations;
    $(this).toggleClass('text-success', menu.punctuations);
});

$('#numbers').click(function() {
    menu.numbers = !menu.numbers;
    $(this).toggleClass('text-success', menu.numbers);
});

$('.time-option').click(function() {
    menu.time = parseInt($(this).data('menu.time'));
    $('.time-option').removeClass('text-success');
    $(this).addClass('text-success');
});

$('.word-option').click(function() {
    menu.word = parseInt($(this).data('menu.word'));
    $('.word-option').removeClass('text-success');
    $(this).addClass('text-success');
});
