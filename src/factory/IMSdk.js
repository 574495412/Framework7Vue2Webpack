/**
 * Created by wangyonghao on 2017/5/16.
 */
export default {
    init: function() {
        window.localStorage.appKey = 'c9kqb3rdki5pj';
        var appKey = window.localStorage.appKey;
        console.log(appKey)
        RongIMLib.RongIMClient.init(appKey);
        /*        RongIMLib.RongIMVoice.init();
                RongIMLib.RongIMEmoji.init();*/
    },
    listen: function(messageCallback) {
        RongIMLib.RongIMClient.setConnectionStatusListener({
            onChanged: function(status) {
                switch (status) {
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功');
                        break;
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        break;
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        console.log('其他设备登录');
                        break;
                    case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                        console.log('域名不正确');
                        break;
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用');
                        break;
                }
            }
        });
        receiveMessageListener(messageCallback);
    },
    connect: function(connectCallback) {
        connectClient(connectCallback);
    },
    create: function(messageCallback, connectCallback) {
        this.init();
        this.listen(messageCallback);
        this.connect(connectCallback);
    },
    conversationList: getConversationList,
    historyMessages: getHistoryMessage,
    playVoice: playVoice,
    discussionCreate: discussionCreate,
    discusstionAdd: discusstionAdd,
    discusstionDetail: discusstionDetail,
    discusstionQuit: discusstionQuit,
    discusstionRevise: discusstionRevise,
    chatRoomJoin: chatRoomJoin,
    chatRoomQuit: chatRoomQuit,
    charRoomDetail: charRoomDetail,
    removeConversation: removeConversation,
    clearConversations: clearConversations,
    getTotoalUnreadCount: getTotoalUnreadCount,
    getSelectUnreadCount: getSelectUnreadCount,
    clearUnreadCount: clearUnreadCount,
    addToBlacklist: addToBlacklist,
    clearBlackList: clearBlackList,
    getBlacklistStatus: getBlacklistStatus,
    showBlackList: showBlackList
}


function connectionStatusListener() {
    RongIMLib.RongIMClient.setConnectionStatusListener({
        onChanged: function(status) {
            switch (status) {
                case RongIMLib.ConnectionStatus.CONNECTED:
                    console.log('链接成功');
                    break;
                case RongIMLib.ConnectionStatus.CONNECTING:
                    console.log('正在链接');
                    break;
                case RongIMLib.ConnectionStatus.DISCONNECTED:
                    console.log('断开连接');
                    break;
                case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                    console.log('其他设备登录');
                    break;
                case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                    console.log('域名不正确');
                    break;
                case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                    console.log('网络不可用');
                    break;
            }
        }
    });
}


function receiveMessageListener(messageCallback) {
    RongIMLib.RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function(message) {
            // 判断消息类型
            messageCallback(message);
        }
    });
}


function connectClient(connectCallback) {
    var token = localStorage.getItem('rongCloud_token');
    /*    var token = 'Eic8MfDbHDvwKgr3ZGVEkhDi2DCBp4PoHD1R09vH5X/C5nCKRDPTfxsJiQSXcERWu1lnNQ0Zy6E6fuuvw4u1VgFETSX1nR1ezpgXvGpLcEsJzliUCNFP4g==';*/
    RongIMLib.RongIMClient.connect(token, {
        onSuccess: function(userId) {
            RongIMLib.RongIMClient.getInstance()
            connectCallback(userId);
        },
        onTokenIncorrect: function() {
            console.log('token无效');
        },
        onError: function(errorCode) {
            var info = '';
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                    info = '未知错误';
                    break;
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                    info = '不可接受的协议版本';
                    break;
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                    info = 'appkey不正确';
                    break;
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                    info = '服务器不可用';
                    break;
            }
            console.log(errorCode);
        }
    });
}


function getConversationList(callback) {
    RongIMLib.RongIMClient.getInstance().getConversationList({
        onSuccess: function(list) {
            callback(list);
        },
        onError: function(error) {

        }
    }, null)
}

function getHistoryMessage(conversationType, targetId, timestrap, count, sucFuc) {
    RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
        onSuccess: function(list, hasMsg) {
            sucFuc(list, hasMsg);
        },
        onError: function(error) {
            console.log('GetHistoryMessagesError, Error Code：' + error);
        }
    })
}

function playVoice(audioFile, duration) {
    RongIMClient.RongIMVoice.preLoaded(audioFile, function() {
        RongIMLib.RongIMVoice.play(audioFile, duration);
    });
}


