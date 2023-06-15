<?php 
  
/* Database Configuration. Add your details below */

$dbOptions = array(
	'db_host' => 'localhost',
	'db_user' => 'root',
	'db_pass' => '',
	'db_name' => 'saski'
);

/* Database Config End */


error_reporting(E_ALL ^ E_NOTICE);

require "classes/DB.class.php";
require "classes/GShashki.class.php";
require "classes/ChatBase.class.php";
require "classes/ChatLine.class.php";
require "classes/SField.class.php";
require "classes/SUser.class.php";
require "classes/Shashki.class.php";
require "classes/CheckGame.class.php";

session_name('webchat');
session_start();

if(get_magic_quotes_gpc()){
	
	// If magic quotes is enabled, strip the extra slashes
	array_walk_recursive($_GET,create_function('&$v,$k','$v = stripslashes($v);'));
	array_walk_recursive($_POST,create_function('&$v,$k','$v = stripslashes($v);'));
}

try{
	
	// Connecting to the database
	DB::init($dbOptions);
	
	$response = array();
	
	// Handling the supported actions:
	// $sts=false;
	
	switch($_GET['action']){
		
		case 'login':
			$response = GShashki::login($_POST['name']);
		break;
		
		case 'checkLogged':
			$response = GShashki::checkLogged();
		break;
		
		case 'logout':
			$response = GShashki::logout();
		break;

		case 'logoutGame':
			$response = GShashki::logoutGame();
		break;
		
		case 'submitField':
			$response = GShashki::submitField();
		break;
		
		case 'GField':
			$response = GShashki::GField($_POST['code']);
		break;

		case 'getField':
			$response = GShashki::getField();
		break;

		case 'getUsersField':
			$response = GShashki::getUsersField();
		break;

		case 'reqfield':
			$response = GShashki::reqfield($_POST['reqxax']);
		break;

		case 'submitChat':
			$response = GShashki::submitChat($_POST['chatText']);
		break;
		
		case 'getChats':
			$response = GShashki::getChats($_GET['lastID']);
		break;

		case 'getUsersName':
			$response = GShashki::getUsersName();
		break;

		default:
			throw new Exception('Wrong action');
	}
	
	echo json_encode($response);

}
catch(Exception $e){
	die(json_encode(array('error' => $e->getMessage())));
}

?>