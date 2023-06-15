<?php

/* Chat line is used for the chat entries */

class ChatLine extends ChatBase{
	
	protected $text = '', $author = '', $code = '', $chatID = '';
	
	public function save(){
		DB::query("
			INSERT INTO tbl_chat (chatID, author, code, text)
			VALUES (
				'".DB::esc($this->chatID)."',
				'".DB::esc($this->author)."',
				'".DB::esc($this->code)."',
				'".DB::esc($this->text)."'
		)");
		
		// Returns the MySQLi object of the DB class
		
		return DB::getMySQLiObject();
	}
}

?>