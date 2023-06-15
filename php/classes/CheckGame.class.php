<?php 

function xod(){
	if ($_SESSION['field']['qar']==2){
		return 3;
	}else if ($_SESSION['field']['qar']==3){
		return 2;
	}
}
function damka(){
	if ($_SESSION['field']['qar']==2){
		return 7;
	}else if ($_SESSION['field']['qar']==3){
		return 0;
	}
}
//Ստուգում է տվյալ դաշտի գոյությունը
function checktype($i,$j){
	global $dasht;
	if (isset($dasht[$i])) {
		if(isset($dasht[$i][$j])){
			return true;
		} else {
		return false;
		}
	} else {
		return false;
	}
}

function Stugum(){
	global $dasht;
	global $checkxaxaqar;
	global $n;
	global $tanel;
	// return $dasht[0][0];
	for ($i = 0; $i < count($dasht); $i++)
	    for($j=0; $j < count($dasht); $j++){
			if(abs($dasht[$i][$j]) == $_SESSION['field']['qar']){
				tanelqar($i,$j,0);
			} 
		}
	// return $checkxaxaqar;

}

function tanelqar($i,$j,$a){
	// return "վալօդ ձյա";
	global $dasht;
	global $checkxaxaqar;
	global $n;
	global $tanel;
		// echo var_dump($dasht);
	($dasht[$i][$j]==-$_SESSION['field']['qar'] ? $k = 1 : $k = 0);
	//Դեպի վեր-աջ կողմի դաշտի ստուգում n աստիճանի
		// echo $dasht[$i][$j];
	$gg = 2;
	for($g=1;$g<$gg;$g++){
		if ($a!=2 && checktype($i-$g,$j+$g) && abs($dasht[$i-$g][$j+$g])==xod()) {
			$m = 2;
			for($q=1;$q<$m;$q++){
				if (checktype($i-$g-$q,$j+$g+$q) && $dasht[$i-$g-$q][$j+$g+$q]==1) {
					$tanel = true;
					if ($q==1){
						$obj = new stdObject();
						$obj->i = $i;
						$obj->j = $j;
						$obj->d = $dasht[$i][$j];
						$obj->a = 4;
						$obj->ii = $i-$g;
						$obj->jj = $j+$g;
					}
					$x="i".$q;
					$obj->$x = $i-$g-$q;
					$y="j".$q;
					$obj->$y = $j+$g+$q;
					if ($k==0) {
						$obj->q = $m;
				    	$checkxaxaqar[$n] = $obj;
				    	$n++;
					}
					$m=$m+$k;
				} 
			}
			if ($m>2) {
				$obj->q = $m-1;
		    	$checkxaxaqar[$n] = $obj;
		    	$n++;
			}
		}else{
			(checktype($i-$g,$j+$g) && $dasht[$i-$g][$j+$g]==1 && $gg<=8 ? $gg = $gg+$k : $gg = $gg);
		}
	}

	//Դեպի վեր-ձախ կողմի դաշտի ստուգում n աստիճանի
	$gg = 2;
	for($g=1;$g<$gg;$g++){
			// echo $dasht[$i-$g][$j-$g];
		if ($a!=3 && checktype($i-$g,$j-$g) && abs($dasht[$i-$g][$j-$g])==xod()) {
		   $m = 2;
			for($q=1;$q<$m;$q++){
				if (checktype($i-$g-$q,$j-$g-$q) && $dasht[$i-$g-$q][$j-$g-$q]==1) {
					$tanel = true;
					if ($q==1){
						$obj = new stdObject();
						$obj->i = $i;
						$obj->j = $j;
						$obj->d = $dasht[$i][$j];
						$obj->a = 1;
						$obj->ii = $i-$g;
						$obj->jj = $j-$g;
					}
					$x="i".$q;
					$obj->$x = $i-$g-$q;
					$y="j".$q;
					$obj->$y = $j-$g-$q;
					if ($k==0) {
						$obj->q = $m;
				    	$checkxaxaqar[$n] = $obj;
				    	$n++;
					}
					$m=$m+$k;
				} 
			}
			if ($m>2) {
				$obj->q = $m-1;
		    	$checkxaxaqar[$n] = $obj;
		    	$n++;
			}
		}else{
			(checktype($i-$g,$j-$g) && $dasht[$i-$g][$j-$g]==1 && $gg<=8 ? $gg = $gg+$k : $gg = $gg);
		}
	}

	//Դեպի ներքև-աջ կողմի դաշտի ստուգում n աստիճանի
	$gg = 2;
	for($g=1;$g<$gg;$g++){
		// echo $dasht[$i+$g][$j+$g].$dasht[$i+$g+1][$j+$g+1];
		if ($a!=1 && checktype($i+$g,$j+$g) && abs($dasht[$i+$g][$j+$g])==xod()) {
		    $m = 2;
			for($q=1;$q<$m;$q++){
				if (checktype($i+$g+$q,$j+$g+$q) && $dasht[$i+$g+$q][$j+$g+$q]==1) {
					$tanel = true;
					if ($q==1){
						$obj = new stdObject();
						$obj->i = $i;
						$obj->j = $j;
						$obj->d = $dasht[$i][$j];
						$obj->a = 3;
						$obj->ii = $i+$g;
						$obj->jj = $j+$g;
					}
					$x="i".$q;
					$obj->$x = $i+$g+$q;
					$y="j".$q;
					$obj->$y = $j+$g+$q;
					if ($k==0) {
						$obj->q = $m;
				    	$checkxaxaqar[$n] = $obj;
				    	$n++;
					}
					$m=$m+$k;
				} 
			}
			if ($m>2) {
				$obj->q = $m-1;
		    	$checkxaxaqar[$n] = $obj;
		    	$n++;
			}
		}else{
			(checktype($i+$g,$j+$g) && $dasht[$i+$g][$j+$g]==1 && $gg<=8 ? $gg = $gg+$k : $gg = $gg);
		}
	}

	//Դեպի ներքև-ձախ կողմի դաշտի ստուգում n աստիճանի
	$gg = 2;
	for($g=1;$g<$gg;$g++){
		if ($a!=4 && checktype($i+$g,$j-$g) && abs($dasht[$i+$g][$j-$g])==xod()) {
			$m = 2;
			for($q=1;$q<$m;$q++){
				if (checktype($i+$g+$q,$j-$g-$q) && $dasht[$i+$g+$q][$j-$g-$q]==1) {
					$tanel = true;
					if ($q==1){
						$obj = new stdObject();
						$obj->i = $i;
						$obj->j = $j;
						$obj->d = $dasht[$i][$j];
						$obj->a = 2;
						$obj->ii = $i+$g;
						$obj->jj = $j-$g;
					}
					$x="i".$q;
					$obj->$x = $i+$g+$q;
					$y="j".$q;
					$obj->$y = $j-$g-$q;
					if ($k==0) {
						$obj->q = $m;
				    	$checkxaxaqar[$n] = $obj;
				    	$n++;
					}
					$m=$m+$k;
				} 
			}
			if ($m>2) {
				$obj->q = $m-1;
		    	$checkxaxaqar[$n] = $obj;
		    	$n++;
			}
		}else{
			(checktype($i+$g,$j-$g) && $dasht[$i+$g][$j-$g]==1 && $gg<=8 ? $gg = $gg+$k : $gg = $gg);
		}
	}
}

