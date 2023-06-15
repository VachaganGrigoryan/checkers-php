$(document).ready(function(){	
	// Գլխավոր ֆունկցիայի կանչ
	chat.init();	    
});
var foodMusic = document.getElementById("food");
var canvas = document.getElementById("canvas"), ctx = canvas.getContext('2d');
var rects = []; /* Ամենակարևոր մասիվը , այստեղ պահվում է գրեթե ամեն բան, խաղաքարի և դաշտի մասին , այն 8*8 չափի է
					և իր մեջ պահում է օբյեկտ՝ (0,1,2,3,D) արժեքներով, դաշտի և խաղաքարի գույները, չափերը (x,y,xyr,radius)*/
var map;
var checkxaxaqar = [],tanel = false,a; // Տնավող խաղաքարերի համար մասիվ, տանվող խաղաքարի առկայություն, a ուղղություն
var n=0,b=1; 
var xod, player, fcolor; // հերթ, խաղացող, խաղացողի քարի գույն
var xaxaqar = new function(){}; // քեշ որտեղ պահվում է քարերի դիրքը 
var cleartime; // խաղից դուս գալու ժամանակ անջատում է կատարվող հարցումը
var reqxaxaqar = [[],[]],x=0;
// Խաղաղադաշտի չափերի որոշում կախված սարքի էկրանի չափերից
function updateContainer() {
	if($(window).width() >= 1200){
		cellSize = 70, radius = cellSize/3, circell = 75; 
	}else if($(window).width() >= 992){
		cellSize = 60, radius = cellSize/3, circell = 70; 
	}else if($(window).width() >= 768){
		cellSize = 50, radius = cellSize/3, circell = 65; 
	}else if($(window).width() < 767){
		cellSize = 40, radius = cellSize/3, circell = 60; 
	} 
}
updateContainer();
// Եթե խաղի ընթացքում փոխնել են էկրանի չափերը, ավտոմատ որոշվում և փոխարինվում է նաղկինը
$(window).resize(function() {
	updateContainer();
	$.tzGET('checkLogged',function(r){
		if(r.logged_field){
			chat.field_login(r.field);
			chat.DrawGame(r.field);
		}
	});
});
var scrollHeight=200;
var chat = {

	data : {
		lastID 		: 0,
		noActivity	: 0
	},
	// Գլխավոր ֆունկցիան է որն ավտոմատ թարմացվում է ժամանակի ընթացքում
	
	init : function(){

		// var working = false;
		
		// Մտնել Շաշկի օնլայն 
		$('#loginForm').submit(function(){
			
			// if(working) return false;
			// working = true;
				
			$.tzPOST('login',$(this).serialize(),function(r){
				// working = false;
				// console.log("grancvel e");
				if(r.error){
					chat.displayError(r.error);
					// console.log("chi grancvel");
				}else {
					chat.login(r.name, r.ip, r.code);
				}
			});

			return false;
		});
		
		// Ստեղծել նոր սեղան
		$('button#submitForm').live('click', function(){
			
			$.tzGET('submitField',function(r){
				// working = false;
				if(r.error){
					chat.displayError(r.error);
					// console.log("chi grancvel");
				}else {
					// var arrExtracted = $.unserialize(r.field);
					// console.log(r);
					chat.field_login(r);
					chat.DrawGame(r);

				}
				
			});
			
			return false;
		});
		
		// Մտնել խաղի մեջ կպնելով այլ արդեն իսկ ստեղծած սեղանի
		$('a.field').live('click',function(){
			var code = this.id;
			$.tzPOST('GField','code='+code,function(r){
				// working = false;
				if(r.error){
					chat.displayError(r.error);
					// console.log("chhajoxvec kpnel xaxin");
				}else {
					// var arrExtracted = $.unserialize(r.field);

					// console.log(r);
					chat.field_login(r);
					chat.DrawGame(r);
				}

			});
		});

		// Դուրս գալ Շաշկի օնլայնից
		$('button.logoutButton').live('click',function(){
			
			$('#TopBar > ul').fadeOut(function(){
				$(this).remove();
			});
			
			$('#Games').fadeOut(function(){
				$('#Forms').fadeIn();
			});
		
			$.tzPOST('logout');
			
			return false;
		});
		
		// Դուրս գալ խաղից
		$('button.closeGame').live('click',function() {
			// var code = this.id;
			$.tzPOST('logoutGame',function(r){
				// console.log(r);
				$('#Games').fadeOut(function(){
					$('button#submitForm').fadeIn();
				});
				chat.getField();
				cleartime = 1;
			});
			// chat.getUsersField();
		});
		// Ձեռքով Թարմացնել դաշտը
		$('button.reloadGame').live('click', function(){
			// chat.getUsersField();
			$.tzGET('checkLogged',function(r){
				if(r.logged_field){
					chat.field_login(r.field);
					chat.DrawGame(r.field);
				}else{
					$('#Games').fadeOut(function(){
						$('button#submitForm').fadeIn();
						
					});
					chat.getField();
				}
			});
		});
		// Ձեռքով Գտնել սեղան
		$('button#reloadfield').live('click', function(){
			chat.getField();
		});

		// F5 սեղմելուց հետո ստուգում է ակունտի և դաշտի գոյությունը և վերբեռնվում է այն
		$.tzGET('checkLogged',function(r){
			if(r.logged){
				chat.login(r.loggedAs.name,r.loggedAs.ip,r.loggedAs.code);
			}
			if(r.logged_field){
				chat.field_login(r.field);
				chat.DrawGame(r.field);
			}
				// console.log(r);
		});

		// Նամկի ուղղարկում		
		$('#submitChat').submit(function(){
			
			var text = $('#chatText').val();
			
			if(text.length == 0){
				return false;
			}
			
			// if(working) return false;
			// working = true; 
			
			// Assigning a temporary ID to the chat:
			var str = chat.data.name;
    		var resname = str.split("", 1);
    		// console.log(resname);
			var tempID = 't'+Math.round(Math.random()*1000000),
				params = {
					id			: chat.data.chatID,
					author		: chat.data.name,
					gravatar	: chat.data.code,
					text		: text.replace(/</g,'&lt;').replace(/>/g,'&gt;')
				};

			// Using our addChatLine method to add the chat
			// to the screen immediately, without waiting for
			// the AJAX request to complete:
			
			// chat.addChatLine($.extend({},params));
			
			// Using our tzPOST wrapper method to send the chat
			// via a POST AJAX request:
			
			$.tzPOST('submitChat',$(this).serialize(),function(r){
				// working = false;
				// console.log(r);
				if(r.error){
					chat.displayError(r.error);
					// console.log("chhajoxvec kpnel xaxin");
				}else {
				$('#chatText').val('');
				$('div.chat-'+tempID).remove();
				
				params['id'] = r.insertID;
				chat.addChatLine($.extend({},params));
				}
				
			});
			
			return false;
		});
			
	
		(function getChatsTimeoutFunction(){
			chat.getChats(getChatsTimeoutFunction);
		})();
		
		(function getFieldTimeoutFunction(){
			chat.getField(getFieldTimeoutFunction);
		})();
		
		// (function getUsersFieldTimeoutFunction(){
		// 	chat.getUsersField(getUsersFieldTimeoutFunction);
		// })();
	},
	
	// Օգտագործողի տվյալների արտածում
	login : function(name,ip,code){
		// console.log(name);
		chat.data.name = name;
		chat.data.ip = ip;
		chat.data.code = code;
		$('#TopBar').html(chat.render('loginTopBar',chat.data));
		
		$('#Forms').fadeOut(function(){
			$('button#submitForm').fadeIn();
			
		});
	},

	// Երբ ստեղծում կամ կպնում են խաղադաշտի
	field_login : function(field){
		chat.data.chatID = field.name;
		// console.log(chat.data);
		$('#Games').fadeIn(function(){
			$('button#submitForm').fadeOut();
		});
	},
	
	// Ռենդերի միջոցով գեներացնում ենք հտմլ կոդ 
	render : function(template,params,pname1,pname2){
		var arr = [];
		switch(template){
			case 'loginTopBar':
				arr = [
				'<ul class="nav navbar-nav navbar-right">', //<li><a>',params.code,'</a> </li><li><a>',params.ip,'</a> </li>
				'<li class="name" style="font-size: 22px;"><span class="label label-success">',params.name,
				'</span></li><li><button href="" class="logoutButton btn btn-danger">Դուրս գալ Շաշկի օնլայնից</button></li></ul>'];
			break;
			// <span href="#" class="list-group-item list-group-item-success">Dapibus ac facilisis in</span>
			case 'chatLine':
				var str = params.author;
    			var reqname = str.split("", 1);
				(chat.data.code==params.code ? clas="success" : clas="danger");
				arr = [
					'<div class="list-group-item list-group-item-',clas,' chat chat-',params.id,' rounded">',
					'<span class="gravatar label label-',clas,'" width="23" height="23">',reqname,
					'</span><span class="author">',params.author,
					':</span><span class="text">',params.text,'</span><span class="time">',params.time,'</span></div>'];
			break;
			
			case 'field':
			    if(params.status=='N'){
				arr = [
					'<a href="#" class="list-group-item list-group-item-success field" id=',params.code_1,'><span class="label label-info">',pname1,
					'</span>',params.code_1,
					'<span class="badge">',params.status,'</span></a>'
				];
			    }else{
			  	arr = [
					'<a href="#" class="disabled list-group-item list-group-item-danger" id=',params.code_1,'><span class="label label-danger">',pname1,
					'</span>',params.code_1,'<span class="label label-danger">',pname2,
					'</span><span class="badge">',params.status,'</span></a>'
				]; 	
			    }
			break;
		}
		
		// Հտմլ կոդը վերադարձնում է մասիվի տեսքով 
		
		return arr.join('');
	},
	
	// Բազայից ստանում է բոլոր խաղադաշտերի տվյալները
	getField : function(callback){
		$.tzGET('getField',function(r){
			
			var fields = [];

			for(var i=0; i< r.fields.length;i++){
				if(r.fields[1][i]){
					fields.push(chat.render('field',r.fields[1][i],r.fields[0][i],r.fields[2][i]));
				}
			}
			
			var message = '';
			
			if(r.total<1){
				message = 'Խաղասեղան չկա';
			}
			else {
				message = '<span class="badge">'+r.total+'</span>'+' '+'Խաղասեղան';
			}
			$('.panel-heading h4').remove();
	    	var elem = $('<h4>',{html	: message });
			elem.appendTo('#panel-field .panel-heading');


			$('#fields').html(fields.join(''));
			// Ֆունկցիան նույնաբար կանչում է իրեն 1 րոպե հետո 
			setTimeout(callback,60000);
		});
	},
	
	// Բազայից ստանում է խաղադաշտի քարտեզը և թարմացնում է պատկերը
	getUsersField : function(callback){

		$.tzGET('getUsersField',function(r){
			
			// երբ խաղակիցը սպասում է մրցակցի խաղին
			nextRequest = 1000;
			
			// երբ խաղացողներից որևէ մեկը լքում է խաղը
			if(cleartime==1){
				nextRequest = 500000000000;
			}
			// if (xod==player) {
			// }
			// երբ ստանում է դրական պատասխան թարմացնում է խաղադաշտն և հերթն ացնում է իրեն, իսկ մրցակիցը մտնում է սպասման մեջ
			if(r){
				xod  = r.xod;
				if(xod==player){
					foodMusic.play();
					map = r.field;
					$.DRAWRECTCIRCLE(map);
					// $.Stugum();
					nextRequest = 500000000000;
					// clearTimeout();
				}
			}
			// console.log(nextRequest);
			// Տարբեր ժամանակներում այս ֆունկցիան կանչվում է յուրովի կախված խաղահերթից
			setTimeout(callback,nextRequest);

		});
	},

	// Կատարված խաղն փոխանցում է բազա 
	reqfield : function(reqxax){
		xod = $.xod();
		$.tzPOST('reqfield','reqxax='+JSON.stringify(reqxax),function(r){
			if(r.error){
				xod=player;
				chat.displayError(r.error);
				$.DRAWRECTCIRCLE(map);
			}
				$.Start();
				(function getUsersFieldTimeoutFunction(){
					chat.getUsersField(getUsersFieldTimeoutFunction);
				})();
				reqxaxaqar = [[],[]],x=0;
				// console.log(r);
		});
	},

	// The addChatLine method ads a chat entry to the page
	
	addChatLine : function(params){
		
		// All times are displayed in the user's timezone
		
		var d = new Date();
		if(params.time) {
			
			// PHP returns the time in UTC (GMT). We use it to feed the date
			// object and later output it in the user's timezone. JavaScript
			// internally converts it for us.
			
			d.setUTCHours(params.time.hours,params.time.minutes);
		}
		
		params.time = (d.getHours() < 10 ? '0' : '' ) + d.getHours()+':'+
					  (d.getMinutes() < 10 ? '0':'') + d.getMinutes();
		
		var markup = chat.render('chatLine',params),
			exists = $('#messages .chat-'+params.id);

		if(exists.length){
			exists.remove();
		}
		
		if(!chat.data.lastID){
			// If this is the first chat, remove the
			// paragraph saying there aren't any:
			
			$('#messages p').remove();
		}	
			scrollHeight +=100;
		
			$('#messages').append(markup);
		
			$('#messages').scrollTop(scrollHeight);

		
	},

	// This method requests the latest chats
	// (since lastID), and adds them to the page.
	
	getChats : function(callback){
		$.tzGET('getChats',{lastID: chat.data.lastID},function(r){
			// console.log(r);
			for(var i=0;i<r.chats.length;i++){
				chat.addChatLine(r.chats[i]);
			}
			
			if(r.chats.length){
				chat.data.noActivity = 0;
				chat.data.lastID = r.chats[i-1].id;
			}
			else{
				// If no chats were received, increment
				// the noActivity counter.
				
				chat.data.noActivity++;
			}
			
			if(!chat.data.lastID){
				$('#messages').html('<p class="noChats">Նամակ չկա</p>');
			}
			
			// Setting a timeout for the next request,
			// depending on the chat activity:
			
			var nexreq = 1000;
			
			// 2 seconds
			if(chat.data.noActivity > 3){
				nexreq = 2000;
			}
			
			if(chat.data.noActivity > 10){
				nexreq = 5000;
			}
			
			// 15 seconds
			if(chat.data.noActivity > 20){
				nexreq = 15000;
			}
		
			setTimeout(callback,nexreq);
		});
	},
	

	// Սխալը արտածում է էկրանին
	displayError : function(msg){
		var span = '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Սխալ Է</span>';
		var elem = $('<div>',{
			class		: 'alert alert-danger',
			html	: span+"  "+msg
		});
		$('.alert-danger').remove();
		elem.click(function(){
			$(this).fadeOut(function(){
				$(this).remove();
			});
		});
		
		setTimeout(function(){
			elem.click();
		},5000);
		
		elem.hide().appendTo('#alert').slideDown();
	},

	// Խաղատախտակի գծում
	DrawGame : function(field){
		map = field.field;
		xod     = field.xod;
		player  = field.qar;
		cleartime = 0;

		gcolor = '#009900';
		ccolor = "#ff6666";
		rcolor = "#ff0000";
		ycolor = "#f0f000";
		bcolor = "#0000ff";
		dcolor = "#00ff00";
		kcolor = "#ff00ff";
	    lcolor = "rgb(26, 163, 196)";

		if(player==2){
			fcolor = gcolor;
		}else if(player==3){
			fcolor = ccolor;
		}

	

		(function getUsersFieldTimeoutFunction(){
			chat.getUsersField(getUsersFieldTimeoutFunction);
		})();
		(function getFieldTimeoutFunction(){
			chat.getField(getFieldTimeoutFunction);
		})();

		var Drawrect = function(color, x, y, width, height) {
		    ctx.fillStyle = color;
		    ctx.fillRect(x, y, width, height);
		};

		function DRAWFIELD() {
		    ctx.lineWidth = 1;
		    ctx.fillStyle = lcolor;
		    ctx.fillRect(0, 0, game.xyr, game.xyr);
		    ctx.strokeStyle = '#000';
		    ctx.strokeRect(35, 35, 8*cellSize+10, 8*cellSize+10);
		    ctx.strokeRect(38, 38, 8*cellSize+4, 8*cellSize+4);
		    ctx.fillStyle = '#fff';
		    ctx.fillRect(40, 40, 8*cellSize, 8*cellSize);
		    ctx.fillStyle = '#000';
		    ctx.font = 'bold 25px courier';
		    ctx.textAlign = 'left';
		    ctx.textBaseline = 'middle';
		    ctx.fillStyle = '#000';
			for (i = 1; i <9 ; i++) {
		        ctx.fillText(9-i, 10, i*cellSize+3);
			}
			var abc=["a","b","c","d","e","f","g","h"];
			for (i = 0; i <8 ; i++) {
		        ctx.fillText(abc[i], i*cellSize+65, game.xyr-15);
			}
		}

		function GameShashki() {
		    // start = false;
		    game = new $.rectcircle(ctx, lcolor, 0, 0, 8*cellSize+80);
		    game.total = 0;
		    game.win = 0;
		    game.lose = 0;
		    canvas.width = game.xyr;
		    canvas.height = game.xyr;
		    // setInterval(Start, 1000);
	        DRAWFIELD();
	        $.DRAWRECTCIRCLE(map);
	    	$.Start();
		}
		GameShashki();
		// startGame();
		// function startGame() {
		// }

		// function play() {
		//     if (!start) {
		//     Start();
		//     } 
		// }
	}
};

