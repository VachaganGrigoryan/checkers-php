<?php

class SUser extends ChatBase{
	
	protected $name = '', $ip = '', $code = '';
	
	public function save(){
		
		DB::query("
			INSERT INTO tbl_users (name, ip, code)
			VALUES (
				'".DB::esc($this->name)."',
				'".DB::esc($this->ip)."',
				'".DB::esc($this->code)."'
		)");
		
		return DB::getMySQLiObject();
	}
	
	
	public function update(){
		DB::query("UPDATE tbl_users SET last_activity = NOW() WHERE code = '".DB::esc($this->code)."'");
	}
}
?>