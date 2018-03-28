document.write('<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');
function wxapi() {
    this.shareData = {
        shareImageUrl: "",
        shareLink: window.location.href,
        shareTitle: "",
        shareContent: "",
        shareContentTimeline: ""
    };
    this.host = '';
    /**
     * 分享结果状态 cancel confirm/ok
     */
    this.shareStatus = '';
    /**
     * 分享类型 0:未知 1:给朋友 2:到朋友圈
     */
    this.shareType = '0';
    /**
     * 平台id
     */
    this.mchid = '100000';
    /**
     * 业务模块 event repast wedding page archive trafficSearch
     */
    this.item = 'page';
    /**
     * 业务模块数据id
     */
    this.itemId = '0';
    this.network = 'unknow';
    this.isSign = false;
    this.wx_uid = 0;
    this.usr_id = 0;
    this.uploadImageKey = 0;
    this.uploadImageWidth = 100;
    this.uploadImageHeigth = 100;
    this.uploadImages = [];
    //初始化
    this.debug = false;
    this.initializing = false;
    this.isReady = false;//是否就绪
    this.useAble = true;//是否可用
    //配置初始化
    this.config = function (params, callback) {
        var self = this;
        wx.config({
            debug: false,
            appId: params.appid,
            timestamp: params.timestamp,
            nonceStr: params.noncestr,
            signature: params.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard', 'chooseWXPay']
        });
        wx.ready(function () {
            self.isReady = true;
            callback && callback();
        });
    };
    //检查sdk是否可用
    this.checkUseable = function () {
        var self = this;
        if (!this.isReady) {
            this.init({
                mchid: self.mchid,
                usr_id: self.usr_id,
                ready: function () {
                    self.isReady = true;
                },
                error: function () {
                    self.useAble = false;
                }
            });
            if (this.debug) {
                alert('微信组件尚未就绪,请稍后重试');
            }
            return false;
        }
        if (!this.useAble) {
            this.init({
                mchid: self.mchid,
                usr_id: self.usr_id,
                ready: function () {
                    self.isReady = true;
                },
                error: function () {
                    self.useAble = false;
                }
            });
            if (this.debug) {
                alert('微信组件不可用,请刷新页面重试');
            }
            return false;
        }
        return true;
    }
    //获取ticket进行配置
    this.getTicket = function (callback) {
        if (this.initializing) {
            return;
        }
        var self = this;
        //获取JSSDK TICKET
        this.initializing = true;
        //初始化
        $.ajax({
            url: this.host + '/platform/share/ticket/',
            dataType: 'json',
            method: 'get',
            data: {
                mchid: this.mchid
            },
            success: function (json) {
                if (json.status) {
                    var params = {
                        appid: json.data.appid,
                        timestamp: json.data.timestamp,
                        noncestr: json.data.noncestr,
                        signature: json.data.signature
                    }
                    self.config(params, function () {
                        callback && callback();
                    });
					console.log('ok');
                } else {
                    self.useAble = false;
                    console.log('jssdk校验失败:' + json.msg);
                    callback && callback();
                }
            },
            error: function () {
                self.useAble = false;
                console.log('微信组件初始化失败,请刷新页面重试');
                callback && callback();
            },
            complete: function () {
                self.initializing = false;
            }
        });
    }
    //已弃用,保留以兼容老版本调用
    this.configInit = function () {
        this.init({
            mchid: this.mchid,
            usr_id: this.usr_id,
            ready: function () {

            },
            error: function () {

            }
        });
    };
    //已弃用,保留以兼容老版本调用
    this.ready = function (callback) {
        var self = this;
        if (this.checkUseable()) {
            callback && callback();
        } else {
            this.init({
                mchid: self.mchid,
                usr_id: self.usr_id,
                ready: function () {
                    callback && callback();
                },
                error: function (msg) {
                    alert('微信组件不可用,请刷新重试:' + msg);
                }
            });
        }
    };
    //外部调用初始化
    this.init = function (params) {
        this.mchid = params.mchid || this.mchid;
        this.usr_id = params.usr_id || this.usr_id;
        this.initParams = params;
        var self = this;
        if (this.isReady) {
            self.initParams.ready && self.initParams.ready();
        } else {
            this.getTicket(function () {
                wx.ready(function () {
                    self.initParams.ready && self.initParams.ready();
                });
                wx.error(function (res) {
                    self.useAble = false;
                    self.initParams.error && self.initParams.error('jssdk初始化失败:' + res.errMsg);
                });
            });
        }
    }

    var startRecordTimestamp;
    var endRecordTimestamp;
    /**
     * 开始录音
     * @param callback
     */
    this.startRecord = function (callback) {
        if (!this.checkUseable()) {
            alert('录音功能不可用,请稍后重试');
        } else {
            var self = this;
            startRecordTimestamp = new Date().getTime();
            wx.startRecord();
            wx.onVoiceRecordEnd({
                //录音时间超过一分钟没有停止的时候会执行 complete 回调
                complete: function (res) {
                    endRecordTimestamp = new Date().getTime();
                    var localId = res.localId;
                    self.uploadVoice(localId, function (data) {
                        callback && callback(data);
                    });
                    //callback(localId);
                }
            })
        }
    };
    /**
     * 停止录音
     * @param callback
     */
    this.stopRecord = function (callback) {
        var self = this;
        wx.stopRecord({
            success: function (res) {
                endRecordTimestamp = new Date().getTime();
                var localId = res.localId;
                self.uploadVoice(localId, function (data) {
                    callback && callback(data);
                });
            }
        });
    };
    this.playVoice = function (localId, callback) {
        if (!this.checkUseable()) {
            alert('录音功能不可用,请稍后重试');
        } else {
            wx.playVoice({
                localId: localId
            });
            wx.onVoicePlayEnd({
                success: function (res) {
                    callback(localId);
                }
            });
        }
    };
    this.pauseVoice = function (localId) {
        wx.pauseVoice({
            localId: localId
        });
    };
    this.stopVoice = function (localId) {
        wx.stopVoice({
            localId: localId
        });
    };
    this.uploadVoice = function (localId, callback) {
        var self = this;
        var voiceText = '';
        wx.translateVoice({
            localId: localId,
            isShowProgressTips: 0,
            success: function (res) {
                voiceText = res.translateResult;
            }
        });
        wx.uploadVoice({
            localId: localId,
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                var serverId = res.serverId; // 返回音频的服务器端ID
                self.uploading();
                //初始化
                $.ajax({
                    url: self.host + '/common/upload/wx_voice_save/',
                    dataType: 'json',
                    method: 'post',
                    data: {
                        mch: self.mchid,
                        media: serverId,
                    },
                    success: function (json) {
                        json.data.time = (endRecordTimestamp - startRecordTimestamp) / 1000;
                        json.data.text = voiceText;
                        callback && callback({errCode: json.errCode, data: json.data, message: json.message});
                    },
                    error: function () {
                        callback && callback({errCode: 500, data: [], message: '音频文件保存失败,请重试'});
                    },
                    complete: function () {
                        self.uploadingComplate();
                    }
                });
            }
        });
    };
    /**
     * 获取访客的地图坐标信息
     */
    this.getLocation = function (callback) {
        if (!this.checkUseable()) {
            alert('暂时无法获取坐标信息,请重试');
        } else {
            wx.getLocation({
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                    callback && callback(res);
                }
            });
        }
    };
    /**
     * 在地图上标注指定位置
     */
    this.openLocation = function (data) {
        if (!this.checkUseable()) {
            alert('暂时无法打开地图组件,请重试');
        } else {
            wx.openLocation({
                latitude: data.latitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: data.longitude, // 经度，浮点数，范围为180 ~ -180。
                name: data.name, // 位置名
                address: data.address, // 地址详情说明
                scale: 15, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: data.infoUrl // 在查看位置界面底部显示的超链接,可点击跳转
            });
        }
    }
    /**
     * 分享初始化
     * @returns {object}
     */
    this.shareInit = function () {
        this.shareData.shareContentTimeline = this.shareData.shareContentTimeline || this.shareData.shareContent;
        var self = this;
        this.init({
            mchid: this.mchid,
            usr_id: this.usr_id,
            ready: function () {
                wx.hideMenuItems({
                    menuList: ["menuItem:setFont", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:originPage"] // 要隐藏的菜单项，所有menu项见附录3
                });
                wx.showMenuItems({
                    menuList: ["menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:favorite"] // 要显示的菜单项，所有menu项见附录3
                });
                //分享给好友
                wx.onMenuShareAppMessage({
                    title: self.shareData.shareTitle,
                    desc: self.shareData.shareContent,
                    link: self.shareData.shareLink,
                    imgUrl: self.shareData.shareImageUrl,
                    type: '', //分享类型,music、video或link，不填默认为link
                    dataUrl: '', //如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        self.shareStatus = 'ok';
                        self.saveShare(1, self.shareData.shareLink);
                    },
                    cancel: function () {
                        self.shareStatus = 'cancel';
                    },
                    complete: function () {
                        self.shareType = 1;
                        self._shareCallback();
                    },
                    trigger: function () {
                        this.title = self.shareData.shareTitle;
                        this.desc = self.shareData.shareContent;
                        this.link = self.shareData.shareLink;
                        this.imgUrl = self.shareData.shareImageUrl;
                    }
                });
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: self.shareData.shareContentTimeline, // 分享标题
                    link: self.shareData.shareLink, // 分享链接
                    imgUrl: self.shareData.shareImageUrl, // 分享图标
                    success: function () {
                        self.shareStatus = 'ok';
                        self.saveShare(2, self.shareData.shareLink);
                    },
                    cancel: function () {
                        self.shareStatus = 'cancel';
                    },
                    complete: function () {
                        self.shareType = 2;
                        self._shareCallback();
                    },
                    trigger: function () {
                        this.title = self.shareData.shareContentTimeline;
                        this.link = self.shareData.shareLink;
                        this.imgUrl = self.shareData.shareImageUrl;
                    }
                });
                //分享给qq好友
                wx.onMenuShareQQ({
                    title: self.shareData.shareTitle,
                    desc: self.shareData.shareContent,
                    link: self.shareData.shareLink,
                    imgUrl: self.shareData.shareImageUrl,
                    success: function () {
                        self.shareStatus = 'ok';
                        self.saveShare(4, self.shareData.shareLink);
                    },
                    cancel: function () {
                        self.shareStatus = 'cancel';
                    },
                    complete: function () {
                        self.shareType = 4;
                        self._shareCallback();
                    },
                    trigger: function () {
                        this.title = self.shareData.shareTitle;
                        this.desc = self.shareData.shareContent;
                        this.link = self.shareData.shareLink;
                        this.imgUrl = self.shareData.shareImageUrl;
                    }

                });
                //分享到腾讯微博
                wx.onMenuShareWeibo({
                    title: self.shareData.shareTitle,
                    desc: self.shareData.shareContent,
                    link: self.shareData.shareLink,
                    imgUrl: self.shareData.shareImageUrl,
                    success: function () {
                        self.shareStatus = 'ok';
                        self.saveShare(3, self.shareData.shareLink);
                    },
                    cancel: function () {
                        self.shareStatus = 'cancel';
                    },
                    complete: function () {
                        self.shareType = 3;
                        self._shareCallback();
                    },
                    trigger: function () {
                        this.title = self.shareData.shareTitle;
                        this.desc = self.shareData.shareContent;
                        this.link = self.shareData.shareLink;
                        this.imgUrl = self.shareData.shareImageUrl;
                    }
                });
            },
            error: function () {
                alert('微信分享不可用,请刷新重试');
            }
        });
    };
    /**
     *设置分享标题
     */
    this.setShareTitle = function (content) {
        this.shareData.shareTitle = content || this.shareData.shareTitle;
    }
    /**
     *设置分享内容
     */
    this.setShareContent = function (content) {
        this.shareData.shareContentTimeline = content || this.shareData.shareContentTimeline;
        this.shareData.shareContent = content || this.shareData.shareContent;
    }
    /**
     *设置分享链接
     */
    this.setShareLink = function (content) {
        this.shareData.shareLink = content || this.shareData.shareLink;
    }
    /**
     *设置分享图片URL
     */
    this.setShareImageurl = function (content) {
        this.shareData.shareImageUrl = content || this.shareData.shareImageUrl;
    }
    /**
     * 保存分享记录
     * @param {int} type 分享类型 1:给朋友 2:朋友圈
     * @param {string} url 分享的链接地址
     * @returns {undefined}
     */
    this.saveShare = function (type, url) {
        $.ajax({
            url: this.host + '/platform/share/save/',
            dataType: 'json',
            method: 'post',
            data: {
                mchid: this.mchid,
                share_type: type,
                share_url: url,
                item: this.item,
                item_id: this.itemId,
                wx_uid: this.wx_uid,
                usr_id: this.usr_id,
                channel: 'WX'
            },
            success: function (json) {
                return json.status;
            },
            error: function () {
            },
            complete: function () {
            }
        });
    };
    /**
     * 使用微信原生方式预览图片 全局
     * @returns {undefined}
     */
    this.imagePreview = function () {
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            var srcList = [];
            $.each($('img'), function (i, item) {
                if (item.src) {
                    srcList.push(item.src);
                    $(item).click(function (e) {
                        WeixinJSBridge.invoke("imagePreview", {
                            "urls": srcList,
                            "current": this.src
                        });
                    });
                }
            });
        });
    };
    this.nativePreview = function (srcList) {
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            $.each($('.nativePreview'), function (i, item) {
                $(item).click(function (e) {
                    WeixinJSBridge.invoke("imagePreview", {
                        "urls": srcList,
                        "current": this.url
                    });
                });
            });
        });
    };
    /**
     * 图片预览 传参
     * @param {type} cls
     * @returns {undefined}
     */
    this.imagePreviewGroup = function (cls) {
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            if (!cls) {
                cls = 'nativeImagePreview';
            }
            var srcList = [];
            var list = $('.' + cls);
            $.each($('.' + cls), function (j, obj) {
                srcList[j] = [];
                $.each($('.' + cls).eq(j).find('img'), function (i, item) {
                    if (item.src) {
                        srcList[j].push(item.alt);
                        $(item).click(function (e) {
                            WeixinJSBridge.invoke("imagePreview", {
                                "urls": srcList[j],
                                "current": this.alt
                            });
                        });
                    }
                });
            });
        });
    };
    /**
     * 隐藏底部工具条
     * @returns {undefined}
     */
    this.hideBottomTool = function () {
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            WeixinJSBridge.call('hideToolbar');
        });
    };
    /**
     * 隐藏右上角工具条
     * @returns {undefined}
     */
    this.hideTopTool = function () {
        wx.hideOptionMenu();
    };
    /**
     * 显示右上角工具条
     * @returns {undefined}
     */
    this.showTopTool = function () {
        wx.showOptionMenu();
    };
    /**
     * 领取卡券
     * @param {type} cardId
     */
    this.addCard = function (cardId, cardExt, success) {
        if (!this.checkUseable()) {
            alert('卡券功能不可用,请稍后重试');
        } else {
            wx.addCard({
                cardList: [{
                    cardId: cardId,
                    cardExt: cardExt
                }], // 需要添加的卡券列表
                success: function (res) {
                    var cardList = res.cardList; //添加的卡券列表信息
                    success && success.apply(this, arguments);
                }
            });
        }
    }
    /**
     * 扫描二维码
     * @returns {undefined}
     */
    this.scanQrcode = function (type, success) {
        var type = type || 0;
        wx.scanQRCode({
            desc: '请扫描二维码',
            needResult: type, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                success && success.apply(this, arguments);
            }
        });
    };
    //上传图片
    this.chooseImage = function (count, callback) {
        if (!this.checkUseable()) {
            alert('暂时无法上传图片,请稍后重试');
        } else {
            wx.chooseImage({
                count: count, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    callback && callback(localIds);
                }
            });
        }
    };
    this.uploadImage = function (ids, callback) {
        this.uploadingImage();
        var _this = this;
        this.uploadImageToOss(ids, function (result) {
            _this.uploadImageComplate();
            callback && callback(result);
        });
    }
    this.uploadImageToOss = function (ids, callback) {
        if (this.uploadImages.length == ids.length) {
            callback && callback({errCode: 0, data: this.uploadImages, message: 'success'});
        } else {
            var _this = this;
            wx.uploadImage({
                localId: ids[this.uploadImageKey], // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    //初始化
                    $.ajax({
                        url: _this.host + '/common/upload/wx_image_save/',
                        dataType: 'json',
                        method: 'post',
                        data: {
                            mch: _this.mchid,
                            media: serverId,
                            w: _this.uploadImageWidth,
                            h: _this.uploadImageHeigth
                        },
                        success: function (json) {
                            _this.uploadImageKey = parseInt(_this.uploadImageKey) + 1;
                            if (!json.errCode) {
                                _this.uploadImages.push(json.data);
                                _this.uploadImageToOss(ids, callback);
                            } else {
                                callback && callback({errCode: json.errCode, data: [], message: json.message});
                            }
                        },
                        error: function () {

                        },
                        complete: function () {

                        }
                    });
                }
            });
        }
    }
    /**
     * 关闭当前窗口
     * @returns {undefined}
     */
    this.closeWindow = function () {
        WeixinJSBridge.call('closeWindow');
    };
    /**
     * 获取网络状态
     */
    this.getNetwork = function (callback) {
        wx.getNetworkType({
            success: function (res) {
                var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
                callback && callback(networkType);
            }
        });
    };
    this.callback = function () {
    };
    this._shareCallback = function () {
        var res = {
            status: 'success',
            shareType: this.shareType,
            success: true
        };
        if (this.shareStatus == 'cancel') {
            res.status = 'fail';
            res.success = false;
        }
        this.shareCallback(res);
    };
    this.shareCallback = function (res) {
    };
    this.uploading = function () {
    };
    this.uploadingComplate = function () {
    };
    this.error = function (res) {
    }
    this.uploadingImage = function () {
    };
    this.uploadImageComplate = function () {
    };
}