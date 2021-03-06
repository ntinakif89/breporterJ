$(document).ready(function() {
	$("#getbugs_btn").click(function() {
		var linkJQ = $("#link_input"),
			url = linkJQ.val(),
			getBugsBtnQ = $(this);
		
		var projectKeyQ = $("#project_input"),
			projectKey = projectKeyQ.val();
			
		if (url.length == 0) {
			showLinkError(ERROR.URL.EMPTY, true);
			return;
		}
		
		if (!re_weburl.test(url)) {
			showLinkError(ERROR.URL.INVALID, true);
			return;
		}

		if (projectKey.length == 0) {
			showLinkError(ERROR.PROJKEY.EMPTY, true);
			return;
		}
		
		if (re_projectKey.test(projectKey)) {
			showLinkError(ERROR.PROJKEY.INVALID, true);
			return;
		}
		
		$.ajax({
			url: '/breporterRest/api/url/saveUrl/', 
			type: "post",
			data: JSON.stringify({
                url: url
            }),
			dataType: 'json',
            contentType: 'application/json',
			beforeSend: function(){
				getBugsBtnQ.button("loading");
				linkJQ.attr("disabled", "disabled");
			},
			success: function(jsonRes){
				if(!jsonRes.error){
					linkJQ.val("");
				}
				console.log(jsonRes);
				showServerMessage(jsonRes.error, jsonRes.error_code, jsonRes.data, url);
			},
			complete: function(){
				getBugsBtnQ.button("reset");
				linkJQ.removeAttr("disabled");
			}
			
		});
		
	});
	
	$("#link_input").keypress(function(){
		clearUrlErrors();
		clearServerMessage();
	});

	function showLinkError(error, clearOther){
		var message = null;
		switch (error) {
			case ERROR.URL.EMPTY:
				message = "Please enter your link first!";
				break;
			case ERROR.URL.INVALID:
				message = "Please enter a valid link!";
				break;
			case ERROR.PROJKEY.EMPTY:
				message = "Please enter your jira project key first!";
				break;
			case ERROR.PROJKEY.INVALID:
				message = "Please enter a valid project key link!";
				break;
			default:
				message = null;
				break;
			}
		var errorContainer = $("#urlerrorcontainer");
		if(clearOther){
			clearUrlErrors();
		}
		if(null != message){
			errorContainer.append(
					'<div role="alert" class="alert alert-danger alert-dismissible fade in">' +
				      '<button aria-label="Close" data-dismiss="alert" class="close" type="button"><span aria-hidden="true">×</span></button>' +
				      '<strong>Link error. </strong> ' + message +
				    '</div>');
		}
	}
	
	function clearUrlErrors(){
		var errorContainer = $("#urlerrorcontainer");
		errorContainer.html("");
	}
	
	function clearServerMessage(){
		$("#servermessagescontainer").html("");
	}
	
	function showServerMessage(error, error_code, data, url){
		/*here we should handle the result bugs*/
		var message = "";
		if(!error){
			var shortLink = DEFAULT_LINK + data;
			message = '<strong>Here is your shorter link: <a href="' + shortLink + '" target="blank">' + shortLink + '</a></strong>';
		}else{
			switch (error_code) {
			case ERROR.SERVER.DUPLICATE_URL:
				message = "<strong>Error on server.</strong> Url <b>" + url + "</b> already exists. Please try another.";
				break;
			default:
				message = "<strong>Error on server.</strong> Please try again.";
				break;
			}
		}
		$("#servermessagescontainer").html(
				'<div role="alert" class="alert alert-' + (!error ? "success" : "danger") + ' alert-dismissible fade in">' +
			      '<button aria-label="Close" data-dismiss="alert" class="close" type="button"><span aria-hidden="true">×</span></button>' +
			      '<p>' + message + '</p>' +
			    '</div>');
	}

});

var ERROR = {};
	ERROR.URL = {},
	ERROR.PROJKEY = {},
	ERROR.URL.EMPTY = 0;
	ERROR.URL.INVALID = 1;
	ERROR.PROJKEY.EMPTY = 2;
	ERROR.PROJKEY.INVALID = 3;
	ERROR.SERVER = {};
	ERROR.SERVER.DUPLICATE_URL = {};
	ERROR.SERVER.DUPLICATE_URL = "E_BUILDING_DUPLICATE_URL";
var DEFAULT_LINK = "http://localhost:8080/myUrlUI/r/";
	
var re_projectKey = new RegExp("\\s");

var re_weburl = new RegExp(
		"^" + "(?:(?:https?|http)://)?"
		+ "(?:" + "(?!(?:10|127)(?:\\.\\d{1,3}){3})"
		+ "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})"
		+ "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})"
		+ "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])"
		+ "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}"
		+ "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" + "|"
		+ "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)"
		+ "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*"
		+ "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" + ")" + "(?::\\d{2,5})?"
		+ "(?:/\\S*)?" + "$", "i");