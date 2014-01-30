// Override download path to files_sharing/public.php

/* global OC, FileActions, FileList */
function fileDownloadPath(dir, file) {
	var url = $('#downloadURL').val();
	if (url.indexOf('&path=') != -1) {
		url += '/'+file;
	}
	return url;
}

$(document).ready(function() {

	if (typeof FileActions !== 'undefined') {
		var mimetype = $('#mimetype').val();
		// Show file preview if previewer is available, images are already handled by the template
		if (mimetype.substr(0, mimetype.indexOf('/')) != 'image' && $('.publicpreview').length === 0) {
			// Trigger default action if not download TODO
			var action = FileActions.getDefault(mimetype, 'file', OC.PERMISSION_READ);
			if (typeof action !== 'undefined') {
				action($('#filename').val());
			}
		}
	}

	// override since the format is different
	FileList.getDownloadUrl = function(filename, dir) {
		var path = dir || FileList.getCurrentDirectory();
		var params = {
			service: 'files',
			t: $('#sharingToken').val(),
			path: path + '/' + OC.basename(filename),
			download: null
		};
		return OC.filePath('', '', 'public.php') + '?' + OC.buildQueryString(params);
	};

	FileList.linkTo = function(dir) {
		var params = {
			service: 'files',
			t: $('#sharingToken').val(),
			dir: dir
		};
		return OC.filePath('', '', 'public.php') + '?' + OC.buildQueryString(params);
	};

	FileList.getAjaxUrl = function(action, params) {
		params = params || {};
		params.t = $('#sharingToken').val();
		return OC.filePath('files_sharing', 'ajax', action + '.php') + '?' + OC.buildQueryString(params);
	};

	var file_upload_start = $('#file_upload_start');
	file_upload_start.on('fileuploadadd', function(e, data) {
		// Add custom data to the upload handler
		data.formData = {
			requesttoken: $('#publicUploadRequestToken').val(),
			dirToken: $('#dirToken').val(),
			subdir: $('input#dir').val()
		};
	});

	$(document).on('click', '#directLink', function() {
		$(this).focus();
		$(this).select();
	});

});
