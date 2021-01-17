$(function () {
  // 初始化富文本编辑器
  initEditor();
  initCate();

  // 定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("初始化文章分类失败！");
        }
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 一定要记得调用 form.render() 方法
        layui.form.render();
      },
    });
  }

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 选择封面按钮
  $("#btnChoosepic").on("click", function () {
    $("#coverfile").click();
  });

  $("#coverfile").on("change", function (e) {
    var file = e.target.files[0];
    //根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file);
    //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 定义文章发布状态
  var art_status = "已发布";
  //为 存草稿按钮 切换状态
  $("#btnSave2").on("click", function () {
    art_status = "草稿";
  });
  // 监听表单的 submit 提交事件
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    var fd = new FormData($(this)[0]);
    // console.log(fd);
    fd.append("state", art_status);
    //将裁剪后的图片，输出为文件
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append("cover_img", blob);
        // 发起请求
        publishArticle(fd);
      });
  });
  // ajax请求
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("发布文章失败！");
        }
        layui.layer.msg("发布文章成功！");
        location.href = "/code/article/art_list.html";
      },
    });
  }
});
