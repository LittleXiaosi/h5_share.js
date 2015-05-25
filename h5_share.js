/* 分享功能 */
(function () {
    var shareConfig = window.shareConfig || {
            img_url: "http://q2.qlogo.cn/g?b=qq&k=PnQ8d2G4321anC3eN5seSw&s=160",    //分享的小图标地址
            link: window.location.href,                                             //分享链接地址，常用window.location.href
            title: document.title || '分享标题',                                    //分享的标题
            desc: '分享详情',                                                       //分享的详情文案（PS: 在微信朋友圈分享只会显示标题，没有详情）
            callback: 'onAppShare'                                                  //分享之后的成功的回调函数（PS: 在iOS QQ中不会调用）
        };

    window.onAppShare = window.onAppShare || function (ret) {
        console.log('onAppShare: ' + ret);
    };

    var UA = window.navigator.userAgent;

    //腾讯动漫Android APP分享配置
    if (/(^| )QQAC_Client_Android( |\/|$)/i.test(UA)) {
        var isNewVersion = function () {
            var ret = prompt("isAppLogin");
            return (ret && ret == "updatedVersion") ? true : false;
        }
        var _share = function () {
            var jsonOld = {
                "callback": shareConfig.callback ? shareConfig.callback : "",
                "imgurl": shareConfig.img_url,
                "title": shareConfig.title,
                "content": shareConfig.desc,
                "pageurl": shareConfig.link
            }

            if (!isNewVersion()) {
                prompt("appShare", JSON.stringify(jsonOld));
                return;
            }
            var jsonNew = {
                "interface": "appShare",
                "callback": shareConfig.callback ? shareConfig.callback : "",
                data: {
                    "imgurl": shareConfig.img_url,
                    "title": shareConfig.title,
                    "content": shareConfig.desc,
                    "pageurl": shareConfig.link
                }
            };
            return prompt(JSON.stringify(jsonNew));
        };

        window.appShare = _share;

    } else if (/(^| )MicroMessenger( |\/|$)/i.test(UA)) {
        // 自定义微信分享内容
        function initWxShare(shareContent) {
            var callback = window[shareContent.callback];
            var _share = function () {
                //console.log('shareContent: %s\ntypeof(callback): %s', JSON.stringify(shareContent), typeof(callback));
                try {
                    // 分享到朋友圈
                    WeixinJSBridge.on('menu:share:timeline', function (argv) {
                        WeixinJSBridge.invoke('shareTimeline', shareContent, function (res) {
                            if (typeof(callback) == 'function') {
                                callback(res);
                            }
                        });
                    });
                    // 发送给好友
                    WeixinJSBridge.on('menu:share:appmessage', function (argv) {
                        WeixinJSBridge.invoke('sendAppMessage', shareContent, function (res) {
                            if (typeof(callback) == 'function') {
                                callback(res);
                            }
                        });
                    });
                } catch (e) {
                    // do nothing
                }
            }
            if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
                _share();
            } else {
                if (document.addEventListener) {
                    document.addEventListener("WeixinJSBridgeReady", _share, false);
                } else if (document.attachEvent) {
                    document.attachEvent("WeixinJSBridgeReady", _share);
                    document.attachEvent("onWeixinJSBridgeReady", _share);
                }
            }
        }

        // 微信分享配置
        initWxShare({
            "img_url": shareConfig.img_url,
            "img_width": 120,
            "img_height": 120,
            "link": shareConfig.link,
            "desc": shareConfig.desc,
            "title": shareConfig.title,
            "callback": shareConfig.callback
        });
    } else if (/(^| )QQ( |\/|$)/i.test(UA)) {
        //手Q分享配置：（PS：这种方式在发给QQ好友时可能会失效，还是需要配置meta，且从微信发给QQ好友时meta也没救了……）
        var QQscript = document.createElement('script');
        QQscript.setAttribute('type', 'text/javascript');
        QQscript.src = 'http://pub.idqqimg.com/qqmobile/qqapi.js';
        window.addEventListener('load', function () {
            document.body.appendChild(QQscript);
        });
        QQscript.onload = function () {
            window.mqq && window.mqq.data && window.mqq.data.setShareInfo &&
            window.mqq.data.setShareInfo({
                    "share_url": shareConfig.link,
                    "title": shareConfig.title,
                    "desc": shareConfig.desc,
                    "image_url": shareConfig.img_url
                },
                shareConfig.callback
            );
        };
        /*
         手Q分享meta格式：
         <meta name="description" itemprop="description" content="分享标题"/>
         <meta itemprop="name" content="分享简介"/>
         <meta itemprop="image" content="分享预览图"/>
         */
    }
})();