// GET & POST & Ajax հարցումներ կատարող ֆունկցիաներ

$.tzAjax = function(url,data,callback){
	$.ajax({
	  url: url,
	  dataType: 'json',
	  data: data,
	  success: callback
	});
}

$.tzPOST = function(action,data,callback){
	$.post('php/ajax.php?action='+action,data,callback,'json');
}

$.tzGET = function(action,data,callback){
	$.get('php/ajax.php?action='+action,data,callback,'json');
}

$.fn.defaultText = function(value){
	
	var element = this.eq(0);
	element.data('defaultText',value);
	
	element.focus(function(){
		if(element.val() == value){
			element.val('').removeClass('defaultText');
		}
	}).blur(function(){
		if(element.val() == '' || element.val() == value){
			element.addClass('defaultText').val(value);
		}
	});
	
	return element.blur();
}

$.Start = function(){
	$.tzGET('getUsersName',function(r){
		// console.log(r);
		ctx.lineWidth = 1;
		ctx.fillStyle = lcolor;
		ctx.fillRect(0, 0, game.xyr, 30);
	    ctx.font = 'bold 16px courier';
	    ctx.textAlign = 'center';
	    ctx.textBaseline = 'top';
	    if (xod==3){
			ctx.fillStyle = '#000';
	    	ctx.fillText(r.a2, cellSize*2 , 10);
		    if (r.a3) {
				ctx.fillStyle = 'red';
		    	ctx.fillText(r.a3, cellSize*8, 10);
		    }
		}else if(xod==2){
	    	ctx.fillStyle = 'red';
	    	ctx.fillText(r.a2, cellSize*2 , 10);
		    if (r.a3) {
	    		ctx.fillStyle = '#000';
		    	ctx.fillText(r.a3, cellSize*8, 10);
		    }
		}
	    
	});
}

