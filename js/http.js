function $http(params) {
	mui.ajax('http://211.149.179.254:7001' + params.url, {
		data: params.data || {},
		dataType: 'JSON',
		type: params.type || 'post',
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json'
		},
		success: function(resStr) {
			try {
				var res = JSON.parse(resStr);
				if(res.code == 10000) {
					params.success(res)
				}else {
					plus.nativeUI.toast('异常状态：' + res.code);
				}
			}
			catch(err) {
				throw new Error(err);
				plus.nativeUI.toast('500 error 数据返回异常');
			}
		},
		error: params.error || function(error) {
			plus.nativeUI.toast('http请求异常');
		}
	})
}