function discussionCreate(discussionName, userIds, sucFuc) {
    RongIMClient.getInstance().createDiscussion(discussionName, userIds, {
        onSuccess: sucFuc,
        onError: function(error) {
            console.log('创建讨论组失败，错误码：' + error);
        }
    })
}

function discusstionAdd(duscussId, userIds, sucFuc) {
    RongIMClient.getInstance().addMemberToDiscussion(duscussId, userIds, {
        onSuccess: sucFuc,
        onError: function(error) {
            console.log('添加成员失败，错误码：' + error);
        }
    })
}

function discusstionDetail(discussId, sucFuc) {
    RongIMClient.getInstance().getDiscussion(discussId, {
        onSuccess: sucFuc,
        onError: function(error) {
            console.log('查看讨论组信息失败，错误码：' + error);
        }
    })
}

function discusstionQuit(discussId, sucFUc) {
    RongIMClient.getInstance().quitDiscussion(discussId, {
        onSuccess: sucFUc,
        onError: function(error) {
            console.log('退出讨论组失败，错误码：' + error);
        }
    })
}

function discusstionRevise(discussId, newName, sucFuc) {
    RongIMClient.getInstance().setDiscussionName(discussId, newName, {
        onSuccess: sucFuc,
        onError: function(error) {
            console.log('修改讨论组名字失败，错误码：' + error);
        }
    })
}


function chatRoomJoin(chatRoomId, count, sucFuc) {
    RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
        onSuccess: sucFuc,
        onError: function(error) {
            console.log('加入聊天室失败，错误码：' + error);
        }
    })
}

function chatRoomQuit(chatRoomid, sucFuc) {
    RongIMClient.getInstance().quitChatRoom(chatRoomid, {
        onSuccess: sucFuc,
        onError: function(error) {
            console.log('退出聊天室失败，错误码：' + error);
        }
    });
}

function charRoomDetail(chatRoomId, count, order, sucFuc) {
    RongIMClient.getInstance().getChatRoomInfo(chatRoomId, count, order, {
        onSuccess: sucFuc,
        onError: function(error) {
            console.log('获取聊天室信息失败，错误码：' + error);
        }
    })
}

function removeConversation(type, id, sucFuc) {
    RongIMClient.getInstance().removeConversation(type, id, {
        onSuccess: function(bool) {
            sucFuc(bool);
        },
        onError: function(error) {
            console.log('删除会话错误，错误码：' + error);
        }
    })
}

function clearConversations(sucFuc) {
    RongIMClient.getInstance().clearConversations({
        onSuccess: function() {
            sucFuc();
        },
        onError: function(error) {
            // error => 清除会话错误码。
        }
    });
}


function getTotoalUnreadCount(callback) {
    RongIMClient.getInstance().getTotoalUnreadCount({
        onSuccess: callback,
        onError: function(error) {
            console.log('获取总未读消息数错误，错误码：' + error);
        }
    })
}

function getSelectUnreadCount(targetId, type, callback) {
    RongIMClient.getInstance().getUnreadCount(type, targetId, {
        onSuccess: callback,
        onError: function(error) {
            console.log('获取指定消息数错误，错误码：' + error);
        }
    })
}

function clearUnreadCount(targetId, type, callback) {
    RongIMClient.getInstance().clearUnreadCount(type, targetId, {
        onSuccess: callback,
        onError: function(error) {
            console.log('清除指定消息数错误，错误码：' + error);
        }
    })
}

function showBlackList(callback) {
    RongIMClient.getInstance().getBlacklist({
        onSuccess: function(list) {
            callback(list);
            // list => 黑名单列表
        },
        onError: function(error) {
            // 获取黑名单失败
        }
    });
}

function addToBlacklist(userId, callback) {
    RongIMClient.getInstance().addToBlacklist(userId, {
        onSuccess: callback,
        onError: function(error) {
            console.log('加入黑名单错误错误，错误码：' + error);
        }
    });
}

function clearBlackList(userId, callback) {
    RongIMClient.getInstance().removeFromBlacklist(userId, {
        onSuccess: callback,
        onError: function(error) {}
    });
}

function getBlacklistStatus(userId, callback) {
    RongIMClient.getInstance().getBlacklistStatus(userId, {
        onSuccess: function(status) {
            callback(status);
        },
        onError: function(error) {}
    });
}