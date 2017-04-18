/**
 * Created by lean on 2017/4/18.
 */

// Super.prototype.doSomething = function () {
//     Base.prototype.doSomething.call(this);
// }

(function (root, $) {
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    //constructor function
    function Voltron(options) {
        this.init(options)
        return this;
    }

    //默认设置
    Voltron.prototype.defaults = {};

    //事件散列
    Voltron.prototype.events = {};

    //初始化代码
    Voltron.prototype.init = function (options) {
        this.options = $.extend({}, this.defaults, options);
        this.$el = $(options.$el);
        this.bind();
        return this;
    }

    //依赖 Backbone.View.delefateEvents 方法，进行事件绑定
    Voltron.prototype.bind = function () {
        var events = this.options.events ? Voltron.result(this.options.events) : null;

        if(!events) {
            return this;
        }

        //防止重复绑定事件
        this.unbind();

        //遍历事件
        for (var key in events) {
            var method = events[key];
            //如果method的值不是一个函数，则找到对应的实例方法
            if(!$.isFunction(method)) {
                method = this[events[key]];
            }

            //如果方法不存在，跳出循环，处理events哈希对象中的下一个属性
            if(!method) {
                continue;
            }

            //从属性中提取出事件的名称和选择器
            var match = key.match(delegateEventSplitter);
            var eventName = match[1];
            var selector = match[2];

            //将事件回掉绑定到控件实例上
            method = $.proxy(method, this);

            if (selector.length) {
                this.$el.on(eventName, selector, method);
            } else {
                this.$el.on(eventName, method);
            }
        }
    };

    //解除绑定
    Voltron.prototype.unbind = function () {
        this.$el.off();
        return this;
    }

    //销毁实例
    Voltron.prototype.destroy = function () {
        this.unbind();
        this.$el.remove();
    }

    //静态工具方法，如果参数是一个函数，则返回函数执行的返回值；否则，直接返回参数
    Voltron.result = function (val) {
        return $.isFunction(val) ? val() : val;
    };

    window.Voltron = window.Voltron || Voltron;

})(window, jQuery);