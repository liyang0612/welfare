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
				params.success(res)
				
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

function cardConfig(name) {
	var cardObj = {
		"工商银行": 'icbc',
		"中国农业银行": 'abc',
		"中国银行": 'boc',
		"中国建设银行": 'ccb',
		"中国邮政储蓄银行": 'psbc',
		"招商银行": 'cmb',
		"交通银行": 'bocom',
		"成都银行": 'bocd',
		"兴业银行": 'cib',
		"浦发银行": 'spdb',
		"中信银行": 'citic'
	};
	if(!cardObj[name]) return 'unionpay';
	return cardObj[name];
}
