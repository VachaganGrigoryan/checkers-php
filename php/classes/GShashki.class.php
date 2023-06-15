<?php
 
/* ajax.php-ին կատարած հարցումները ուղարկում է այստեղ*/

class GShashki{
	// Բազայում ավելացնում է տվյալ անձի անունը և գեներացնում է համապատասխան կոդը
	public static function login($name){ 
		if(!$name){
			throw new Exception('Լրացրեք անվան դաշտը.');
		}
		
		$ip = ip2long(Shashki::getIP());
		$code = uniqid();
		
		$user = new SUser(array(
			'name' => $name,
			'ip'   => $ip,
			'code' => $code
		));
		
		if($user->save()->affected_rows != 1){
			throw new Exception('Այդ անունն արդեն գոյություն ունի, փորձեք ուրիշ անուն.');
		}
		
		$_SESSION['user']	= array(
			'name' => $name,
			'ip'   => $ip,
			'code' => $code
		);
		
		return  $_SESSION['user'];
	}
	// Ստուգում եթե տվյալ սեսյան գոյություն ունի ապա փորձում է բազայից գտնել համապատասղան սեսյայի տվյալները և վերբեռնել բրաուզեր
	public static function checkLogged(){
		$response = array('logged' => false,'logged_field' => false);
		if(Shashki::user_status()){
			$response['logged'] = true;
			$response['loggedAs'] = $_SESSION['user'];
				
			$resfield = DB::query("SELECT * FROM tbl_field WHERE code_1 = '".$_SESSION["field"]["name"]."'");
			if($shashki=$resfield->fetch_object()){
				$_SESSION['field'] = array(
					'name'   => $shashki->code_1,
					'code_1' => $shashki->code_1,
					'code_2' => $shashki->code_2,
					'field'  => unserialize($shashki->field),
					'status' => $shashki->status,
					'xod' => $shashki->xod,
					'qar'    => $_SESSION['field']['qar']
				);
			    $response['logged_field'] = true;
				$response['field'] = $_SESSION['field'];
			}else {
				DB::query("DELETE FROM tbl_chat WHERE chatID = '".DB::esc($_SESSION['user']['code'])."'");
				unset($_SESSION['field']);
			}
		}else {
			DB::query("DELETE FROM tbl_field WHERE code_1 = '".DB::esc($_SESSION["user"]["code"])."'");
			DB::query("DELETE FROM tbl_chat WHERE chatID = '".DB::esc($_SESSION['user']['code'])."'");
			$_SESSION = array();
			unset($_SESSION);
		}
		return 	$response;
	}
	// Դուրս գալ Շաշկի օնլայնից
	public static function logout(){
		DB::query("DELETE FROM tbl_users WHERE code = '".DB::esc($_SESSION['user']['code'])."'");
		DB::query("DELETE FROM tbl_field WHERE code_1 = '".DB::esc($_SESSION['user']['code'])."'");
		DB::query("DELETE FROM tbl_chat WHERE chatID = '".DB::esc($_SESSION['user']['code'])."'");
		$_SESSION = array();
		unset($_SESSION);

		return array('status' => 1);
	}
	// Դուրս գալ դաշտից
	public static function logoutGame(){

		if($_SESSION['user']['code']==$_SESSION['field']['name']){
		DB::query("DELETE FROM tbl_field WHERE code_1 = '".DB::esc($_SESSION['field']['name'])."'");
		DB::query("DELETE FROM tbl_chat WHERE chatID = '".DB::esc($_SESSION['field']['name'])."'");
		}else if($_SESSION['user']['code']==$_SESSION['field']['code_2']){
			
		$dasht = Shashki::DASHT();
		$string = serialize($dasht);
		$status = 'N';
		
		$field = new SField(array(
			'code_1' => $_SESSION['field']['name'],
			'field'  => $string,
			'status' => $status,
			'xod'    => '2'
		));

		if(!$field->upgrade()){
			throw new Exception('Սեղանը գոյություն չունի');
		}
		}

		unset($_SESSION['field']);
		return true;

	}
	
