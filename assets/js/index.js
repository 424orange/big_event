getUserInfo();
// 退出功能
$("#btnLogout").on("click", function () {
  // alert(1);
  layui.layer.confirm(
    "确认退出?",
    { icon: 3, title: "提示" },
    function (index) {
      //do something
      localStorage.removeItem("token");
      location.href = "/code/login.html";
      layui.layer.close(index);
    }
  );
});

//获取用户信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers: { Authorization: localStorage.getItem("token" || "") },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户基本信息失败");
      }
      renderAvatar(res.data);
    },
  });
}
// 渲染用户头像
function renderAvatar(user) {
  // 获取用户名
  var name = user.nickname || user.username;
  //设置欢迎文本
  $("#welcome").html("欢迎&nbsp;&nbsp" + name);
  //渲染头像
  if (user.user_pic !== null) {
    // 渲染头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
