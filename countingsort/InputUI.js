var InputUI = (function()
{
    function newHandler()
    {
        $(this).unbind('change').parent().append(
                inputLi($(this).attr('name').split('-')[1])
                );
        $(this).siblings().unbind('change');
    }

    function inputLi(key)
    {
        return $('<li>')
                .append($('<input type="text">').attr('name', 'key-' + key).change(newHandler))
                .append(': ')
                .append($('<input type="text">').attr('name', 'value-' + key).change(newHandler));
    }

    return function($input, $container, sort)
    {
        $input.find('ul').append(inputLi(0));
        $input.find('.start').click(
                function() {
                    var x = [];
                    $input.find('li').each(function()
                                           {
                                               x.push(new Element($($(this).children()[0]).val(), $($(this).children()[1]).val()));
                                           });
                    x.pop();
                    sort.setUnsorted(x);
                    $input.css('display', 'none');
                    $container.find('table').css('display', 'table');
                    sort.step();
                });
    }
})();
