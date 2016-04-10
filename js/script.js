;
/* 
    Разобраться с координатами
*/
(function($) {
    "use strict";

    var defaults = {
        line: true,
        result: $("body")
    }

    function ColorPicker(element, options) {

        var picker = this;

        picker.config = $.extend({}, defaults, options);
        picker.element = element;
        picker.init();
        picker.cords = {
            setCords: function() {
                picker.cords.x = picker.panelPoint.offset().left - picker.panel.offset().left + picker.panelPoint.width;
                picker.cords.y = picker.panelPoint.offset().top - picker.panel.offset().top + picker.panelPoint.height;
                picker.cords.top = picker.panelPoint.offset().top - picker.line.offset().top + picker.linePoint.height;

                console.log(picker.cords.top);
                if (picker.cords.x < 0) picker.cords.x = 0;
                if (picker.cords.x > picker.panel.width) picker.cords.x = picker.panel.width;

                if (picker.cords.y < 0) picker.cords.y = 0;
                if (picker.cords.y > picker.panel.height) picker.cords.y = picker.panel.height;

                if (picker.cords.top < 0) picker.cords.top = 0;
                if (picker.cords.top > picker.line.height) picker.cords.top = picker.panel.height;

                return this;
            },
            setPanelCords: function(event) {
                picker.cords.x = event.clientX - picker.panel.offset().left + picker.panelPoint.width;
                picker.cords.y = event.clientY - picker.panel.offset().top + picker.panelPoint.height;

                if (picker.cords.x < 0) picker.cords.x = 0;
                if (picker.cords.x > picker.panel.width) picker.cords.x = picker.panel.width;

                if (picker.cords.y < 0) picker.cords.y = 0;
                if (picker.cords.y > picker.panel.height) picker.cords.y = picker.panel.height;

                picker.panelPoint.css({
                    "left": picker.cords.x,
                    "top": picker.cords.y
                });

                return this;
            },
            setLineCords: function(event) {
                picker.cords.top = event.clientY - picker.line.offset().top;

                if (picker.cords.top < 0) picker.cords.top = 0;
                if (picker.cords.top > picker.line.height) picker.cords.top = picker.panel.height;

                picker.linePoint.css({
                    "top": picker.cords.top
                });

                return this;
            },
            setPosition: function() {
                console.log(picker.cords);

                if (picker.cords.x < 0) picker.cords.x = 0;
                if (picker.cords.x > picker.panel.width) picker.cords.x = picker.panel.width;

                if (picker.cords.y < 0) picker.cords.y = 0;
                if (picker.cords.y > picker.panel.height) picker.cords.y = picker.panel.height;

                picker.panelPoint.css({
                    "left": picker.cords.x,
                    "top": picker.cords.y
                });

                if (picker.cords.top < 0) picker.cords.top = 0;
                if (picker.cords.top > picker.line.height) picker.cords.top = picker.panel.height;

                picker.linePoint.css({
                    "top": picker.cords.top
                });

                return this;
            }
        };

        picker.cords.setCords();
        picker.changeColor();


        // навязывание событий на цветовую панель
        picker.panel.focus = false;

        picker.panel.mousedown(function(event) {
            event.preventDefault();
            picker.panel.focus = true;

        });


        picker.panel.click(function() {

            picker.cords.setPanelCords(event);

            // Меняем цвет указателя на темных тонах
            if (picker.cords.y > (picker.panel.height / 2)) {
                picker.panelPoint.css("border-color", "#fff");
            } else {
                picker.panelPoint.css("border-color", "#000");
            }

            picker.panelPoint.focus();
            picker.changeColor();
        });

        // навязывание событий на цветовую линию
        picker.line.focus = false;

        picker.line.mousedown(function(event) {
            event.preventDefault();
            picker.line.focus = true;

        });

        picker.line.on('click', function(event) {
            picker.cords.setLineCords(event);
            picker.linePoint.focus();
            picker.changeColor();
        });

        picker.inputs.r.on('change', function() {
            picker.rgb.r = picker.inputs.validateRgb($(this));
            picker.rgbToCords();
            picker.cords.setPosition();

            picker.rgbToHex();
            picker.toRgb();
            picker.panelPoint.css("background-color", picker.rgb.toString());
            picker.inputs.hex.val(picker.hex);
        });

        picker.inputs.g.on('change', function() {
            picker.rgb.g = picker.inputs.validateRgb($(this));
            picker.rgbToCords();
            picker.cords.setPosition();

            picker.rgbToHex();
            picker.toRgb();
            picker.panelPoint.css("background-color", picker.rgb.toString());
            picker.inputs.hex.val(picker.hex);
        });

        picker.inputs.b.on('change', function() {
            picker.rgb.b = picker.inputs.validateRgb($(this));
            picker.rgbToCords();
            picker.cords.setPosition();

            picker.rgbToHex();
            picker.toRgb();
            picker.panelPoint.css("background-color", picker.rgb.toString());
            picker.inputs.hex.val(picker.hex);
        });

        picker.inputs.hex.on('change', function() {
            var input = $(this);
            var hex = input.val();

            hex = hex.replace('#', '');

            if (/(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(hex)) {

                picker.hex = hex;

                picker.hexToRgb().rgbToCords();
                picker.cords.setPosition();
                
            } else {

            }



        });

        picker.inputs.hex.on('change', function() {
            picker.hexToRgb();
        });

        $(document).on('mousemove', function(event) {

            // Перехват события на панель
            if (picker.panel.focus) {

                picker.cords.setPanelCords(event);

                // Меняем цвет указателя на темных тонах
                if (picker.cords.y > (picker.panel.height / 2)) {
                    picker.panelPoint.css("border-color", "#fff");
                } else {
                    picker.panelPoint.css("border-color", "#000");
                }

                picker.panelPoint.css({
                    "left": picker.cords.x,
                    "top": picker.cords.y
                });

                picker.panelPoint.focus();
                picker.changeColor();

            }

            // Перехват события на линию
            if (picker.line.focus) {

                picker.cords.setLineCords(event);

                picker.linePoint.css({
                    "top": picker.cords.top
                });

                picker.linePoint.focus();
                picker.changeColor();
            }
        });



        // Потеря фокуса
        $(document).mouseup(function() {
            picker.panel.focus = false;
            picker.line.focus = false;
        });


    }

    ColorPicker.prototype.init = function() {

        // создание элементов 
        var panelBox = $('<div/>', {
            "class": "color-picker_panel"
        });

        this.panel = $('<div/>', {
            "class": "color-picker_panel-color"
        });

        this.line = $('<div/>', {
            "class": "color-picker_line"
        });

        this.panelPoint = $('<button/>', {
            "class": "color-picker_panel-point"
        });

        this.linePoint = $('<button/>', {
            "class": "color-picker_line-point"
        });

        this.result = $('<div/>', {
            "class": "color-picker_result"
        });

        this.inputs = {
            r: $('<input>', {
                type: 'text',
                class: 'color-picker_input color-picker_input-r'
            }),
            g: $('<input>', {
                type: 'text',
                class: 'color-picker_input color-picker_input-g'
            }),
            b: $('<input>', {
                type: 'text',
                class: 'color-picker_input color-picker_input-b'
            }),
            hex: $('<input>', {
                type: 'text',
                class: 'color-picker_input color-picker_input-hex'
            }),
            validateRgb: function($input) {
                this.val = $input.val();

                this.val = parseInt(this.val);


                if ((this.val < 0) || (!this.val))
                    this.val = 0;

                if (this.val > 255)
                    this.val = 255;

                $input.val(this.val);

                return this.val;
            }
        };


        // формируем dom
        this.panel.append(
                $('<div/>', {
                    "class": "color-picker_overlay-white"
                })
                .append(
                    $('<div/>', {
                        "class": "color-picker_overlay-black"
                    })
                )
            )
            .appendTo(panelBox);

        panelBox.append(this.panelPoint)
            .appendTo(this.element);

        this.line
            .append(this.linePoint)
            .appendTo(this.element);

        this.result.appendTo(this.element);

        this.inputs.r.appendTo(this.element);
        this.inputs.g.appendTo(this.element);
        this.inputs.b.appendTo(this.element);
        this.inputs.hex.appendTo(this.element);


        //Получаем необходимые параметры
        this.panel.height = this.panel.innerHeight();
        this.panel.width = this.panel.innerWidth();
        this.line.height = this.line.innerHeight();
        this.panelPoint.width = this.panelPoint.outerWidth() / 2;
        this.panelPoint.height = this.panelPoint.outerHeight() / 2;
        this.linePoint.height = this.linePoint.outerHeight() / 2;

        this.cords = {};

        this.hsv = {};

        this.rgb = {
            toString: function() {
                return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
            }
        };

        // Скрываем шкалу цветов
        if (!this.config.line) {
            this.line.css("display", "none");
        }
        // Получение цвета из координат в HSV
        this.cordsToHsv = function() {

            this.hsv.h = parseInt(360 * (this.line.height - this.cords.top) / this.line.height);
            this.hsv.h = (this.hsv.h == 360) ? 0 : this.hsv.h;

            this.hsv.s = parseInt(100 * this.cords.x / this.panel.width);

            this.hsv.v = parseInt(100 * (this.panel.height - this.cords.y) / this.panel.height);

            return this;
        };

        //hex -> RGB
        this.hexToRgb = function() {


            this.hex = parseInt(((this.hex.indexOf('#') > -1) ? this.hex.substring(1) : this.hex), 16);
            this.rgb.r = this.hex >> 16;
            this.rgb.g = (this.hex & 0x00FF00) >> 8;
            this.rgb.b = (this.hex & 0x0000FF);

            return this;
        };


        // Первод HSV -> RGB
        this.hsvToRgb = function() {
            var f, p, q, t, lH, S, V, H;

            H = this.hsv.h;
            S = this.hsv.s / 100;
            V = this.hsv.v / 100

            lH = Math.floor(this.hsv.h / 60);

            f = H / 60 - lH;
            p = V * (1 - S);
            q = V * (1 - S * f);
            t = V * (1 - (1 - f) * S);

            switch (lH) {

                case 0:
                    this.rgb.r = V;
                    this.rgb.g = t;
                    this.rgb.b = p;
                    break;
                case 1:
                    this.rgb.r = q;
                    this.rgb.g = V;
                    this.rgb.b = p;
                    break;
                case 2:
                    this.rgb.r = p;
                    this.rgb.g = V;
                    this.rgb.b = t;
                    break;
                case 3:
                    this.rgb.r = p;
                    this.rgb.g = q;
                    this.rgb.b = V;
                    break;
                case 4:
                    this.rgb.r = t;
                    this.rgb.g = p;
                    this.rgb.b = V;
                    break;
                case 5:
                    this.rgb.r = V;
                    this.rgb.g = p;
                    this.rgb.b = q;
                    break;
            }


            this.rgb.r = parseInt(this.rgb.r * 255);
            this.rgb.g = parseInt(this.rgb.g * 255);
            this.rgb.b = parseInt(this.rgb.b * 255);


            this.result.css("background-color", this.rgb.toString());
            return this;
        };

        // RGB -> HEX
        this.rgbToHex = function() {

            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            };


            this.hex = componentToHex(this.rgb.r) + componentToHex(this.rgb.g) + componentToHex(this.rgb.b);

            return this;
        };

        // H -> RGB 
        // Задает цвет для Panel
        this.toRgb = function() {
            var f, p, q, t, lH, S, V, H, R, G, B;

            H = this.hsv.h;
            S = 1;
            V = 1;

            lH = Math.floor(this.hsv.h / 60);

            f = H / 60 - lH;
            p = V * (1 - S);
            q = V * (1 - S * f);
            t = V * (1 - (1 - f) * S);

            switch (lH) {

                case 0:
                    R = V;
                    G = t;
                    B = p;
                    break;
                case 1:
                    R = q;
                    G = V;
                    B = p;
                    break;
                case 2:
                    R = p;
                    G = V;
                    B = t;
                    break;
                case 3:
                    R = p;
                    G = q;
                    B = V;
                    break;
                case 4:
                    R = t;
                    G = p;
                    B = V;
                    break;
                case 5:
                    R = V;
                    G = p;
                    B = q;
                    break;
            }

            var rgb = "rgb(" + parseInt(R * 255) + "," + parseInt(G * 255) + "," + parseInt(B * 255) + ")";

            this.panel.css("background-color", rgb);
            this.linePoint.css("background-color", rgb);

            return this;
        };

        // rgb -> cords
        this.rgbToCords = function() {

            var min = Math.min(this.rgb.r, this.rgb.g, this.rgb.b);
            var max = Math.max(this.rgb.r, this.rgb.g, this.rgb.b);
            var delta = max - min;

            this.hsv.v = max;

            this.hsv.s = max != 0 ? 255 * delta / max : 0;
            if (this.s != 0) {
                if (this.rgb.r == max) {
                    this.hsv.h = (this.rgb.g - this.rgb.b) / delta;
                } else if (this.rgb.g == max) {
                    this.hsv.h = 2 + (this.rgb.b - this.rgb.r) / delta;
                } else {
                    this.hsv.h = 4 + (this.rgb.r - this.rgb.g) / delta;
                }
            } else {
                this.hsv.h = -1;
            }

            this.hsv.h *= 60;

            if (this.hsv.h < 0) {
                this.hsv.h += 360;
            }


            this.hsv.s *= 100 / 255;
            this.hsv.v *= 100 / 255;

            this.cords.top = this.line.height - (this.hsv.h * this.line.height / 360);

            this.cords.x = this.hsv.s * this.panel.width / 100;

            this.cords.y = this.panel.height - (this.hsv.v * this.panel.height) / 100;

            console.log(this.cords);
        };

        //устанавливает все цвета
        this.changeColor = function() {
            this.cordsToHsv().hsvToRgb().rgbToHex();
            this.toRgb();
            this.panelPoint.css("background-color", this.rgb.toString());

            this.inputs.r.val(this.rgb.r);
            this.inputs.g.val(this.rgb.g);
            this.inputs.b.val(this.rgb.b);
            this.inputs.hex.val(this.hex);
            return this;
        };
    }

    $.fn.colorPicker = function(options) {

        this.each(function() {
            new ColorPicker($(this), options);
        });

        return this;
    }

})(jQuery);


$(document).ready(function() {
    $(".color-picker").colorPicker();
});
