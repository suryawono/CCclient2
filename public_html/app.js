var ip, port;
var username;
var sessionid;
var lasttimestamp = "-1";

$(document).ready(function () {
    $("#connect").bind("click", function () {
        var data = {
            command: "ping"
        }
        ip = $("#ip").val();
        port = $("#port").val();
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "http://" + ip + ":" + port,
            data: JSON.stringify(data),
            success: function (data) {
                $("#connect-tooltip").html("Berhasil terhubung ke server...").css("color", "green").hide().fadeIn();
                $(".init-page").hide();
                $(".portal-page").show();
                $(".current-ip-address").html(ip + ":" + port);
                $("#connect-tooltip").html("");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#connect-tooltip").html("Tidak bisa menghubungi server..").css("color", "red").hide().fadeIn();
            }
        })
    })

    $("#register").bind("click", function () {
        username = $("#register-username").val();
        var password = $("#register-password").val();
        var data = {
            command: "register",
            params: {
                username: username,
                password: password,
            }
        }
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "http://" + ip + ":" + port,
            data: JSON.stringify(data),
            success: function (data) {
                if (data.status == 2) {
                    $("#connect-tooltip").html("Pendaftaran berhasil...").css("color", "green").hide().fadeIn();
                } else {
                    $("#connect-tooltip").html(data.message + "...").css("color", "red").hide().fadeIn();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#connect-tooltip").html("Tidak bisa menghubungi server..").css("color", "red").hide().fadeIn();
            }
        })
    })

    $("#login").bind("click", function () {
        username = $("#login-username").val();
        var password = $("#login-password").val();
        var data = {
            command: "login",
            params: {
                username: username,
                password: password,
            }
        }
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "http://" + ip + ":" + port,
            data: JSON.stringify(data),
            success: function (data) {
                if (data.status == 3) {
                    $("#connect-tooltip").html("Login berhasil...").css("color", "green").hide().fadeIn();
                    $(".portal-page").hide();
                    $(".chat-page").show();
                    sessionid = data.data.sessionid;
                    getMessage("-1");
                    loopMessage();
                    loopOnlineList();
                } else {
                    $("#connect-tooltip").html(data.message + "...").css("color", "red").hide().fadeIn();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#connect-tooltip").html("Tidak bisa menghubungi server..").css("color", "red").hide().fadeIn();
            }
        })
    })

    $("#chat-input").keypress(function (e) {
        if (e.which == 13) {
            sendMessage($(this).val());
            $(this).val("");
        }
    })

    function getMessage(timestamp) {
        var data = {
            command: "getMessage",
            params: {
                timestamp: timestamp,
                sessionid: sessionid,
            }
        }
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "http://" + ip + ":" + port,
            data: JSON.stringify(data),
            success: function (data) {
                if (data.status == 10) {
                    $.each(data.data.messages, function (k, v) {
                        $(".chat-list").append(v.timestamp + ":" + v.username + ":" + v.message + "<br/>");
                        lasttimestamp = v.timestamp;
                    });
                    $("#connect-tooltip").html("connected...").css("color", "green").hide().fadeIn();
                } else {
                    $("#connect-tooltip").html(data.message + "...").css("color", "red").hide().fadeIn();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#connect-tooltip").html("Tidak dapat menghubungi server...").css("color", "red").hide().fadeIn();
            }
        })
    }

    function sendMessage(message) {
        var data = {
            command: "sendMessage",
            params: {
                message: message,
                sessionid: sessionid,
            }
        }
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "http://" + ip + ":" + port,
            data: JSON.stringify(data),
            success: function (data) {
                if (data.status == 5) {
                } else {
                    $("#connect-tooltip").html(data.message + "...").css("color", "red").hide().fadeIn();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        })
    }

    function loopMessage() {
        setTimeout(function () {
            getMessage(lasttimestamp);
            loopMessage();
        }, 1000);
    }
    
    function loopOnlineList() {
        getOnlineList()
        setTimeout(function () {
            loopOnlineList();
        }, 5000);
    }

    function getOnlineList() {
        var data = {
            command: "getOnlineList",
            params: {
                sessionid: sessionid,
            }
        }
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "http://" + ip + ":" + port,
            data: JSON.stringify(data),
            success: function (data) {
                if (data.status == 10) {
                    $(".user-list").html("");
                    $.each(data.data.users, function (k, v) {
                        $(".user-list").append("- "+v.username + "<br/>");
                    })
                } else {

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        })
    }
})

