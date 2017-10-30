/**
 * Created by wangyonghao on 2017/5/16.
 */

function onError(errorCode, message) {
    var info = '';
    switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时';
            break;
        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = '未知错误';
            break;
        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = '在黑名单中，无法向对方发送消息';
            break;
        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info = '不在讨论组中';
            break;
        case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info = '不在群组中';
            break;
        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = '不在聊天室中';
            break;
        default:
            info = errorCode;
            break;
    }
    alert('发送失败' + info);
}


export default {
    lastMessage: function(lastMessage) {
        let sendId = lastMessage.senderUserId;
        let content;
        switch (lastMessage.messageType) {
            case "TextMessage":
                content = lastMessage.content.content;
                break;
            case "VoiceMessage":
                content = '一条语音消息';
                break;
            case "ImageMessage":
                content = '一张图片';
                break;
            case "FileMessage":
                content = '一个文件';
                break;
            case "DiscussionNotificationMessage":
                if (lastMessage.content.type == 1) {
                    content = '新加入成员：' + lastMessage.content.extension;
                } else {
                    content = '一条讨论组信息';
                }
                break;
            default:
                content = "";
        }
        return sendId + "：" + content;
    },
    chatTitle: function(type, name) {
        let typeName = '私聊';
        switch (type) {
            case 1:
                break;
            case 2:
                typeName = '讨论组';
                break;
            case 3:
                typeName = '群聊';
                break;
            case 4:
                typeName = '聊天室';
                break;
        }
        return typeName + "：" + name;
    },
    message: function(message) {
        var message = {
            text: '未知消息',
            type: message.messageType
        }
        switch (message.messageType) {
            case "TextMessage":
                message.text = message.content.content;
                break;
            case "VoiceMessage":
                message.text = '点击播放语音消息';
                message.content = message.content.content;
                message.duration = message.content.duration;
                break;
            case "ImageMessage":
                message.text = message.content.content;
                message.src = message.content.imageUri;
                break;
            case "FileMessage":
                message.fileUrl = message.content.fileUrl;
                message.text = message.content.name;
                break;
            default:
        }
        return message;
    },
    sendMessage: function(conversationType, targetId, msg, callback) {
        RongIMLib.RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
            onSuccess: callback,
            onError: onError
        })
    }
}