	// Ստեղծել խաղադաշտ որպես 1 խաղացող
	public static function submitField(){

		if(!Shashki::user_status()){
			throw new Exception('Խնդրում ենք մուտքագրվել Շաշկի-օնլայնում սեղան ստեղծելու համար');
		}

		$dasht = Shashki::DASHT();
		$string = serialize( $dasht );
		$status = 'N';
		$field = new SField(array(
			'code_1' => $_SESSION['user']['code'],
			'field'  => $string,
			'status' => $status
		));

		if($field->save()->affected_rows != 1){
			throw new Exception('Դուք չեք կարող 1-ից ավելի սեղան ունենալ !!!');
		}

		$_SESSION['field'] = array(
			'name' => $_SESSION['user']['code'],
			'name_1' => $_SESSION['user']['name'],
			'code_1' => $_SESSION['user']['code'],
			'field'  => $dasht,
			'status' => 'N',
			'xod' => '2',
			'qar' => 2
		);

		return  $_SESSION['field'];

	}

	// Կպնել այլ խաղադաշտի որպես 2 խաղացող
	public static function GField($code){
		
		if(!Shashki::user_status()){
			throw new Exception('Խնդրում ենք մուտքագրվել Շաշկի-օնլայնում սեղանին միանալու համար');
		}
		
		$dasht = Shashki::DASHT();
		$string = serialize($dasht);
		$status = 'Y';
		$field = new SField(array(
			'code_1' => $code,
			'code_2' => $_SESSION['user']['code'],
			'field'  => $string,
			'status' => $status,
			'xod' => 2
		));
	
		if(!$field->upgrade()){
			throw new Exception('Ներողություն․․․ չհաջողվեց միանալ սեղանին');
		}
		
		$_SESSION['field'] = array(
			'name' => $code,
			'name_1' => 'player1',
			'name_2' => $_SESSION['user']['name'],
			'code_1' => $code,
			'code_2' => $_SESSION['user']['code'],
			'field'  => $dasht,
			'status' => $status,
			'xod' => '2',
			'qar' => 3
		);

		return $_SESSION['field'];

	}
	// Ստանում է բազայից խաղադաշտը և ուղարկում է բրաուզերին
	public static function 	getUsersField(){
		$status = 'Y';
		if (isset($_SESSION['field']['name'])) {
			$result = DB::query("SELECT * FROM tbl_field WHERE code_1='".$_SESSION["field"]["name"]."' AND status='".$status."' ");
			$shashki=$result->fetch_object();
			if($shashki && $shashki->xod==$_SESSION['field']['qar']){
				$_SESSION['field'] = array(
					'name'   => $shashki->code_1,
					'code_1' => $shashki->code_1,
					'code_2' => $shashki->code_2,
					'field'  => unserialize($shashki->field),
					'status' => $shashki->status,
					'xod' => $shashki->xod,
					'qar'    => $_SESSION['field']['qar']
				);


				return $_SESSION['field'];
			}else{
				return false;
			}

		}	
	}
	// Բրաուզերից ստանում է և թարմացնում է խաղադաշտն
	public static function reqfield($reqxaxaqar){
		$status = 'Y';
		
		if(!Shashki::field_status()){
			throw new Exception('Չհաջողվեց!!! Սեղանը գոյություն չունի');
		}

		$XOD = 0;
		$result = DB::query("SELECT * FROM tbl_field WHERE code_1='".$_SESSION["field"]["name"]."' AND status='".$status."'");
		$shashki=$result->fetch_object();
		$GLOBALS["dasht"] = unserialize($shashki->field);
		$GLOBALS["checkxaxaqar"] = [];
		$GLOBALS["n"] =0;
		$GLOBALS["tanel"] = false;
		$GLOBALS["gnal"] = false;
		$jsxaxqar = json_decode($reqxaxaqar);
		Stugum();
		$k=0;
		// return "valos dya";
		if ($GLOBALS["tanel"]) {
		while ($GLOBALS["tanel"]) {
			for($i=0;$i<$GLOBALS["n"];$i++){
				if($jsxaxqar[0][$k]==$GLOBALS["checkxaxaqar"][$i]->i 
					&& $jsxaxqar[1][$k]==$GLOBALS["checkxaxaqar"][$i]->j 
						&& $jsxaxqar[0][$k+1]==$GLOBALS["checkxaxaqar"][$i]->ii 
							&& $jsxaxqar[1][$k+1]==$GLOBALS["checkxaxaqar"][$i]->jj  
								&& dirq($jsxaxqar[0][$k+2],$jsxaxqar[1][$k+2],$GLOBALS["checkxaxaqar"][$i])){
					if($jsxaxqar[0][$k+2] == damka() && $GLOBALS["dasht"][$jsxaxqar[0][$k]][$jsxaxqar[1][$k]] == $_SESSION['field']['qar']){
						$damkaqar = 0-$GLOBALS["dasht"][$jsxaxqar[0][$k]][$jsxaxqar[1][$k]];
					} else {
						$damkaqar = $GLOBALS["dasht"][$jsxaxqar[0][$k]][$jsxaxqar[1][$k]];
					}
					$GLOBALS["dasht"][$jsxaxqar[0][$k]][$jsxaxqar[1][$k]] = 1;
					$GLOBALS["dasht"][$jsxaxqar[0][$k+1]][$jsxaxqar[1][$k+1]] = 1;
					$GLOBALS["dasht"][$jsxaxqar[0][$k+2]][$jsxaxqar[1][$k+2]] = $damkaqar;
					$a = $GLOBALS["checkxaxaqar"][$i]->a;
					$GLOBALS["checkxaxaqar"] = [];
					$GLOBALS["n"] = 0;
					$GLOBALS["tanel"] = false;
					tanelqar($jsxaxqar[0][$k+2],$jsxaxqar[1][$k+2],$a);
					$XOD = xod();
					$k+=2;
				}
			}
		}	
		} else {
			if(abs($GLOBALS["dasht"][$jsxaxqar[0][0]][$jsxaxqar[1][0]]) == $_SESSION['field']['qar']){
				Anjeliaka($jsxaxqar[0][0],$jsxaxqar[1][0]);
				if ($GLOBALS["gnal"]) {
					for($i=0;$i<$GLOBALS["n"];$i++){
						if(dirq($jsxaxqar[0][1],$jsxaxqar[1][1],$GLOBALS["checkxaxaqar"][$i])){
							if($jsxaxqar[0][1] == damka() && $GLOBALS["dasht"][$jsxaxqar[0][0]][$jsxaxqar[1][0]] == $_SESSION['field']['qar']){
								$damkaqar = 0-$GLOBALS["dasht"][$jsxaxqar[0][0]][$jsxaxqar[1][0]];
							} else {
								$damkaqar = $GLOBALS["dasht"][$jsxaxqar[0][0]][$jsxaxqar[1][0]];
							}
							$GLOBALS["dasht"][$jsxaxqar[0][0]][$jsxaxqar[1][0]] = 1;
							$GLOBALS["dasht"][$jsxaxqar[0][1]][$jsxaxqar[1][1]] = $damkaqar;
							$XOD = xod();
						}
					}	
				}
         	} 
		}



		if($_SESSION['field']['name'] && $XOD == xod() && $shashki->status == $status){
			$field = new SField(array(
				'code_1' => $shashki->code_1,
				'code_2' => $shashki->code_2,
				'field'  => serialize($GLOBALS["dasht"]),
				'status' => $status,
				'xod' => $XOD
			));
		
			if(!$field->upgrade()){
				throw new Exception('Չհաջողվեց');
			}
		return true;
		}
		return false;
		// return $_SESSION['field'];
	}
	// Ստանալ տվյալներ բազայից խաղադաշտերի մասին և թարմացնել բազայի ժմնկ
	public static function getField(){
		if($_SESSION['user']['code']){
			$user = new SUser(array('code' => $_SESSION['user']['code']));
			$user->update();
		}
		if($_SESSION['field']['name']){
			$f = new SField(array('code_1' => $_SESSION['field']['name']));
			$f->update();
		}
		
		// Ջնջում է բազայից 5 րոպե և 30 վարկյան առաջ դուրս եկաց մարդկանց և դաշտերի տվյալները
		
		DB::query("DELETE FROM tbl_users WHERE last_activity < SUBTIME(NOW(),'01:00:00')");
		DB::query("DELETE FROM tbl_field WHERE ts < SUBTIME(NOW(),'00:30:00')");

		// DB::query("DELETE FROM tbl_chat WHERE 'time' < SUBTIME(NOW(),'00:30:00')");
		
		$result = DB::query('SELECT code_1,code_2,status FROM tbl_field ORDER BY code_1 ASC LIMIT 18');
		
		$fields = array();
		while($fild = $result->fetch_object()){
			// $fild->code_1 = $fild->code_1;
			$anun1 = DB::query("SELECT name FROM tbl_users WHERE code = '".$fild->code_1."'");
			$fields[0][] =  $anun1->fetch_object()->name;
			$fields[1][] = $fild;
			$anun2 = DB::query("SELECT name FROM tbl_users WHERE code = '".$fild->code_2."'");
			$fields[2][] =  $anun2->fetch_object()->name;
		}
	
		return array(
			'fields' => $fields,
			'total' => DB::query('SELECT COUNT(*) as cnt FROM tbl_field')->fetch_object()->cnt
		);
	}


