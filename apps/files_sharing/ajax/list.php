<?php

// only need filesystem apps
$RUNTIME_APPTYPES=array('filesystem');

// Init owncloud

if(!\OC_App::isEnabled('files_sharing')){
	exit;
}

if(!isset($_GET['t'])){
	\OC_Response::setStatus(400); //400 Bad Request
	\OC_Log::write('core-preview', 'No token parameter was passed', \OC_Log::DEBUG);
	exit;
}

$token = $_GET['t'];

$password = null;
if (isset($_POST['password'])) {
	$password = $_POST['password'];
}

$relativePath = null;
if (isset($_GET['dir'])) {
	$relativePath = $_GET['dir'];
}

$data = \OCA\Files_Sharing\Helper::setupFromToken($token, $relativePath, $password);

// Load the files
$dir = $data['realPath'];

$dir = \OC\Files\Filesystem::normalizePath($dir);
if (!\OC\Files\Filesystem::is_dir($dir . '/')) {
	\OC_Response::setStatus(404);
	\OCP\JSON::error(array('success' => false));
	exit();
}

$data = array();
$baseUrl = OCP\Util::linkTo('files_sharing', 'index.php') . '?t=' . urlencode($token) . '&dir=';

// make filelist
$files = \OCA\Files\Helper::getFiles($dir);

$formattedFiles = array();
foreach ($files as $file) {
	unset($file['directory']); // for now
	$file['permissions'] = \OCP\PERMISSION_READ;
	// TODO: rewrite icon path
	$formattedFiles[] = $file;
}

$data['directory'] = $relativePath;
$data['files'] = $formattedFiles;
$data['permissions'] = \OCP\PERMISSION_READ;

OCP\JSON::success(array('data' => $data));
