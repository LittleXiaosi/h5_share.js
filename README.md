# h5_share.js

## 作用
1. 设置“微信”分享信息
2. 设置“手Q”分享信息
3. 设置“腾讯动漫android app”分享信息

## 使用方式

```js
 var shareConfig = {
            img_url: "#link('../tdimage/share.png')",               //分享的小图标地址
            link: 'http://m.ac.qq.com/H5Event/AppQd/tDrotate',      //分享链接地址，常用window.location.href
            title: '签到送海贼王限量手办',                            //分享的标题（ps：在微信朋友圈分享只会显示标题，没有详情）
            desc: '海贼手办华丽登场，4.13一起来抢！',                  //分享的详情文案
            callback: 'onAppShare'                                  //分享之后的成功的回调函数
        }
        
```


