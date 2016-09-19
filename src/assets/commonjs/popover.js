/**
 * @file popover.js 弹出框组件
 *
 */

let alert,      // 提示框
    confirm,    // 确认框
    loading = Loading || new Loading(),
    addOverlay, // 加入遮罩层
    addPopover, // 加入弹出层
    overlay,    // 引用遮罩层
    popover,    // 引用弹出层
    toast,      // 吐司效果
    destroy;    // 销毁dom节点
let noop = function(){};

addOverlay = function () {
    $(document.body).append('<div id="overlay" class="hide"></div>');
    overlay = $("#overlay");
};

addPopover = function () {
    $(document.body).append('<div id="popover-wrapper"></div>');
    popover = $("#popover-wrapper");
};

destroy = function () {
    overlay.remove();
    popover.remove();
};

/**
 * @method alert
 */


alert = function (args) {
    /**
     * @param args {Object} e.g. {message: "你确定？"}
     */
    var
        message = args.message || "",
        callback = args.callback || noop;


    var html = "";

    html +=
        "<div id='fix' style='width: 100%;height: 100%;position: fixed;left: 0;top: 0;z-index: 9999;'>" +
        "<div class='success-end' style='width: 410px;height: 200px;box-shadow:0 0 9px #eeeff4;background: #fff;line-height: 150px;text-align: center;color: #4a9d93;position: absolute;left: 0;top:0;right:0;bottom:0;margin: auto;'>" +
        "<div style='display: inline-block;'>" +
        "</div>" +
        message +
        "<button class='btn bg-deep-blue dt-btn' style='width: 98px;height: 33px;display: block;margin: 0 auto;'>确 定</button>" +
        "</div>" +
        "</div>";

    addOverlay();
    addPopover();
    popover.append(html);
    overlay.removeClass("hide");
    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){ // enter 键
            callback();
            destroy();
        }
    };

    $(".dt-btn").on('click', function () {
        callback();
        destroy();
    });

};

/**
 * @method confirm
 */
confirm = function (args) {
    /**
     * @param args {Object} e.g. {message: "你确定？"}
     */
    var title = args.title || null,
        htmlMessage = args.html || null,
        message = args.message || "",
        confirmCb = args.confirmCb || noop,
        cancelCb = args.cancelCb || noop,
        confirmBtn = args.confirmBtn || "确认",
        cancelBtn = args.cancelBtn || "取消";

    var html = "";

    html += '<div class="popover popover-comfirm"><header>';
    if (title !== null) {
        html += '<h2 class="popover-title">';
        html += title;
        html += '</h2>';
    }
    html += '</header><div class="popover-content">';

    if (htmlMessage !== null) {
        html += htmlMessage;
    } else {
        html += '<p class="popover-message">';
        html += message;
        html += '</p>';
    }

    html += '</div><footer><div class="button-cta-group-2 clearfix"><button id="confirmBtn" class="button-cta"><h2>';
    html += confirmBtn;
    html += '</h2></button><button id="cancelBtn" class="button-cta"><h2>';
    html += cancelBtn;
    html += '</h2></button></div></footer></div>';

    addOverlay();
    addPopover();
    popover.append(html);
    overlay.removeClass("hide");

    $("#confirmBtn").on('click', function () {
        confirmCb();
        destroy();
    });

    $("#cancelBtn").on('click', function () {
        cancelCb();
        destroy();
    });
};
/**
 * @method toast
 * 土司效果
 * 调用时传入提示信息参数以： {message:'提示内容'}格式
 */
toast = function(args){
    /**
     * @param args {Object} e.g. {message: "你确定？"}
     */
    var message = args.message || "";
    var div = $("<div class=' popover-toast'>");
    div.append('<div id="floater"></div><p class="popover-message">'+message+'</p>');
    $("body").append(div);

    setTimeout(function () {//动画先将透明度降到0，然后移除
        $('.popover-toast').eq(0).animate({opacity:'0'},"slow").remove();
    }, 3000);

};

/*
 * 加载遮罩效果
 * 调用后记得要移除
 * 使用：popover.loading.show();
 * 移除：popover.loading.hide();
 */
function Loading (){
    this.on = false;
}

loading.show = function (){
    if (!this.on) {
        var load = $("<div class='popover-loading'><div class='load-img'><img src='static/images/loading.gif'/> <p class='load-msg'>请等待...</p></div></div>");
        /*load.css({'position':'fixed','left':0,'top':0,'z-index':'100','width':'100%','height':'100%','background': '#8a8787', 'opacity': '.6',
         'vertical-align': 'middle','text-align':'center','font-size':'1.2rem'});*/
        $("body").append(load);
        this.on = true;
    };
}

loading.hide = function (){
    var load;
    if (this.on) {
        load = $(".popover-loading");
        load.remove();
        this.on = false;
    };
}

module.exports = {
    alert: alert,
    confirm: confirm,
    toast: toast,
    loading:loading
};
