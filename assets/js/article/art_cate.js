$(function () {
  initArtCateList();
  // 获取文章列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        var str = template("tpl-table", res);
        $("tbody").html(str);
      },
    });
  }
  // 弹出添加类别框
  var indexadd = null;
  $("#btnAddCate").on("click", function () {
    indexadd = layui.layer.open({
      type: 1,
      area: ["500px", "300px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });
  // 通过事件委托给form-add表单绑定事件
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("新增文章分类失败！");
        }
        initArtCateList();
        layui.layer.msg("新增文章分类成功！");
        // 关闭当前层
        layui.layer.close(indexadd);
      },
    });
  });
  // 弹出修改类别框
  var indexedit = null;
  $("tbody").on("click", ".btn-edit", function () {
    indexedit = layui.layer.open({
      type: 1,
      area: ["500px", "300px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    var id = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        layui.form.val("form-edit", res.data);
      },
    });
  });
  // 通过事件委托给form-edit表单绑定事件
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("更新分类信息失败！");
        }
        layui.layer.msg("更新分类信息成功！");
        layui.layer.close(indexedit);
        initArtCateList();
      },
    });
  });
  // 删除文章
  $("tbody").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    layui.layer.confirm(
      "确认删除?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        $.ajax({
          method: "GET",
          url: "/my/article/deletecate/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layui.layer.msg("删除文章分类失败！");
            }
            layui.layer.msg("删除文章分类成功！");
            layui.layer.close(index);
            initArtCateList();
          },
        });
      }
    );
  });
});
