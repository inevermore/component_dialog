/**
 * Created by lean on 2017/4/18.
 */
(function () {

    'use strict';

    //设置类的原型为基本控件，设置类的构造函数
    Dialog.prototype = new Voltron({});
    Dialog.prototype.constructor = Dialog;

    //构造函数
    function Dialog(options) {
        Voltron.call(this, options);
        return this;
    }

    //默认值，如宽度和高度
    Dialog.prototype.defaults = {};

    //事件响应函数，通过 Voltron.prototype.bind 绑定
    Dialog.prototype.events = {};

    //根据模板生产内容，并插入 DOM
    Dialog.prototype.render = function () {};

    //显示对话框
    Dialog.prototype.show = function () {};

    //隐藏对话框
    Dialog.prototype.hide = function () {};

    window.Dialog = window.Dialog || Dialog;
})(window, jQuery, Voltron);