$(function () {
  var laypage = layui.laypage;
  // 时间过滤器函数
  template.defaults.imports.dataFormat = function (data) {
    var dt = new Date(data);

    var y = addZero(dt.getFullYear());
    var m = addZero(dt.getMonth() + 1);
    var d = addZero(dt.getDate());

    var hh = addZero(dt.getHours());
    var mm = addZero(dt.getMinutes());
    var ss = addZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };
  // 补零函数
  function addZero(n) {
    return n > 9 ? n : "0" + n;
  }

  var q = {
    pagenum: 1, //页码值
    pagesize: 2, //每页显示多少条数据
    cate_id: "", //文章分类的 Id
    state: "", //文章的状态，可选值有：已发布、草稿
  };
  initTable();
  initCate();
  /* 获取列表数据 */
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("获取文章列表失败！");
        }
        var str = template("tpl-table", res);
        $("tbody").html(str);
        renderPage(res.total);
      },
    });
  }
  // 初始化文章分类
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("获取文章分类列表失败！");
        }
        var str = template("tpl-cate", res);
        $('[name="cate_id"]').html(str);
        layui.form.render();
      },
    });
  }
  // 监听筛选表单的 submit 事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    var cate_id = $('[name="cate_id"]').val();
    var state = $('[name="state"]').val();

    q.cate_id = cate_id;
    q.state = state;

    initTable();
  });
  // 分页器
  function renderPage(total) {
    // console.log(total);
    laypage.render({
      elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示的条数
      curr: q.pagenum, //起始页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        //首次不执行
        if (!first) {
          initTable();
          //do something
        }
      },
    });
  }
  // 删除操作
  $("tbody").on("click", ".btn-delete", function () {
    // 获取删除按钮的个数
    var len = $(".btn-delete").length;
    console.log(len);
    // 获取到文章的 id
    var id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layui.layer.msg("删除文章失败！");
          }
          layui.layer.msg("删除文章成功！");
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });

      layer.close(index);
    });
  });
});
