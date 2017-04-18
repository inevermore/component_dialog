/**
 * Created by lean on 2017/4/18.
 */

//从这里开始的所有示例代码，都假设在此闭包中
//jenga是window对象的属性
//
// AMD和jQuer的版本可在https://github.com/jstrimpel/jenga找到

var jenga = (function (global) {

    'use strict';

    //该对象将用来记录具有某些特殊习性的各个特殊的浏览器及版本
    //fixed - 对固定定位元素创建堆叠上下文的浏览器版本
    var browsers = {
        chrome: {
            fixed: 22
        }
    }

    //获取浏览器名称和版本
    var browser = (function () {
        var N = navigator.appName;
        var ua = navigator.userAgent;
        var tem;
        var M = ua.match(
            /(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i
        );
        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) {
            M[2] = tem[1];
        }
        M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];

        return {
            name: M[0].toLowerCase(),
            version: M[1]
        }
    })();

    //使用浏览器版本判断，固定定位元素是否创建了堆叠上下文
    var isFixedStackingCtx = (function () {
        return browsers[browser.name].fixed >= parseInt(browser.version, 10);
    })()

    //是一个值还是一个函数？
    function isFunction(thing) {
        return typeof thing === 'function';
    }

    //具有非 0 的 z-index值的定位元素会创建堆叠上下文
    function isPosAndHasZindex(el) {
        return el.style.position !== 'static' && el.style.zIndex !== 'auto';
    }

    //这些值会导致元素创建堆叠上下文
    function doseStyleCreateStackingCtx(el) {
        var styles = el.style;

        if(styles.opacity < 1) {
            return true;
        }
        if(styles.transform !== 'none') {
            return true;
        }
        if(styles.transformStyle === 'preserve-3d') {
            return true;
        }
        if(styles.perspective !== 'none') {
            return true;
        }
        if(styles.flowFrom !== 'none' && styles.content !== 'normal') {
            return true;
        }
        if(styles.position === 'fixed' && isFixedStackingCtx) {
            return true;
        }

        return false;
    }

    //移动对应元素，使之出现在元素所在的堆叠上下文的顶部或底部，并且在必要的时候，在父元素上创建堆叠上下文。
    //参数el指定需要移动到顶部或底部的元素；createStackingCtx可能是一个布尔值或一个函数；root参数可选，
    //指停止调整z-index的祖先元素；incremment接受一个布尔值，true表示把元素移到顶部，false表示底部。
    function moveUpDown(el, createStackingCtx, root, increment) {
        var stackingCtxEl = jenga.getStackingCtx(el);

        //如果元素的父节点没有创建堆叠上下文，而且定义了createStackingCtx函数
        //那么在父节点上强制创建堆叠上下文
        if(createStackingCtx && stackingCtxEl !== el.parentNode) {
            if(isFunction(createStackingCtx)) {
                createStackingCtx(el.parentNode);
                //以对 DOM 影响最小的方式创建堆叠上下文
            } else {
                el.parentNode.style.position = 'relative';
                el.parentNode.style.zIndex = 0;
            }
        }

        modifyZindex(el, increment);
        if(root && (root !== jenga.getStackingCtx(el) && stackingCtxEl.tagName !== 'HTML')) {
            moveUpDown(stackingCtxEl, createStackingCtx, root, increment);
        }
    }

    return {
        isStackingCtx: function (el) {
            return el.tagName === 'HTML' || (isPosAndHasZindex(el) && doseStyleCreateStackingCtx(el));
        },

        getStackingCtx: function (el) {
            var parentNode = el.parentNode;

            //在 DOM 树中遍历，直到找到堆叠上下文
            while (!jenga.isStackingCtx(parentNode)) {
                parentNode = parentNode.parentNode;
            }

            return parentNode;
        },

        bringToFront: function (el, createStackingCtx, root) {
        },

        sendToBack: function (el, createStackingCtx, root) {
        }
    };
})(this);