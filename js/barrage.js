	var config = {
    	init_time:'',
    	interval_time:'',
    	line:'',
    	liWidth:'',
    }
	function playBarrage(){
		$('.j_play_barrage').on('click',function(){
			config.init_time = $('.j_init_time').val();
			config.interval_time = $('.j_interval_time').val();
			config.line = $('.j_line').val();
			config.liWidth = $('.j_liWidth').val();
			$('.j_barrage').find('ul').children().remove();
			if(aqueue.length == 0){
				aqueue = bqueue;
				bqueue = [];
			}
			$('.j_barrage').find('ul').children().remove();
			Barrage.danMuPause();
			Barrage.danMuInit(aqueue);
		})
		$('.j_insert_barrage').on('click',function(){
			var content = $('.j_bcontent').val();
			var data = {content:content};
			Barrage.danMuInsert(aqueue,data);
		})
	}
    var bqueue = [
	        
        ]
    
	var Barrage = {
	    left:document.documentElement.clientWidth,
	    translateX:document.documentElement.clientWidth||0,
	    fontSize:'12',
	    color:'#000',
	    line:'',//弹幕所分行数
	    top:[],//弹幕分行时绝对定位top值
	    init_time:'',//弹幕屏内滑动时间
	    interval_time:'',//弹幕每批出现间距时间
	    timeCacluate:'',//弹幕暂停
	    liWidth:'',//强制设置liwidth
	    danMuInit:function(data){
	    	var self = this;
	    	self.top = [];
	    	self.line = parseInt(config.line)||3;
	    	self.init_time = parseInt(config.init_time)||document.documentElement.clientWidth/50;
	    	self.interval_time = parseInt(config.interval_time)||Math.min(self.init_time*1000/2,4200);
	    	for(var i = 0 ;i < self.line;i++){
	    		self.top.push(''+i*30+'px');
	    	};
	    	self.liWidth = parseInt(config.liWidth);
	    	
	    	self.danMuPlay(aqueue);
	    },
	    danMuPlay:function(data){
	        if(typeof(data)=='underined'){return;}
	        var self = this;
	        var strLength = 0;
	        var strWidth = 0;
	        var add_time = 0;//与init_time共同构成行走时间
	        
	        self.timeCacluate = setInterval(function(){
	            var arr = [];
	            for(var x = 0;x<self.top.length&&data.length > 0;x++){                    
	                arr.push('<li data-type="'+data[0].type+'" data-mid="'+data[0].source_id+'" style="position: absolute;left:'+self.left+'px;top:'+self.top[x]+';display: inline-block;white-space: pre;">');
	                arr.push('<img src="'+data[0].img+'" alt="" />');
	                arr.push('<span>'+data[0].content+'</span>');
	                arr.push('</li>');
	                //重复播放时数据填充
	                var t = data.shift();
	                bqueue.push(t);
	                
	            };
	            $('.j_barrage').find('ul').append(arr.join(''));  
	            $('.j_barrage').find('ul span').css('width',''+self.liWidth+'px');   
	            var liWidth = 0;//此li用于非定宽时存储每个li宽度
	            var liLength = $('.j_barrage').find('ul').children().length;

	            for(var j = 0;j < liLength;){                              
	                for(k = 0;k<self.top.length&&j < liLength;k++){         
	                    liWidth = $('.j_barrage').find('li').eq(j).width();
	                    add_time = liWidth/500;
	                    $('.j_barrage').find('li').eq(j).css({
	                        // 'transform':'translateX(-'+(self.left+liWidth+70)+'px)',
	                        '-webkit-transform':'translateX(-'+(self.left+liWidth+170)+'px)',
	                        'left':''+self.left+'px' ,
	                        // 'transition':'transform '+(self.init_time+add_time)+'s linear',
	                        '-webkit-transition':'-webkit-transform '+(self.init_time+add_time)+'s linear'
	                    });
	                    j++;

	                }
	            }      
	            if(data.length == 0){
	                self.danMuPause();
	            } 
	        },self.interval_time)                 
	        
	        
	        self.danMuClear();
	        
	    },
	    danMuInsert:function(queue,data){
	        var self = this;
	        var img =  'http://tva1.sinaimg.cn/default/images/default_avatar_male_50.gif';
	        setTimeout(function(){
	           queue.unshift({'img':img,'content':data.content}); 
	           self.danMuPlay(queue);
//	           if(queue.data == ''){
//	           		self.danMuPlay(queue);
//	           }
	           
	       },2000);
	    },
	    danMuClear:function(){
	        var clearLi = setInterval(function(){
	            for(var i = 0;i<$('.j_barrage').find('ul').children().length;i++){
	                if($('.j_barrage').find('ul').children().eq(i).offset().left<-400){
	                	console.log('remove')
	                    $('.j_barrage').find('ul').children().eq(i).remove();
	                }
	            }
	        },1000)
	    },
	    danMuPause:function(){
	    	var self = this;
	    	clearInterval(self.timeCacluate);
	    }
	};
	