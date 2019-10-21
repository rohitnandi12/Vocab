let notify_module = (function(){
	function _createNotification(name,title,msg){
		console.log("name:"+name+", title:"+title+", msg:"+msg);
		var opt = {
			type: 'basic', //check out more types
			title: title,
			message: msg,
			priority: 1, //check more
			iconUrl: '../images/get_started128.png'
		};

		chrome.notifications.create(name, opt, function(id){
			console.log("Last error:", chrome.runtime.lastError);
		});
	}

	var _notifyRandom = function(items) {
		let item_keys = Object.keys(items)
		if(item_keys.length != 0){
			let random_word = item_keys[Math.floor(Math.random() *item_keys.length)];
			let random_meaning = items[random_word];
			console.log(new Date()+" "+random_word+" "+random_meaning);
			notify_module.notify("Error",random_word,random_meaning);
		}
	}

	return {
		notify : _createNotification,
		notifyRandom : _notifyRandom
	}
})();