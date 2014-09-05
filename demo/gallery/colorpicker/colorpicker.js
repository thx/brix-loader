define(
    [
        'jquery', 'underscore',
        '/src/brix.js',
        'text!./colorpicker.tpl',
        'text!/demo/gallery/colorpicker/colorpicker-svg-slide.tpl',
        'text!/demo/gallery/colorpicker/colorpicker-svg-picker.tpl',
        'text!/demo/gallery/colorpicker/colorpicker-vml-slide.tpl',
        'text!/demo/gallery/colorpicker/colorpicker-vml-picker.tpl',
        'less!./colorpicker.less'
    ],
    function(
        $, _,
        Brix,
        template,
        svgSlideTpl,
        svgPickerTpl,
        vmlSlideTpl,
        vmlPickerTpl
    ) {
        /*

            ### 数据
            {}

            ### 选项
            公共选项：data template
            color

            ### 属性
            公共属性：element moduleId clientId parentClientId childClientIds data template
            color

            ### 方法

            ### 事件
            公共事件：ready destroyed

        */
        function ColorPicker(options) {}
        _.extend(ColorPicker.prototype, Brix.prototype, {
            init: function() {

            },
            render: function() {
                var that = this

                this.color = this.options.color || '#ffffff'
                var rendered = _.template(template, {
                    colors: ['#d81e06', '#f4ea2a', '#1afa29', '#1296db', '#13227a', '#d4237a', '#ffffff', '#e6e6e6', '#dbdbdb', '#cdcdcd', '#bfbfbf', '#8a8a8a', '#707070', '#515151', '#2c2c2c', '#000000', '#ea986c', '#eeb174', '#f3ca7e', '#f9f28b', '#c8db8c', '#aad08f', '#87c38f', '#83c6c2', '#7dc5eb', '#87a7d6', '#8992c8', '#a686ba', '#bd8cbb', '#be8dbd', '#e89abe', '#e8989a', '#e16632', '#e98f36', '#efb336', '#f6ef37', '#afcd51', '#7cba59', '#36ab60', '#1baba8', '#17ace3', '#3f81c1', '#4f68b0', '#594d9c', '#82529d', '#a4579d', '#db649b', '#dd6572', '#d81e06', '#e0620d', '#ea9518', '#f4ea2a', '#8cbb1a', '#2ba515', '#0e932e', '#0c9890', '#1295db', '#0061b2', '#0061b0', '#004198', '#122179', '#88147f', '#d3227b', '#d6204b'],
                    min: false,
                    color: this.color
                })

                this.triggerElement = this.element
                var $triggerElement = $(this.triggerElement)
                this.element = $(rendered).css({
                    left: $triggerElement.offset().left,
                    top: $triggerElement.offset().top + $triggerElement.outerHeight() + 1
                }).appendTo(document.body).hide()

                this.pickerDragNode = this.element.find('.picker-indicator')
                this.slideDragNode = this.element.find('.slide-indicator')

                var slideNode = this.slideNode = this.element.find('.slide')
                var pickerNode = this.pickerNode = this.element.find('.picker')
                var type = (window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML")

                switch (type) {
                    case 'SVG':
                        slideNode.append(svgSlideTpl)
                        pickerNode.append(svgPickerTpl)
                        break
                    default:
                        if (!document.namespaces.v) {
                            document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML')
                        }
                        slideNode.html(vmlSlideTpl)
                        pickerNode.html(vmlPickerTpl)
                }

                that.setHex(that.color)

                this.on('change selected', function(e, data) {
                    console.log(e.type, data)
                })
                $triggerElement.on('click', function(event) {
                    that.toggle()
                })
            },
            show: function() {
                $(this.element).show()
            },
            hide: function() {
                $(this.element).hide()
            },
            toggle: function(e) {
                $(this.element).toggle()
            },
            /**
             * Sets color of the picker in hsv/rgb/hex format.
             * @param {Object} hsv Object of the form: { h: <hue>, s: <saturation>, v: <value> }.
             * @param {Object} rgb Object of the form: { r: <red>, g: <green>, b: <blue> }.
             * @param {String} hex String of the form: #RRGGBB.
             */
            setColor: function(hsv, rgb, hex) {
                var that = this
                var $element = this.element
                this.h = hsv.h % 360
                this.s = hsv.s
                this.v = hsv.v
                var c = hsv2rgb(this.h, this.s, this.v)

                this.slideDragNode.css({
                    top: Math.round(this.h * this.slideNode.height() / 360 - 5)
                })
                var left = Math.round(this.s * this.pickerNode.width() - 5)
                var top = Math.round((1 - this.v) * this.pickerNode.height() - 5)
                this.pickerDragNode.css({
                    left: left,
                    top: top,
                    color: top > 98 ? '#fff' : '#000'
                })
                this.pickerNode.css({
                    "background-color": hsv2rgb(this.h, 1, 1).hex
                })
                $element.find('.colorpicker-footer span').css({
                    "background-color": c.hex
                })
                this.color = c.hex
                $element.find('li').removeClass('selected')

                var input = $element.find('input')
                if (input.val() !== c.hex) input.val(c.hex)
            },
            /**
             * 设置颜色
             * @param {Object} hsv hsv对象 { h: <hue>, s: <saturation>, v: <value> }
             */
            setHsv: function(hsv) {
                this.setColor(hsv)
            },
            /**
             * 设置颜色
             * @param {Object} rgb rgb对象 { r: <red>, g: <green>, b: <blue> }
             */
            setRgb: function(rgb) {
                this.setColor(rgb2hsv(rgb.r, rgb.g, rgb.b), rgb)
            },
            /**
             * 设置颜色
             * @param {String} hex 颜色值 #RRGGBB.
             */
            setHex: function(hex) {
                this.setColor(rgb2hsv(parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5, 2), 16)), undefined, hex)
            },
            /* Events */
            pickQuickColor: function(event, extraParameters) {
                this.setHex(extraParameters)
                $(event.target).addClass('selected')
            },
            pickPaletteColor: function(event) {
                var offset = this.pickerNode.offset()
                var left = event.pageX - offset.left
                var top = event.pageY - offset.top
                var width = this.pickerNode.width()
                var height = this.pickerNode.height()
                this.setHsv({
                    h: this.h,
                    s: left / width,
                    v: (height - top) / height
                })
            },
            dragPickerIndicator: function(event) {
                var that = this
                $(document.documentElement).css('cursor', 'pointer')
                event.preventDefault()
                $(document.body).on('mousemove.pickerDragNode', function(event) {
                    event.pageX -= 5
                    event.pageY -= 5
                    var offset = that.pickerNode.offset(),
                        width = that.pickerNode.width(),
                        height = that.pickerNode.height(),
                        left = event.pageX - offset.left,
                        top = event.pageY - offset.top

                    if (left + 5 > width) left = width
                    else if (left < 0) left = 0
                    else left += 5

                    if (top + 5 > height) top = height
                    else if (top < 0) top = 0
                    else top += 5

                    that.setHsv({
                        h: that.h,
                        s: left / width,
                        v: (height - top) / height
                    })
                }).on('mouseup', function(e) {
                    $(document.documentElement).css('cursor', 'auto')
                    $(document.body).off('mousemove.pickerDragNode')
                })
            },
            pickSlideColor: function(event) {
                var offset = this.slideNode.offset(),
                    height = this.slideNode.height(),
                    top = ((event.pageY - offset.top >= height) ? height - 1 : event.pageY - offset.top),
                    h = top / height * 360
                this.setHsv({
                    h: h,
                    s: this.s,
                    v: this.v
                })
            },
            dragSlideIndicator: function(event) {
                var that = this
                $(document.documentElement).css('cursor', 'pointer')
                event.preventDefault()
                $(document.body).on('mousemove.slideDragNode', function(event) {
                    event.pageX -= 5
                    event.pageY -= 5
                    var offset = that.slideNode.offset()
                    var height = that.slideNode.height(),
                        top = event.pageY - offset.top

                    if (top + 5 > height) top = height - 1
                    else if (top < 0) top = 0
                    else top += 5

                    that.setHsv({
                        h: top / that.slideNode.height() * 360,
                        s: that.s,
                        v: that.v
                    })
                }).on('mouseup', function(e) {
                    $(document.documentElement).css('cursor', 'auto')
                    $(document.body).off('mousemove.slideDragNode')
                })
            },
            inputColor: function(event) {
                var val = $(event.target).val()
                if (val.length === 7 && this.color !== val) this.setHex(val)
            },
            finishInputColor: function(event) {
                var val = $(event.target).val()
                if (this.color != val) this.setHex(val)
            },
            submit: function(event) {
                var c = hsv2rgb(this.h, this.s, this.v)
                this.trigger('selected', {
                    hex: c.hex,
                    hsv: {
                        h: this.h,
                        s: this.s,
                        v: this.v
                    },
                    rgb: {
                        r: c.r,
                        g: c.g,
                        b: c.b
                    }
                })
                this.hide()
            }
        })
        return ColorPicker

        function hsv2rgb(h, s, v) {
            var R, G, B, X, C
            h = (h % 360) / 60
            C = v * s
            X = C * (1 - Math.abs(h % 2 - 1))
            R = G = B = v - C

            h = ~~h
            R += [C, X, 0, 0, X, C][h]
            G += [X, C, C, X, 0, 0][h]
            B += [0, 0, X, C, C, X][h]

            var r = R * 255,
                g = G * 255,
                b = B * 255
            return {
                r: r,
                g: g,
                b: b,
                hex: "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1)
            }

        }

        /**
         * Convert RGB representation to HSV.
         * r, g, b can be either in <0,1> range or <0,255> range.
         * Credits to http://www.raphaeljs.com
         */
        function rgb2hsv(r, g, b) {
            if (r > 1 || g > 1 || b > 1) {
                r /= 255
                g /= 255
                b /= 255
            }
            var H, S, V, C
            V = Math.max(r, g, b)
            C = V - Math.min(r, g, b)
            H = (C === 0 ? null : V == r ? (g - b) / C + (g < b ? 6 : 0) : V == g ? (b - r) / C + 2 : (r - g) / C + 4)
            H = (H % 6) * 60
            S = C === 0 ? 0 : C / V
            return {
                h: H,
                s: S,
                v: V
            }
        }

    }
)