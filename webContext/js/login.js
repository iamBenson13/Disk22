/**
 * login.html
 */

$(function() {
	// 回车键快捷操作
	$("body").keypress(function(e) {
		var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (keyCode == 13) {
			var g = $("#loginBtn").click();
			return false;
		}
	});
	// 打开页面自动聚焦账户输入框
	$("#accountid").focus();
})

function dologin() {
	var accountId = $("#accountid").val();
	var accountPwd = $("#accountpwd").val();
	var check = "y";
	if (accountId.length == 0) {
		$("#accountidbox").addClass("has-error");
		check = "n"
	} else {
		$("#accountidbox").removeClass("has-error");
	}
	if (accountPwd.length == 0) {
		$("#accountpwdbox").addClass("has-error");
		check = "n"
	} else {
		$("#accountpwdbox").removeClass("has-error");
	}
	if (check == "y") {
		$.ajax({
			type : "POST",
			dataType : "text",
			url : "homeController/getPublicKey.ajax",
			data : {},
			success : function(result) {
				var publicKeyInfo = eval("(" + result + ")");
				var loginInfo = '{accountId:"' + accountId + '",accountPwd:"'
						+ accountPwd + '",time:"' + publicKeyInfo.time + '"}';
				var encrypt = new JSEncrypt();// 加密插件对象
				encrypt.setPublicKey(publicKeyInfo.publicKey);// 设置公钥
				var encrypted = encrypt.encrypt(loginInfo);// 进行加密
				sendLoginInfo(encrypted);
			},
			error : function() {
				$("#alertbox").addClass("alert");
				$("#alertbox").addClass("alert-danger");
				$("#alertbox").text("提示：登录请求失败，请检查网络或服务器运行状态");
			}
		});
	}
}

function sendLoginInfo(encrypted) {
	$.ajax({
		type : "POST",
		dataType : "text",
		url : "homeController/doLogin.ajax",
		data : {
			encrypted : encrypted
		},
		success : function(result) {
			$("#alertbox").removeClass("alert");
			$("#alertbox").removeClass("alert-danger");
			$("#alertbox").text("");
			if (result == "permitlogin") {
				$("#accountidbox").removeClass("has-error");
				$("#accountpwdbox").removeClass("has-error");
				window.location.href = "home.html";
			} else if (result == "accountnotfound") {
				$("#accountidbox").addClass("has-error");
				$("#accountpwdbox").removeClass("has-error");
				$("#alertbox").addClass("alert");
				$("#alertbox").addClass("alert-danger");
				$("#alertbox").text("提示：登录失败，账户不存在或未设置");
			} else if (result == "accountpwderror") {
				$("#accountpwdbox").addClass("has-error");
				$("#accountidbox").removeClass("has-error");
				$("#alertbox").addClass("alert");
				$("#alertbox").addClass("alert-danger");
				$("#alertbox").text("提示：登录失败，密码错误或未设置");
			} else {
				$("#alertbox").addClass("alert");
				$("#alertbox").addClass("alert-danger");
				$("#alertbox").text("提示：无法登录，未知错误");
			}
		},
		error : function() {
			$("#alertbox").addClass("alert");
			$("#alertbox").addClass("alert-danger");
			$("#alertbox").text("提示：登录请求失败，请检查网络或服务器运行状态");
		}
	});
}