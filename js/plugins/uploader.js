$.uploader = function () {
	this.setting = {
		type: 'default', //上传类型 default|oss
		scene: 3, //上传场景 1:后台 2:前台上传
		uid: 0, //上传者UID
		url: '',
		fileType: ''
	};
	this.ready = function () {
		$('#_uploader').remove();
		var ele = '<div style="visibility: hidden" id="_uploader">';
		switch (this.setting.type) {
			case 'oss':
				this.setting.url = '/common/upload/oss/';
				ele += '<form method="post" action="" target="_uploadCallback" enctype="multipart/form-data">';
				ele += '<input type="file" name="oss_file" id="_uploaderFile" title="选择文件上传">';
				ele += '<input id="_uploaderFileType" name="fileType" type="hidden" value="">';
				ele += '</form>';
				break;
			default:
				ele += '<form method="post" action="'+ (!this.setting.url ? '/common/upload/' : this.setting.url) +'" target="_uploaderCallback" enctype="multipart/form-data">';
				ele += '<input type="file" name="file" id="_uploaderFile" title="选择文件上传">';
				ele += '<input id="_uploaderFileType" name="fileType" type="hidden" value="">';
				ele += '<input id="_uploaderUid" name="uid" type="hidden" value="'+this.setting.uid+'">';
				ele += '<input type="submit" id="_uploader_submit" value="上传">';
				ele += '</form>';
				ele += '<iframe name="_uploaderCallback" id="_uploaderCallback" style="display: none;"></iframe>';
				break;
		}
		ele += '</div>';
		$('body').append(ele);
		var _this = this;
		//监听文件选择框改变事件
		$('#_uploaderFile').change(function () {
			switch (_this.setting.type) {
				case 'oss':
					_this.oss_upload();
					break;
				default:
					_this.start_upload();
					break;
			}
		});
	};
	/**
	 * 本地上传
	 */
	this.start_upload = function () {
		var _this = this;
		var tmpfile = $('#_uploaderFile').val();
		if (!tmpfile) {
			return false;
		}
		$('#_uploader_submit').click();
		this.uploading();
		$('#_uploaderCallback').load(function () {
			_this.complate();
			var result = $("#_uploaderCallback").contents().find('body').text();
			//var json = $.parseJSON(result);
			var json = result;
			if (result) {
				var json = $.parseJSON(result);
				if (!json.status) {
					_this.error(json.msg);
				} else {
					if (json.save_type == 3) {
						var result = json.data;
						var resizeStyle = result.image_style['size_100x100'] ? '@' + result.image_style['size_100x100'] : '';
						result.object_preview_url = result.object_url + resizeStyle;
						var object = result;
					} else {
						var object = {
							result : json,
							file: json.data.path,
							object_url: '/data/attachment' + json.data.path,
							object_preview_url: '/data/attachment' + json.data.size_100x100,
							type: _this.setting.fileType
						};
					}
					_this.success(object);
					_this.ready();
				}
			}
		});
	};
	/**
	 * 阿里云OSS上传
	 */
	this.oss_upload = function () {
		if (!this.setting.url) {
			alert('上传URL未定义');
			return;
		}
		var file = document.getElementById("_uploaderFile").files[0];
		var nameArr = file.name.split(".");
		var ext = nameArr[nameArr.length - 1];
		var reader = new FileReader();
		var _this = this;
		//将文件以Data URL形式读入页面  
		reader.readAsDataURL(file);
		reader.onload = function (e) {
			var base64Temp = e.target.result;
			var fileData = base64Temp.substring(base64Temp.indexOf("base64") + 7);
			_this.uploading();
			$.ajax({
				type: "POST",
				url: _this.setting.url,
				data: {
					data: fileData,
					filename: file.name,
					size: file.size,
					ext: ext,
					scene: _this.setting.scene,
					uid: _this.setting.uid
				},
				dataType: "json",
				success: function (json) {
					_this.complate();
					if (!json.status) {
						_this.error(json.msg);
					} else {
						var result = json.data;
						if (result.type == 'image') {
							var resizeStyle = result.image_style['size_100x100'] ? '@' + result.image_style['size_100x100'] : '';
							result.object_preview_url = result.object_url + resizeStyle;
						}

						_this.success(result);
						_this.ready();
					}
				},
				error: function () {
					_this.error('发生系统错误,请重试');
				}
			});
		};
	};
	/**
	 * 选择文件
	 */
	this.select = function (fileType, callback) {
		if (!fileType) {
			this.error('没有定义文件类型');
			return false;
		}
		this.setting.fileType = fileType;
		$('#_uploaderFileType').val(fileType);
		$('#_uploaderFile').click();
		this.success = callback;
	};
	/**
	 * 上传中要执行的操作
	 */
	this.uploading = function () {
	};
	/**
	 * 上传完成执行的操作
	 */
	this.complate = function () {
	};
	/**
	 * 上传错误执行操作
	 */
	this.error = function (msg) {
	};
	/**
	 * 上传成功执行操作
	 */
	this.success = function (result) {
	};
};