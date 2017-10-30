import axios from 'axios';
import Qs from 'qs';
const DEV_BASE_URL = "/api";
const PROD_BASE_URL = '';
const host = process.env.NODE_ENV === 'production' ? PROD_BASE_URL : DEV_BASE_URL
export default {
    getUserBasicInfo: function(data) {
        var url = host + "/uploadUserBasicInfo/u/" + data;
        return axios.get(url)
    },
    getRegisterInfo: function(data) {
        var url = host + '/stripePlan/directRegisterGroup';
        return axios.post(url, data)
    },
    getEventInfo: function(data) {
        var url = host + '/Activity/acFullInfo/' + data;
        return axios.get(url)
    },
    getUserInfo: function(data) {
        var url = host + '/uploadUserBasicInfo/u/' + data;
        return axios.get(url)
    },
    getGroupAllInfo: function(data) {
        var url = host + '/IM/group/user/query/groupAllInfo/' + data
        return axios.get(url)
    },
    post: function(url, data) {
        let config = {
            //请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
            url: url,

            // 请求方法同上
            method: 'post', // default
            // 基础url前缀
            baseURL: 'https://www.chumi.co',

            transformRequest: [function(data) {
                // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
                data = Qs.stringify({});
                return data;
            }],

            transformResponse: [function(data) {
                // 这里提前处理返回的数据

                return data;
            }],

            // 请求头信息
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            //parameter参数
            params: {
                timestamp: Date.parse(new Date()) / 1000
            },

            //post参数，使用axios.post(url,{},config);如果没有额外的也必须要用一个空对象，否则会报错
            data: data,

            //设置超时时间
            timeout: 5000,
            //返回数据类型
            responseType: 'json', // default
        }
        return axios.post(url, data, this.config)
    },
    get: function(url, data) {
        let config = {
            //请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
            url: url,

            // 请求方法同上
            method: 'get', // default
            // 基础url前缀
            baseURL: 'https://www.chumi.co',

            transformRequest: [function(data) {
                // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
                data = Qs.stringify({});
                return data;
            }],

            transformResponse: [function(data) {
                // 这里提前处理返回的数据

                return data;
            }],

            // 请求头信息
            headers: {
                /*  'X-Requested-With': 'XMLHttpRequest',*/
                /*   'Access-Control-Allow-Origin':'*'*/
            },

            //parameter参数
            params: {},

            //post参数，使用axios.post(url,{},config);如果没有额外的也必须要用一个空对象，否则会报错
            data: data,

            //设置超时时间
            timeout: 5000,
            //返回数据类型
            responseType: 'json', // default
        }
        return axios.get(url, config)
    }
}