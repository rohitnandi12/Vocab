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