$.rectcircle = function(ctx, color, xr, yr, xyr, value, xc, yc, fillcolor, radius, linewidth, dam) {
    this.color = color;
    this.x = xr; 
    this.y = yr; 
    this.xyr = xyr; 
    this.vi = value;
    this.left = xc - radius;
    this.top = yc - radius;
    this.right = xc + radius;
    this.bottom = yc + radius;
    this.fillcolor = fillcolor;
    this.d = dam;
    this.draw = function() {
        // console.log(this.color);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.xyr, this.xyr);
    };
    this.draw();
    this.drawcircle = function(){
		ctx.save();

        ctx.beginPath();
        ctx.arc(xc, yc, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.fillcolor;
        ctx.fill();
		
		ctx.beginPath();
		ctx.arc(xc, yc, radius, 0, 1.8 * Math.PI, false);
		ctx.clip();

		ctx.beginPath();
		ctx.arc(xc - 15, yc - 15, radius, 0, 1.9 * Math.PI, false);
		ctx.fillStyle = rcolor;
		ctx.fill();

		ctx.beginPath();
		ctx.arc(xc + 20, yc-5, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = ycolor;
		ctx.fill();

		ctx.beginPath();
		ctx.arc(xc-5, yc + 20, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = bcolor;
		ctx.fill();
	 		
		ctx.beginPath();
	    ctx.arc(xc, yc, radius-10, 0, 2 * Math.PI, false);
	    ctx.fillStyle =  this.fillcolor;
	    ctx.fill();
      
		ctx.restore();
		ctx.beginPath();
		ctx.arc(xc, yc, radius, 0, 2 * Math.PI, false);
		ctx.lineWidth = linewidth;
		ctx.strokeStyle = this.fillcolor;
		ctx.stroke();
        
        if(dam){
	        ctx.lineWidth = linewidth;
	        ctx.strokeStyle = dcolor;
	        ctx.stroke();	
        }
        
    };
    this.drawcircle();
};


$.RECTCIRCLE = function (ctx, color, xr, yr, xyr, i, j, value, xc, yc, fillcolor, radius, linewidth, dam) {
    var rc = new $.rectcircle(ctx, color, xr, yr, xyr, value, xc, yc, fillcolor, radius, linewidth, dam);
    rects[i][j]=rc;   
};

$.DRAWRECTCIRCLE = function(map){
	$.Start();
    rects = [[],[],[],[],[],[],[],[]];
 	// console.log(map);
	if(player==2){
		for (i = 7; i >=0; i--)
	  	  for (j = 7; j >=0; j--) {
	        switch (Math.abs(map[7-i][7-j])){
	            case 0 :
	            $.RECTCIRCLE(ctx, "#fff", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, map[7-i][7-j]);
	            break;
	            case 1 :
	            $.RECTCIRCLE(ctx, "#000", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, map[7-i][7-j]);
	            break;
	            case 2 :
	            $.RECTCIRCLE(ctx, "#000", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, Math.abs(map[7-i][7-j]), circell+j * cellSize, circell+i * cellSize, gcolor, radius, 5, $.ABS(map[7-i][7-j]));
	            break;
	            case 3 : 
	            $.RECTCIRCLE(ctx, "#000", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, Math.abs(map[7-i][7-j]), circell+j * cellSize, circell+i * cellSize, ccolor, radius, 5, $.ABS(map[7-i][7-j]));
	            break;
	            default : 
	            console.log("Սխալա է switch");
	        }
		}  
	}else if(player==3){
		for (i = 0; i < 8; i++)
		    for (j = 0; j < 8; j++)  {
	        switch (Math.abs(map[i][j])){
	            case 0 :
	            $.RECTCIRCLE(ctx, "#fff", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, map[i][j]);
	            break;
	            case 1 :
	            $.RECTCIRCLE(ctx, "#000", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, map[i][j]);
	            break;
	            case 2 :
	            $.RECTCIRCLE(ctx, "#000", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, Math.abs(map[i][j]), circell+j * cellSize, circell+i * cellSize, gcolor, radius, 5, $.ABS(map[i][j]));
	            break;
	            case 3 : 
	            $.RECTCIRCLE(ctx, "#000", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, Math.abs(map[i][j]), circell+j * cellSize, circell+i * cellSize, ccolor, radius, 5, $.ABS(map[i][j]));
	            break;
	            default : 
	            console.log("Սխալա է switch");
	        }
		} 
	}

	// console.log(rects);
};

$.ABS = function(value){
	return (value == -2 || value == -3 ? 'D' : null);
}
$.returnABS = function(v,e){
	return (v == 'D' ? 0-e : e);
}
// Շրջում է խաղադաշտը և վերադաձնում այն
$.replacerects = function(rects){
	var replacemap = [[],[],[],[],[],[],[],[]];
	if (player==2) {
	for (i = 7; i >=0; i--)
  	  for (j = 7; j >=0; j--){
	    	replacemap[7-i][7-j] = $.returnABS(rects[i][j].d,rects[i][j].vi);
	    }	
	} else if(player==3){
	 for (var i = 0; i < 8; i++)
	    for(var j = 0; j < 8; j++){
	    	replacemap[i][j] = $.returnABS(rects[i][j].d,rects[i][j].vi);
	    }
	}
	return replacemap;
}
// Որոշում է խաղի հերթը
$.xod = function(){
	if (player==2){
		return 3;
	}else if (player==3){
		return 2;
	}
}

// Շրջում է խաղ և վերադաձնում այն
$.replacexaxaqar = function(reqxaxaqar){
	var replaceqar = [[],[]];
	if (player==2) {
	for (i = 0; i <=1; i++)
  	  for (j = 0; j < x; j++){
	    	replaceqar[i][j] = 7-reqxaxaqar[i][j];
	    }	
	} else if(player==3){
	 for (i = 0; i <=1; i++)
  	  for (j = 0; j < x; j++){
	    	replaceqar[i][j] = reqxaxaqar[i][j];
	    }
	}
		// console.log(replaceqar);
	return replaceqar;
}
// Ստուգում է տվյալ դաշտի գոյությունը
$.checktype = function(i,j){
	if (typeof(rects[i]) != 'undefined') {
		if(typeof(rects[i][j]) != 'undefined'){
			return true;
		} else {
		return false;
		}
	} else {
		return false;
	}
}
// Օբյեկտ է որը կարող է պահել տանվող քարերը
$.n = function(i,j,a,ii,jj){ this.i = i; this.j = j; this.a = a; this.ii = ii; this.jj = jj;}


// Ստուգում է եթե սեղմել ենք դաշտի կամ քարի վրա, ապա եթե կան ընտրված քարեր վերադարձնում է նախկին տեսքին
$.checkedfield = function(){
    for (var i = 0; i < rects.length; i++)
    for(var j=0; j< rects.length; j++){
    	if(rects[i][j].color == "#666"){
	        if (rects[i][j].vi == player){
	        	$.RECTCIRCLE(ctx, "#000", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, rects[i][j].vi, circell+j * cellSize, circell+i * cellSize, fcolor, radius, 5, rects[i][j].d);
	        }
	    	if (rects[i][j].vi==1) {
	        	$.RECTCIRCLE(ctx, "#000", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, 1);
	        }	
    	}
         
    }
    return true;
}

// Ստուգում է թե որ ուղղությամբ կարող է գնալ եթե չկան տանվող քարեր (և սովորական քարի, և դամկայի համար)
$.Anjeliaka = function (i,j){
	// Վերադարձնում է 1 եթե սեղմած քարը դամկա է
	(rects[i][j].d=='D' ? k = 1 : k = 0);
    //Դեպի վեր-աջ կողմի դաշտի ստուգում n-1 աստիճանի
	n = 2;
    for(q=1;q<n;q++){
	    if ($.checktype(i-q,j+q) && rects[i-q][j+q].vi==1){
			$.RECTCIRCLE(ctx, "#666", 40+(j+q) * cellSize, 40+(i-q) * cellSize, cellSize, i-q, j+q, 1);
			n=n+k;
		} 	
    }
	
	//Դեպի վեր-ձախ կողմի դաշտի ստուգում n-1 աստիճանի
	n = 2;
	for(q=1;q<n;q++){
		if ($.checktype(i-q,j-q) && rects[i-q][j-q].vi==1){
			$.RECTCIRCLE(ctx, "#666", 40+(j-q) * cellSize, 40+(i-q) * cellSize, cellSize, i-q, j-q, 1);
			n=n+k;
		} 
	}

	// Այս երկու գործողությունը կատարում է միայն դամկայի դեպքում
    if(k==1){
		 //Դեպի ներքև-աջ կողմի դաշտի ստուգում n-1 աստիճանի
		n = 2;
	    for(q=1;q<n;q++){
		    if ($.checktype(i+q,j+q) && rects[i+q][j+q].vi==1) {
				$.RECTCIRCLE(ctx, "#666", 40+(j+q) * cellSize, 40+(i+q) * cellSize, cellSize, i+q, j+q, 1);
				n=n+k;
			} 	
	    }
		

	    //Դեպի ներքև-ձախ կողմի դաշտի ստուգում n-1 աստիճանի
	    n = 2;
		for(q=1;q<n;q++){
			if ($.checktype(i+q,j-q) && rects[i+q][j-q].vi==1) {
				$.RECTCIRCLE(ctx, "#666", 40+(j-q) * cellSize, 40+(i+q) * cellSize, cellSize, i+q, j-q, 1);
				n=n+k;
			} 
		}
    }	          
}

// Ստուգում է թե վոր ուղղությամբ է քար տարել և վերադարձնում է տարված քարի դիրքը
$.direction = function(i,j,ii,jj){
	var dir;
	if(ii-i<0 && jj-j>0){
		dir = 4;
	}else if(ii-i>0 && jj-j>0){
		dir = 3;
	}else if(ii-i>0 && jj-j<0){
		dir = 2;
	}else if(ii-i<0 && jj-j<0){
		dir = 1;
	}
	for (var w=0;w<checkxaxaqar.length;w++){
		if(i == checkxaxaqar[w].i && j == checkxaxaqar[w].j && dir == checkxaxaqar[w].a){
			xaxaqar.ii = checkxaxaqar[w].ii;
			xaxaqar.jj = checkxaxaqar[w].jj;
			xaxaqar.a  = dir;
		}
	}
}

// Պահում է իր մեջ (ընտրված կամ տանող,տանվող կամ ազատ դաշտի) քարերի դիրքերը 
$.pahel = function(i,j,ii,jj){
	$.RECTCIRCLE(ctx, "#666", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, rects[i][j].vi, circell+j * cellSize, circell+i * cellSize, lcolor, radius, 5, rects[i][j].d);
	xaxaqar.d  = rects[i][j].d;
	xaxaqar.i  = i;
	xaxaqar.j  = j;
	xaxaqar.ii = ii;
	xaxaqar.jj = jj;
}




$('#canvas').click(function (e) {
    var clickedX = e.pageX - this.offsetLeft;
    var clickedY = e.pageY - this.offsetTop;
    
	if(xod==player){
		if(!tanel){
		$.Stugum();	
		}
		
	    var clickXYZ=false;
		for (var i = 0; i < rects.length; i++){
	        for(var j=0; j< rects.length; j++){
	        	if(tanel && rects[i][j].vi == player && clickedX > rects[i][j].left && clickedX < rects[i][j].right && clickedY > rects[i][j].top && clickedY < rects[i][j].bottom){
	        	$.checkedfield();
	        	
	    			for(var w=0;w<checkxaxaqar.length;w++){

	        			if(i==checkxaxaqar[w].i && j==checkxaxaqar[w].j){
	        				$.pahel(i,j,checkxaxaqar[w].ii,checkxaxaqar[w].jj);
							$.tqar(i,j,checkxaxaqar[w].a);
							clickXYZ=true;
	        			}

	        		}	
	        	}else if(!tanel && rects[i][j].vi == player && clickedX > rects[i][j].left && clickedX < rects[i][j].right && clickedY > rects[i][j].top && clickedY < rects[i][j].bottom ){
		           if($.checkedfield()){
		           		$.pahel(i, j);
		           		$.Anjeliaka(i,j);
		           }
		        }

		    	if((rects[i][j].vi == 1 || rects[i][j].vi == 0) && clickedX > rects[i][j].x && clickedX < (rects[i][j].x+cellSize) && clickedY > rects[i][j].y && clickedY < (rects[i][j].y+cellSize)){
		        	if(rects[i][j].color == "#666"){
		        	
		        	$.direction(xaxaqar.i,xaxaqar.j,i,j);
		        	var e;
		        	(i == 0 || xaxaqar.d == 'D' ? e = 0-player : e = player);	

		        	$.RECTCIRCLE(ctx, "#000", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, player, circell+j * cellSize, circell+i * cellSize, fcolor, radius, 5, $.ABS(e));
		        	$.RECTCIRCLE(ctx, "#000", 40+xaxaqar.j * cellSize, 40+xaxaqar.i * cellSize, cellSize, xaxaqar.i, xaxaqar.j, 1);
		        	reqxaxaqar[0][x]= xaxaqar.i; reqxaxaqar[1][x++]= xaxaqar.j;

		        	if(tanel){
			        	$.RECTCIRCLE(ctx, "#000", 40+xaxaqar.jj * cellSize, 40+xaxaqar.ii * cellSize, cellSize, xaxaqar.ii, xaxaqar.jj, 1);
						reqxaxaqar[0][x]=xaxaqar.ii; reqxaxaqar[1][x++]=xaxaqar.jj;
						checkxaxaqar = [],n=0,tanel = false;
			        	$.tanelqar(i,j,xaxaqar.a);	
		        	}

		        	if (!tanel) {
		        	reqxaxaqar[0][x]=i;        reqxaxaqar[1][x++]=j;
		        		chat.reqfield($.replacexaxaqar(reqxaxaqar));
		        	}
		        	
		        	}
		    	$.checkedfield();
		    	
		        }	
	       	}	
		}

		if(tanel && !clickXYZ){
			$.checkedfield();
			if(b<=checkxaxaqar.length){
				$.pahel(checkxaxaqar[b-1].i,checkxaxaqar[b-1].j,checkxaxaqar[b-1].ii,checkxaxaqar[b-1].jj);
				$.tqar(checkxaxaqar[b-1].i,checkxaxaqar[b-1].j,checkxaxaqar[b-1].a);
	    	}else{
	    		b=1;
	    		$.pahel(checkxaxaqar[b-1].i,checkxaxaqar[b-1].j,checkxaxaqar[b-1].ii,checkxaxaqar[b-1].jj);
				$.tqar(checkxaxaqar[b-1].i,checkxaxaqar[b-1].j,checkxaxaqar[b-1].a);
	    	}
		}
		b++;
		
	}
});


$.tqar = function(i,j,a){
	(rects[i][j].d=='D' ? k = 1 : k = 0);
	
	//Դեպի վեր-աջ կողմի դաշտի ստուգում n աստիճանի
    gg = 2;
    for(g=1;g<gg;g++){
  		if (a==4 && $.checktype(i-g,j+g) && rects[i-g][j+g].vi==$.xod()) {
  		 	qq=2;
  		  	for(q=1;q<qq;q++){
			    if ($.checktype(i-g-q,j+g+q) && rects[i-g-q][j+g+q].vi==1) {
				 	$.RECTCIRCLE(ctx, "#666", 40+(j+g+q) * cellSize, 40+(i-g-q) * cellSize, cellSize, i-g-q, j+g+q, 1);
			    	qq = qq+k;
				}
			}
		}else{
			(gg<=8 ? gg = gg+k : gg);
		}
	}

	//Դեպի վեր-ձախ կողմի դաշտի ստուգում n աստիճանի
    gg = 2;
    for(g=1;g<gg;g++){
  		if (a==1 && $.checktype(i-g,j-g) && rects[i-g][j-g].vi==$.xod()) {
		    qq=2;
  		  	for(q=1;q<qq;q++){
			    if ($.checktype(i-g-q,j-g-q) && rects[i-g-q][j-g-q].vi==1) {
				 	$.RECTCIRCLE(ctx, "#666", 40+(j-g-q) * cellSize, 40+(i-g-q) * cellSize, cellSize, i-g-q, j-g-q, 1);
			    	qq = qq+k;
				}
			}
		}else{
			(gg<=8 ? gg = gg+k : gg);
		}
	}
		

	//Դեպի ներքև-աջ կողմի դաշտի ստուգում n աստիճանի
    gg = 2;
    for(g=1;g<gg;g++){
  		if (a==3 && $.checktype(i+g,j+g) && rects[i+g][j+g].vi==$.xod()) {
		    qq=2;
  		  	for(q=1;q<qq;q++){
			    if ($.checktype(i+g+q,j+g+q) && rects[i+g+q][j+g+q].vi==1) {
				 	$.RECTCIRCLE(ctx, "#666", 40+(j+g+q) * cellSize, 40+(i+g+q) * cellSize, cellSize, i+g+q, j+g+q, 1);
			    	qq = qq+k;
				}
			}
		}else{
			(gg<=8 ? gg = gg+k : gg);
		}
	}	
	
	
	//Դեպի ներքև-ձախ կողմի դաշտի ստուգում n աստիճանի
    gg = 2;
    for(g=1;g<gg;g++){
  		if (a==2 && $.checktype(i+g,j-g) && rects[i+g][j-g].vi==$.xod()) {
		    qq=2;
  		  	for(q=1;q<qq;q++){
			    if ($.checktype(i+g+q,j-g-q) && rects[i+g+q][j-g-q].vi==1) {
				 	$.RECTCIRCLE(ctx, "#666", 40+(j-g-q) * cellSize, 40+(i+g+q) * cellSize, cellSize, i+g+q, j-g-q, 1);
			    	qq = qq+k;
				}
			}
		}else{
			(gg<=8 ? gg = gg+k : gg);
		}
	}
}

$.tanelqar = function(i,j,a){
	(rects[i][j].d=='D' ? k = 1 : k = 0);
	// console.log(a);
	//Դեպի վեր-աջ կողմի դաշտի ստուգում n աստիճանի
    gg = 2;
    for(g=1;g<gg;g++){
  		if (a!=2 && $.checktype(i-g,j+g) && rects[i-g][j+g].vi==$.xod()) {
		    if ($.checktype(i-g-1,j+g+1) && rects[i-g-1][j+g+1].vi==1) {
			 	tanel = true;
			 	var rc = new $.n(i,j,4,i-g,j+g);
		    	checkxaxaqar[n] = rc;
		    	n++;
			}
		}else{
			($.checktype(i-g,j+g) && rects[i-g][j+g].vi==1 && gg<=8 ? gg = gg+k : gg = gg);
		}
	}

	//Դեպի վեր-ձախ կողմի դաշտի ստուգում n աստիճանի
    gg = 2;
    for(g=1;g<gg;g++){
  		if (a!=3 && $.checktype(i-g,j-g) && rects[i-g][j-g].vi==$.xod()) {
		    if ($.checktype(i-g-1,j-g-1) && rects[i-g-1][j-g-1].vi==1) {
			 	tanel = true;
			 	var rc = new $.n(i,j,1,i-g,j-g);
		    	checkxaxaqar[n] = rc;
		    	n++;
		    	
			}
		}else{
			($.checktype(i-g,j-g) && rects[i-g][j-g].vi==1 && gg<=8 ? gg = gg+k : gg = gg);
		}
	}

	//Դեպի ներքև-աջ կողմի դաշտի ստուգում n աստիճանի
    gg = 2;
    for(g=1;g<gg;g++){
  		if (a!=1 && $.checktype(i+g,j+g) && rects[i+g][j+g].vi==$.xod()) {
		    if ($.checktype(i+g+1,j+g+1) && rects[i+g+1][j+g+1].vi==1) {
			 	tanel = true;
			 	var rc = new $.n(i,j,3,i+g,j+g);
		    	checkxaxaqar[n] = rc;
		    	n++;
			}
		}else{
			($.checktype(i+g,j+g) && rects[i+g][j+g].vi==1 && gg<=8 ? gg = gg+k : gg = gg);
		}
	}

    //Դեպի ներքև-ձախ կողմի դաշտի ստուգում n աստիճանի
    gg = 2;
    for(g=1;g<gg;g++){
  		if (a!=4 && $.checktype(i+g,j-g) && rects[i+g][j-g].vi==$.xod()) {
		    if ($.checktype(i+g+1,j-g-1) && rects[i+g+1][j-g-1].vi==1) {
			 	tanel = true;
			 	var rc = new $.n(i,j,2,i+g,j-g);
		    	checkxaxaqar[n] = rc;
		    	n++;
			}
		}else{
			($.checktype(i+g,j-g) && rects[i+g][j-g].vi==1 && gg<=8 ? gg = gg+k : gg = gg);
		}
	}
}

$.Stugum = function (){
	checkxaxaqar = [],n=0,tanel = false;
	for (var i = 0; i < rects.length; i++)
	    for(var j=0; j< rects.length; j++){
			if(rects[i][j].vi == player){
				$.tanelqar(i,j);
			} 
		}
}



function onMouseOut() {
	for(w=0;w<8;w++){
		for (k=0;k<8;k++) {
		    if(rects[w][k].fillcolor==kcolor){
				$.RECTCIRCLE(ctx, "#000", 40+k * cellSize, 40+w * cellSize, cellSize, w, k, player, circell+k * cellSize, circell+w * cellSize, fcolor, radius, 5, rects[w][k].d);
		    }
		}
	}
}

var clickX, clickY;
$('#canvas').mousemove(function(e){
	clickX = e.pageX - this.offsetLeft, clickY = e.pageY - this.offsetTop;
	onMouseOut();
	for(i=0;i<8;i++){
		for (j=0;j<8;j++) {
		    if(rects[i][j].fillcolor!=lcolor && rects[i][j].vi == player && clickX > rects[i][j].left && clickX < rects[i][j].right && clickY > rects[i][j].top && clickY < rects[i][j].bottom){
		    	$.RECTCIRCLE(ctx, "#666", 40+j * cellSize, 40+i * cellSize, cellSize, i, j, player, circell+j * cellSize, circell+i * cellSize, kcolor, radius, 1, rects[i][j].d);
		    }
		}
	}   
});


$('button.msg_hide').live('click', function (e){
	$(".msg_hide").attr('Class', 'btn msg_show');
	$('.msg-outer').removeClass('show');
	$('.panel-body').removeClass('show-msg');
	$('.panel-footer').removeClass('show');
});
$('button.msg_show').live('click', function (e){
	$(".msg_show").attr('Class', 'btn msg_hide');
	$('.msg-outer').addClass('show');
	$('.panel-body').addClass('show-msg');
	$('.panel-footer').addClass('show');
});
