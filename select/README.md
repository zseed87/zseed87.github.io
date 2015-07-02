# 模拟可搜索的下拉框

/**
 * 使用说明
 * html部分，目前没有定义布局，用户可以根据需要自定义
 * <input type="text" name="" id="...">
 * <div id="..." class="myOption"></div>
 * js部分
 * var xxx = new searchSelect();
 * xxx.init({
 *	select: "选择器ID",
 *	option: "下拉框ID",
 *	data: "下拉框数据(数组)",
 *	cls: "下拉框的类名(可不填，默认为'myOption')"
 * })
 */
