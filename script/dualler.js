/**
 * jQuery Dual listbox plugin
 *
 * Created by: Mark Kadlec
 *
 * Usage:
 *   Create a <select> and apply this script to that select via jQuery like so:
 *   $('select').Dualler(); - the Dualling ListBox will than be created for you.
 *
 *
 *   See the default parameters (below) for a complete list of options.
 */

(function($) {
    /** Initializes the DualListBox code as jQuery plugin. */
    $.fn.Dualler = function(paramOptions, selected) {

        return this.each(function () {
            var defaults = {
                element:    $(this).context,    // Select element which creates this dual list box.
                value:      'id',               // Value that is assigned to the value field in the option.
                text:       'name',             // Text that is assigned to the option field.
                title:      'Test',          // Title of the dual list box.
                timeout:    500,                // Timeout for when a filter search is started.
                textLength: 45,                 // Maximum text length that is displayed in the select.
                moveAllBtn: true,               // Whether the append all button is available.
                maxAllBtn:  500,                // Maximum size of list in which the all button works without warning. See below.
                selectClass:'Dualler-select',
                warning:    'Selecting so many items may make your browser unresponsive, are you sure you want to continue?'
            };

            var htmlOptions = {
                element:    $(this).context,
                value:      $(this).data('value'),
                text:       $(this).data('text'),
                title:      $(this).data('title'),
                timeout:    $(this).data('timeout'),
                textLength: $(this).data('textLength'),
                moveAllBtn: $(this).data('moveAllBtn'),
                maxAllBtn:  $(this).data('maxAllBtn'),
                selectClass:$(this).data('selectClass')
            };

            var options = $.extend({}, defaults, htmlOptions, paramOptions);

            $.each(options, function(i, item) {
                if (item === undefined || item === null) { throw 'Dualler: ' + i + ' is undefined.'; }
            });

            options['parent'] = 'dual-list-box-' + options.title;
            options['parentElement'] = '#' + options.parent;

            selected = $.extend([{}], selected);

            construct(options);
        })
    };

    /** Adds the event listeners to the buttons and filters. */
    function addListeners(options) {
        var from_box = $(options.parentElement + ' .from');
        var to_box = $(options.parentElement + ' .to');

        from_box.dblclick(function() {
          from_box.find('option:selected').appendTo(to_box);
          handleMovement(options);
        });

        to_box.dblclick(function() {
          to_box.find('option:selected').appendTo(from_box);
          handleMovement(options);
        });

        $(options.parentElement).find('button').bind('click', function() {
            switch ($(this).data('type')) {
                case 'str': /* Selected to the right. */
                    from_box.find('option:selected').appendTo(to_box);
                    $(this).prop('disabled', true);
                    break;
                case 'atr': /* All to the right. */
                    if (from_box.find('option').length >= options.maxAllBtn && confirm(options.warning) ||
                        from_box.find('option').length < options.maxAllBtn) {
                        from_box.find('option').each(function () {
                            if ($(this).isVisible()) {
                                $(this).remove().appendTo(to_box);
                            }
                        });
                    }
                    break;
                case 'stl': /* Selected to the left. */
                    to_box.find('option:selected').remove().appendTo(from_box);
                    $(this).prop('disabled', true);
                    break;
                case 'atl': /* All to the left. */
                    if (to_box.find('option').length >= options.maxAllBtn && confirm(options.warning) ||
                        to_box.find('option').length < options.maxAllBtn) {
                        to_box.find('option').each(function () {
                            if ($(this).isVisible()) {
                                $(this).remove().appendTo(from_box);
                            }
                        });
                    }
                    break;
                default: break;
            }

            handleMovement(options);
        });

        $(options.parentElement).closest('form').submit(function() {
            selected.find('option').prop('selected', true);
        });

        $(options.parentElement).find('input[type="text"]').keypress(function(e) {
            if (e.which === 13) {
                event.preventDefault();
            }
        });

    }

    /** Constructs the jQuery plugin after the elements have been retrieved. */
    function construct(options) {
        createDualListBox(options);
        parseStubListBox(options);
        addListeners(options);
    }

    /** Creates a new dual list box with the right buttons and filter. */
    function createDualListBox(options) {
        $(options.element).parent().attr('id', options.parent);

        $(options.parentElement).append(
                '<div id="left_div" style="float:left;">' +
                '       <h4><span class="unselected-title"></span></h4>' +
                '       <select class="from ' + options.selectClass + '" style="height: 200px; width: 100%;" multiple></select>' +
                '</div>' +
                (createHorizontalButtons(options.moveAllBtn)) +
                '<div style="float:left;">' +
                '       <h4><span class="selected-title"></span></h4>' +
                '       <select class="to ' + options.selectClass + '" style="height: 200px; width: 100%;" multiple></select>' +
                '</div>');

        $(options.parentElement + ' .from').prop('name', $(options.element).prop('name'));
        $(options.parentElement + ' .unselected-title').text('From ' + options.title);
        $(options.parentElement + ' .selected-title').text('To ' + options.title);
    }

    /** Creates the buttons when the dual list box is set in horizontal mode. */
    function createHorizontalButtons(copyAllBtn) {
        var button_html = '<div id="button_div" style="float:left;">';

            button_html += (copyAllBtn ? '<div class="button-container" style="padding-top:80px;"><button type="button" class="btn btn-default atr" data-type="atr" style="margin-bottom: 5px;"> </button></div>': '') +
                '<div class="button-container"><button type="button" class="str active" data-type="str" style="margin-bottom: 5px;" disabled> </button></div>';
            button_html += '<div class="button-container"> <button type="button" class="stl active" data-type="stl" style="margin-bottom: 5px;" disabled> </button></div>' +
                (copyAllBtn ? '<div class="button-container"><button type="button" class="atl active" data-type="atl" style="margin-bottom: 5px;"></button></div>' : '');

        button_html += '</div>'

        return button_html;
    }

    function handleMovement(options) {
        $(options.parentElement + ' .from').find('option:selected').prop('selected', false);
        $(options.parentElement + ' .to').find('option:selected').prop('selected', false);

        $(options.parentElement + ' select').find('option').each(function() { $(this).show(); });

        toggleButtons(options.parentElement);
    }

    // Set up dualling list boxes using existing select
    function parseStubListBox(options) {
        var textIsTooLong = false;

        $(options.element).find('option').text(function (i, text) {
            $(this).data('title', text);

            if (text.length > options.textLength) {
                textIsTooLong = true;
                return text.substr(0, options.textLength) + '...';
            }
        }).each(function () {
            if (textIsTooLong) {
                $(this).prop('title', $(this).data('title'));
            }

            $(this).appendTo(options.parentElement + ' .from');

        });

        $(options.element).remove();
        handleMovement(options);
    }

    function setButtonState(button, active) {
      button.prop('disabled', !active);
      if (active) {
        button.removeClass('inactive');
        button.addClass('active');
      } else {
        button.addClass('inactive');
        button.removeClass('active');
      }
    }

    /** Toggles the buttons based on the length of the selects. */
    function toggleButtons(parentElement) {
        $(parentElement + ' .from').change(function() {
            setButtonState($(parentElement + ' .str'), true);
        });

        $(parentElement + ' .to').change(function() {
            setButtonState($(parentElement + ' .stl'), true);
        });

        if ($(parentElement + ' .from').has('option').length == 0) {
            setButtonState($(parentElement + ' .atr'), false);
            setButtonState($(parentElement + ' .str'), false);
        } else {
            setButtonState($(parentElement + ' .atr'), true);
        }

        if ($(parentElement + ' .to').has('option').length == 0) {
            setButtonState($(parentElement + ' .atl'), false);
            setButtonState($(parentElement + ' .stl'), false);
        } else {
            setButtonState($(parentElement + ' .atl'), true);
        }
    }

    /** Checks whether or not an element is visible. The default jQuery implementation doesn't work. */
    $.fn.isVisible = function() {
        return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none');
    };

    /** Sorts options in a select / list box. */
    $.fn.sortOptions = function() {
        return this.each(function() {
            $(this).append($(this).find('option').remove().sort(function(a, b) {
                var at = $(a).text(), bt = $(b).text();
                return (at > bt) ? 1 : ((at < bt) ? -1 : 0);
            }));
        });
    };

    /** Simple delay function that can wrap around an existing function and provides a callback. */
    var delay = (function() {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
})(jQuery);
