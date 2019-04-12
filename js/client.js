//导入状态管理器
var websocket = null;
var readfunc = null;
var kickoutfunc = null;
var closefunc = null;
var connect = false;
var connect_time = null;
var g_url = null;
var g_heartbeat = 0 // 心跳类型
var g_gamestart = 1 // 开始游戏
var g_gameend = 2 // 游戏结果
var g_kickout = 3 // 踢出用户
var g_close = 4 // 服务重启，关闭
var g_add = 5  //用户上线
var time
var In_it = null
var gameend = null //游戏完成结果回调
var addpeople = null // 用户上线
var kickout = null // 踢出用户
var serverclose = null //服务重启关闭

/*
*注册回调函数
*参数说明:
*@param:funcAddpeople       用户上线消息通知回调,函数形式function(data)
*@param:funcGameend         游戏完成结果通知回调，函数形式function(data)
*@param:funcKickout         踢出用户通知回调，函数形式function()
*@param:funcServerclose     服务器重启关机回调，函数形式function()
*/
function RegisterCallBackFunc(funcAddpeople,funcGameend,funcKickout,funcServerclose){
    addpeople = funcAddpeople;
    gameend = funcGameend;
    kickout = funcKickout;
    serverclose = funcServerclose;
}

function WebSocketStart(url) {
    console.log(url);
    if ("WebSocket" in window) {
        g_url = url;
        websocket = new WebSocket(url);
        websocket.onopen = function () {
            console.log("打开成功");
            if (connect_time != null) {
                clearInterval(connect_time);
            }
            connect = true;
            var json = {};
            json.Type = g_heartbeat;
            json.Body = "heart beat"
            json.Time = Date.parse(new Date()) / 1000;
            var data = JSON.stringify(json)
            time = setInterval(function () {
                console.log(data)
                websocket.send(data);
            }, 5 * 1000)

            // message事件在接收到消息时触发，对应于该事件的回调函数是onmessage。
            websocket.onmessage = function (evt) {
                var msg = JSON.parse(evt.data);
                console.log(msg)
                if (msg.Type == g_gameend) {
                    // 游戏结果
                    if (gameend!=null){
                        gameend(msg.Body);
                    }
                }
                if (msg.Type == g_add) {
                    // 用户上线
                    if (addpeople!=null){
                        addpeople(msg.Body);
                    }
                }
                // 踢出用户
                if (msg.Type == g_kickout) {
                    connect = false
                    clearInterval(time);
                    websocket.close();
                    if (kickout!=null){
                        kickout();
                    }
                    
                }
                // 服务重启
                if (msg.Type == g_close) {
                    connect = false
                    clearInterval(time);
                    websocket.close();
                    if (serverclose!=null){
                        serverclose();
                    }
                }
            };
            // close事件的回调函数是onclose
            websocket.onclose = function () {
                websocket.close();
                clearInterval(time);
                if (connect) {
                    console.log("重连");
                    reconnectServer();
                }

            }
        }

    }
    else {
        alert("您的浏览器不支持部分功能，请下载新版360 QQ等浏览器！");
    }
}


function close() {
    if (websocket != null) {
        clearInterval(time)
        readfunc = null
        websocket.close()
        // Vue.prototype.Out = true
    }
}


function reconnectServer() {
    //从新连接
    connect_time = setInterval(function () {
        WebSocketStart(g_url)
    }, 30 * 1000)
}