function dirq($o,$p,$checkqar){
	for ($i=1; $i<$checkqar->q; $i++) { 
		$x="i".$i;
		$y="j".$i;
		if ($o==$checkqar->$x && $p==$checkqar->$y) {
			return true;	
		}	
	}
	return false;
}

// Ստուգում է թե որ ուղղությամբ կարող է գնալ եթե չկան տանվող քարեր (և սովորական քարի, և դամկայի համար)
function Anjeliaka($i,$j){
	global $dasht;
	global $checkxaxaqar;
	global $n;
	global $gnal;
	// Վերադարձնում է 1 եթե սեղմած քարը դամկա է
	($dasht[$i][$j]==-$_SESSION['field']['qar'] ? $k = 1 : $k = 0);
    // Այս երկու գործողությունը կատարում է միայն դամկայի կամ 2-րդ խաղացողի դեպքում
	if($k==1 || abs($dasht[$i][$j])==3){
	    //Դեպի վեր-աջ կողմի դաշտի ստուգում n-1 աստիճանի
		$m = 2;
	    for($q=1;$q<$m;$q++){
		    if (checktype($i-$q,$j+$q) && $dasht[$i-$q][$j+$q]==1){
				if ($q==1){
					$gnal = true;
					$obj = new stdObject();
					$obj->i = $i;
					$obj->j = $j;
					$obj->d = $dasht[$i][$j];
				}
				$x="i".$q;
				$obj->$x = $i-$q;
				$y="j".$q;
				$obj->$y = $j+$q;
				if ($k==0) {
					$obj->q = $m;
			    	$checkxaxaqar[$n] = $obj;
			    	$n++;
				}
				$m=$m+$k;
			} 	
	    }
	    if ($m>2) {
			$obj->q = $m-1;
	    	$checkxaxaqar[$n] = $obj;
	    	$n++;
		}
		
		//Դեպի վեր-ձախ կողմի դաշտի ստուգում n-1 աստիճանի
		$m = 2;
		for($q=1;$q<$m;$q++){
			if (checktype($i-$q,$j-$q) && $dasht[$i-$q][$j-$q]==1){
				if ($q==1){
					$gnal = true;
					$obj = new stdObject();
					$obj->i = $i;
					$obj->j = $j;
					$obj->d = $dasht[$i][$j];
				}
				$x="i".$q;
				$obj->$x = $i-$q;
				$y="j".$q;
				$obj->$y = $j-$q;
				if ($k==0) {
					$obj->q = $m;
			    	$checkxaxaqar[$n] = $obj;
			    	$n++;
				}
				$m=$m+$k;
			} 
		}
		if ($m>2) {
			$obj->q = $m-1;
	    	$checkxaxaqar[$n] = $obj;
	    	$n++;
		}
	}
	// Այս երկու գործողությունը կատարում է միայն դամկայի կամ 1-ին խաղացողի դեպքում
    if($k==1 or abs($dasht[$i][$j])==2){
		 //Դեպի ներքև-աջ կողմի դաշտի ստուգում n-1 աստիճանի
		$m = 2;
	    for($q=1;$q<$m;$q++){
		    if (checktype($i+$q,$j+$q) && $dasht[$i+$q][$j+$q]==1) {
				if ($q==1){
					$gnal = true;
					$obj = new stdObject();
					$obj->i = $i;
					$obj->j = $j;
					$obj->d = $dasht[$i][$j];
				}
				$x="i".$q;
				$obj->$x = $i+$q;
				$y="j".$q;
				$obj->$y = $j+$q;
				if ($k==0) {
				    $obj->q = $m;
			    	$checkxaxaqar[$n] = $obj;
			    	$n++;
				}
				$m=$m+$k;
			} 
	    }
		if ($m>2) {
			$obj->q = $m-1;
	    	$checkxaxaqar[$n] = $obj;
	    	$n++;
		}	
		

	    //Դեպի ներքև-ձախ կողմի դաշտի ստուգում n-1 աստիճանի
	    $m = 2;
		for($q=1;$q<$m;$q++){
			if (checktype($i+$q,$j-$q) && $dasht[$i+$q][$j-$q]==1) {
				if ($q==1){
					$gnal = true;
					$obj = new stdObject();
					$obj->i = $i;
					$obj->j = $j;
					$obj->d = $dasht[$i][$j];
				}
				$x="i".$q;
				$obj->$x = $i+$q;
				$y="j".$q;
				$obj->$y = $j-$q;
				if ($k==0) {
				    $obj->q = $m;
			    	$checkxaxaqar[$n] = $obj;
			    	$n++;
				}
				$m=$m+$k;
			} 
		}
		if ($m>2) {
			$obj->q = $m-1;
	    	$checkxaxaqar[$n] = $obj;
	    	$n++;
		}
    }	
}


class stdObject {
    public function __construct(array $arguments = array()) {
        if (!empty($arguments)) {
            foreach ($arguments as $property => $argument) {
                $this->{$property} = $argument;
            }
        }
    }

    public function __call($method, $arguments) {
        $arguments = array_merge(array("stdObject" => $this), $arguments); // Note: method argument 0 will always referred to the main class ($this).
        if (isset($this->{$method}) && is_callable($this->{$method})) {
            return call_user_func_array($this->{$method}, $arguments);
        } else {
            throw new Exception("Fatal error: Call to undefined method stdObject::{$method}()");
        }
    }
}


 ?>