	public static function submitChat($chatText){
		
		if(!Shashki::field_status()){
			throw new Exception('Դուք չեք կարող նամակ գրել');
		}
		// if(!$_SESSION['user']){
		// 	throw new Exception('You are not logged in');
		// }
		if(!$chatText){
			throw new Exception('You haven\' entered a chat message.');
		}
	
		$chat = new ChatLine(array(
			'chatID' => $_SESSION['field']['name'],
			'author' => $_SESSION['user']['name'],
			'code'   => $_SESSION['user']['code'],
			'text'   => $chatText
		));
		// return $chat;
	
		// The save method returns a MySQLi object
		$insertID = $chat->save()->insert_id;
	
		return array(
			'status'	=> 1,
			'insertID'	=> $insertID
		);
	}

	public static function getChats($lastID){
		$lastID = (int)$lastID;
		// return "sxale"
		$result = DB::query("SELECT * FROM tbl_chat WHERE chatID = '".$_SESSION['field']['name']."' AND id > '".$lastID."' ORDER BY id ASC");
	
		$chats = array();
		while($chat = $result->fetch_object()){
			
			// Returning the GMT (UTC) time of the chat creation:
			
			$chat->time = array(
				'hours'		=> gmdate('H',strtotime($chat->time)),
				'minutes'	=> gmdate('i',strtotime($chat->time))
			);
			
			// $chat->gravatar = Chat::gravatarFromHash($chat->gravatar);
			
			$chats[] = $chat;
		}
	
		return array('chats' => $chats);
	}
	
	public static function getUsersName(){
		// $status = 'Y';
		$result = DB::query("SELECT code_1,code_2,status FROM tbl_field WHERE code_1='".$_SESSION["field"]["name"]."'");
		$fild = $result->fetch_object();
		
		$anun1 = DB::query("SELECT name FROM tbl_users WHERE code = '".$fild->code_1."'");

		$anun2 = DB::query("SELECT name FROM tbl_users WHERE code = '".$fild->code_2."'");
		
		return array(
				'a2' => $anun1->fetch_object()->name,
				'a3' => $anun2->fetch_object()->name,
				'status' => $fild->status
			);
	
	}


	
}


?>