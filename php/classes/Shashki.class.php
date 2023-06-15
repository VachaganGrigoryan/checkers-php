<?php 

class Shashki {
	
	public static function DASHT()
	{
		$dasht = array( [0, 2, 0, 2, 0, 2, 0, 2],
						[2, 0, 2, 0, 2, 0, 2, 0],
						[0, 2, 0, 2, 0, 2, 0, 2],
						[1, 0, 1, 0, 1, 0, 1, 0],
						[0, 1, 0, 1, 0, 1, 0, 1],
						[3, 0, 3, 0, 3, 0, 3, 0],
						[0, 3, 0, 3, 0, 3, 0, 3],
						[3, 0, 3, 0, 3, 0, 3, 0]
					);	
		return $dasht;
	}


	/**
	* Get User IP Adress
	*/
	public static function getIP(){
	    if (!empty($_SERVER['HTTP_CLIENT_IP'])){
	        $ip=$_SERVER['HTTP_CLIENT_IP'];
	    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
	        $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
	    } else {
	        $ip=$_SERVER['REMOTE_ADDR'];
	    }
	    return $ip;
	}

	public static function user_status()
	{
		$result = DB::query("SELECT code FROM tbl_users WHERE code = '".$_SESSION["user"]["code"]."'");
		if($result->fetch_object()){
			return true;
		}
		return false;
	}

	public static function field_status()
	{
		$status = 'Y';
		$rlt = DB::query("SELECT * FROM tbl_field WHERE code_1='".$_SESSION["field"]["name"]."' AND status='".$status."'");
		if($rlt->fetch_object()){
			return true;
		}
		return false;
	}
}

 ?>