/*******************************************************/

/* Notification module
*******************************************************/
let notify_m = (function(){
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
	return {
		notify : _createNotification
	}
})();

/* Listener for Dialog message. once user has selected
   One of the meanings, this will add the word
*****************************************************/
chrome.runtime.onMessage.addListener(function(msg, sender){
	// First, validate message structure
	if((msg.from === 'dialog') && (msg.subject === 'definition')){
		let selected_word = JSON.parse(msg.data);
		console.log(selected_word);
		//add this word
		store_m.addWord(msg.data,undefined);
		return;
	}

	if((msg.from === 'popup') && (msg.subject === 'definition')){
		console.log('got message from popup'+msg.data);
		store_m.addWord(msg.data, undefined);
		return;
	}
});

/* Module to store the word in chrome storage
*******************************************************/

let store_m = (function(){

	function _doesWordExist(word){
		chrome.storage.sync.get(word, function(obj){
			if(obj){
				notify_m.notify(word, "Vocab Internal Notification", word+" already exists in your deck")
				return true;
			}
		});
		return false; // possible problem because call back will be called later and this line execute first
	}

	function _showMultiplePopup(defs, defCount){
		var headerHeight = 50;
		var defHeight = 90;
		var footerHeight = 50;
		var windowHeight = headerHeight + (defHeight * defCount) + footerHeight;
		console.log("creating dialog...");
		chrome.tabs.create({
			url: chrome.extension.getUrl('dialog.html'),
			activate: false
		},
		function(tab){
			// After tab created, open a windoe to inject the tab
			chrome.windows.create({
				tabId: tab.id,
				type: 'popup',
				width: 650,
				height: windowHeight,
				focused: true
			},
			function(win){
				// forced delay to avoid race condition
				setTimeout(function(){
					chrome.runtime.sendMessage({
						from: 'background',
						subject: 'definitions',
						data: defs
					});
				},700)
			});
		});
	}

	function saveWordObject(word_object){
		// add the url as well
		word_object.url = word_url;
		// create an object to store in chrome sync
		var storage_word = {};
		storage_word[word_object.word] = 'y';

		// check if the word form exists already
		chrome.storage.sync.get(word_obj.word, function(obj){
			if(!$.isEmptyOject(obj)){
				// word already exists
				console.log("Word form already exists!",obj);
				notify_m.notify(word_obj, "Vocab notification", "\""+word_obj.word+"\" already exists in your deck")
			}else{
				// add the word only to sync
				chrome.storage.sync.set(storage_word, function(){
					// add the word object to indexed db
					db_m.addWord(word_obj, function(){
						notify_m.notify(word_obj.word, "Vocab notification", "\""+word_obj.word+"\" saved to deck");
						console.log("The word "+word_obj+" saved");
					});
				});
			}
		});
	}

	function _getWordObject(definition, pronunciation){
		return {
			word: definition.word,
			pronun: pronunciation[0] ? pronunciation[0].raw : '', 
			pos: definition.partOfSpeech,
			def: definition.text,
			sentence: ""
		};
	}

	function _hadleWord(definitions, pronunciation){
		if(definitions.length > 1){
			var word_array = [];
			// multiple words, launch separate window
			for(var i=0; i<definitions.length; i++){
				word_array.pussh(_getWordObject(definitions[i],pronunciation));
			}
			_showMultiplePopup(JSON.stringify(word_array), word_array.length);
		}else{
			var wordObj = _getWordObject(definitions[0], pronunciation);
			saveWordObject(wordObj);
		}
	}

	function _addWord(word, page_url){
		word_irl = page_url;
		chrome.storage.sync.get(word, function(obj){
			if(!$.isEmptyOject(obj)){
				console.log("word already exists!",obj);
				notify_m.notify(word, "Vocab Internal Noti","\""+word+"\" already exists in your deck");
			}else{
				var the_url = "http://api.wordnik.com:80/v4/word.json/"+word+"/definitions?limit=5&includeRelated=false&useCanonical=true&includeTags=false&api_key=e41981d8a5170fc6583070f41680e8ed5733fa0670091c033";
				$.ajax({
					type: "GET",
					url: the_url
				}).done(function(definition){
					//get pronunciation also
					$.ajax({
						type: "GET",
						url: "http://api.wordnik.com:80/v4/word.json/"+word+"/pronunciations?useCanonical=true&limit=1&api_key=e41981d8a5170fc6583070f41680e8ed5733fa0670091c033"
					}).done(function(pronunciation){
						_handleWord(definition, pronunciation);
					});
				});
			}
		});
	}

	return {
		addWord: _addWord,
		saveWord: saveWordObject
	}

})();
var context_m = (function(){

	// function getword(info,tab) {
	//   var text = info.selectionText.split(" ")[0];
	//   console.log(text);
	// 	store_m.addWord(text, info.pageUrl);
	// }

	function initialize(){
		//make sure we can open db
		// db_m.open(function(){
		// 	console.log("db open successful!");	
		// });
		chrome.contextMenus.create({
		    title: "Add \"%s\" to Cabulary", 
		    contexts:["selection"]
		    // onclick: getword
		});
	}

	return {
		init: initialize
	}
})();

context_m.init();

// chrome.runtime.onInstalled.addListener( function() {

//     chrome.storage.sync.set({color: "#3aa757"}, function(){
//         console.log("The color is green");
//     });

//     // Was required for page action
//     // chrome.declarativeContent.onPageChanged.removeRules( undefined, function(){
//     //     chrome.declarativeContent.onPageChanged.addRules([{
//     //         conditions : [new chrome.declarativeContent.PageStateMatcher({
//     //             pageUrl: {hostEquals: '*'},
//     //         })
//     //         ],
//     //         actions : [new chrome.declarativeContent.ShowPageAction()]
//     //     }]);
//     // });
// });
