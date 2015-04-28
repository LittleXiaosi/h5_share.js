/* 分享功能 */
(function() {
    setTimeout(function() {

        var shareConfig = {
            img_url: "#link('../tdimage/share.png')",               //分享的小图标地址
            link: 'http://m.ac.qq.com/H5Event/AppQd/tDrotate',      //分享链接地址，常用window.location.href
            title: '签到送海贼王限量手办',                            //分享的标题（ps：在微信朋友圈分享只会显示标题，没有详情）
            desc: '海贼手办华丽登场，4.13一起来抢！',                  //分享的详情文案
            callback: 'onAppShare'                                  //分享之后的成功的回调函数
        }

        //腾讯动漫android app 分享设置
        if (window.navigator.userAgent.indexOf('QQAC_Client_Android') >= 0) {
            var isNewVersion = function() {
                var ret = prompt("isAppLogin");
                return (ret && ret == "updatedVersion") ? true : false;
            }
            var _share = function() {
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
            }

            window.appShare = _share;

        } else {
            // 自定义微信分享内容
            function initWxShare(shareContent) {
                var _share = function() {
                    try {
                        // 分享到朋友圈
                        WeixinJSBridge.on('menu:share:timeline', function(argv) {
                            WeixinJSBridge.invoke('shareTimeline', shareContent, function(res) {
                            });
                        });
                        // 发送给好友
                        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                            WeixinJSBridge.invoke('sendAppMessage', shareContent, function(res) {
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

            // 调用微信分享
            initWxShare({
                "img_url": shareConfig.img_url,
                "img_width": 120,
                "img_height": 120,
                "link": shareConfig.link,
                "desc": shareConfig.desc,
                "title": shareConfig.title
            });

            //手Q分享：（ps：但是这种使用方式似乎没什么用）
            var QQscript = document.createElement('script');
            QQscript.setAttribute('type', 'text/javascript');
            QQscript.src = 'http://pub.idqqimg.com/qqmobile/qqapi.js';
            document.onload = function() {
                document.body.appendChild(QQscript);
            }
            QQscript.onload = function() {
                window.mqq.data.setShareInfo({
                    "share_url": shareConfig.link,
                    "title": shareConfig.title,
                    "desc": shareConfig.desc,
                    "image_url": shareConfig.img_url
                });

            }

            /**
             * 手Q分享需要把以下的meta粘贴到页面头部
             * */
            //<meta name="description" itemprop="description" content="校园领袖招募ing，加入腾讯，成就梦想！">
            //<meta itemprop="name" content="腾讯校园领袖招募">
            //<meta itemprop="image" content="http://qzonestyle.gtimg.cn/qz-act/vip/20140623-school/img/weibo120.jpg">
        }
    }, 1000);
})();