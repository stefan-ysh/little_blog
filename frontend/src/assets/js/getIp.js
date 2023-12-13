// export default function() {
//   // axios不支持jsonp，就直接用创建js解决跨域问题
//   const script = document.createElement("script");
//   script.type = "text/javascript";
//   script.src =
//     "http://api.map.baidu.com/location/ip?callback=show&coor=bd09ll&ak=zdID84p3fMRLNHzegSlgSbe9";
//   document.body.appendChild(script);
//   window.show = function(json) {
//     // 不添加window，callback找不到
//     return 5
//   };
// }

var script = document.createElement("script");
var queueIndex = helper.getNextQueueIndex();
if (queueIndex < 0) {
  alert("当前并发连接过多，请刷新页面或稍后再试！");
  return;
}
script.setAttribute("id", "test_script_" + queueIndex);
script.src = "http://localhost:8080/Action?action=getDistillLatest&queue=" + queueIndex + "&rnd=" + Math.random() * 9999;
document.body.appendChild(script);
window.setTimeout( "helper.listner({queueIndex:" + queueIndex + ",workitemNumber:" + workitemId + ",action:'getDistillLatest',expireTimes:" + 60 + "})",  500);
