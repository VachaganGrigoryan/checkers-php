<?php

class SField extends ChatBase{
	
	protected $code_1 = '', $code_2 = '', $field = '', $status = '', $xod = '';
	
	public function save(){
		
		DB::query("
			INSERT INTO tbl_field (code_1, field, status)
			VALUES (
				'".DB::esc($this->code_1)."',
				'".DB::esc($this->field)."',
				'".DB::esc($this->status)."'
		)");
		
		return DB::getMySQLiObject();
	}
	
	public function update(){
		DB::query("UPDATE tbl_field SET ts = NOW() WHERE code_1 = '".DB::esc($this->code_1)."'");
	}

	public function upgrade(){
		DB::query("UPDATE tbl_field SET ts = NOW(), code_2 = '".DB::esc($this->code_2)."', field = '".DB::esc($this->field)."', status = '".DB::esc($this->status)."', xod = '".DB::esc($this->xod)."' WHERE code_1 = '".DB::esc($this->code_1)."'");

		return DB::getMySQLiObject();
	}

	public function fieldupdate()
	{
		DB::query("UPDATE tbl_field SET field = '".DB::esc($this->field)."' WHERE code_1 = '".DB::esc($this->code_1)."'");
	}
}

?>