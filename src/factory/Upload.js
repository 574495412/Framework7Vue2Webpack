export default {
    getUploadUrl: getUploadUrl,
    getFileType: getFileType
};

var config = {
    domain: 'http://up.qiniug.com', //境外 http://upload.qiniu.com //境内
    fileType: RongIMLib.FileType.IMAGE,
    getToken: function(callback) {
        RongIMClient.getInstance().getFileToken(this.fileType, {
            onSuccess: function(data) {
                callback(data.token);
            },
            onError: function(error) {

            }
        })
    }
};

var urlItem = {
    file: function(data, fuc) {
        var fileType = RongIMLib.FileType.FILE;
        RongIMClient.getInstance().getFileUrl(fileType, data.filename, data.name, {
            onSuccess: function(result) {
                data.downloadUrl = result.downloadUrl;
                fuc(data);
            },
            onError: function(error) {

            }
        });
    },
    image: function(data, fuc) {
        var fileType = RongIMLib.FileType.IMAGE;
        RongIMClient.getInstance().getFileUrl(fileType, data.filename, null, {
            onSuccess: function(result) {
                data.downloadUrl = result.downloadUrl;
                fuc(data);
            },
            onError: function(error) {

            }
        })
    }
};

var getFileType = function(filename) {
    var imageType = {
        'jpg': 1,
        'png': 2
    };
    var index = filename.lastIndexOf('.') + 1;
    var type = filename.substring(index);
    return type in imageType ? 'image' : 'file';
};


var callback = {
    onError: function(errorCode) {

    },
    onProgress: function(loaded, total) {

    }
};

var initType = {
    file: function(_file, fuc) {
        config.fileType = RongIMLib.FileType.FILE;
        callback.onCompleted = function(data) {
            data.fileType = getFileType(data.name);
            urlItem[data.fileType](data, fuc)
        };
        UploadClient.initFile(config, function(uploadFile) {
            uploadFile.upload(_file, callback);
        });
    },
    image: function(_file, fuc) {
        config.fileType = RongIMLib.FileType.IMAGE;
        callback.onCompleted = function(data) {
            data.fileType = getFileType(data.name);
            urlItem[data.fileType](data, fuc)
        };
        UploadClient.initFile(config, function(uploadFile) {
            uploadFile.upload(_file, callback);
        });
    }
};


function getUploadUrl(file, fuc) {
    initType[getFileType(file.name)](file, fuc);
}