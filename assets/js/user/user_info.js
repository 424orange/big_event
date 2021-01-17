$(function () {
  layui.form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称必须在1~6位之间";
      }
    },
  });
  initUserInfo();
  // 初始化用户信息
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("获取用户基本信息失败！");
        }
        console.log(res);
        // 调用 lay-filter 为表单快速赋值
        layui.form.val("formUserInfo", res.data);
      },
    });
  }
  // 重置表单
  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });
  // 监听表单提交
  $(".layui-form").on("submit", function (e) {
    // 阻止表单默认提交
    e.preventDefault();
    // 发起ajax请求
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("修改用户信息失败！");
        }
        layui.layer.msg("修改用户信息成功！");
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo();
      },
    });
  });
});
