// JavaScript Document
jQuery.noConflict();
var $wbc = jQuery;
booking_path = WPBookingCalendarSettings.path;
booking_day_white_bg = WPBookingCalendarSettings.day_white_bg;
booking_day_white_bg_hover = WPBookingCalendarSettings.day_white_bg_hover;
booking_day_black_bg = WPBookingCalendarSettings.day_black_bg;
booking_day_black_bg_hover = WPBookingCalendarSettings.day_black_bg_hover;
booking_day_white_line1_color = WPBookingCalendarSettings.day_white_line1_color;
booking_day_white_line1_color_hover = WPBookingCalendarSettings.day_white_line1_color_hover;
booking_day_white_line2_color = WPBookingCalendarSettings.day_white_line2_color;
booking_day_white_line2_color_hover = WPBookingCalendarSettings.day_white_line2_color_hover;
booking_day_black_line1_color = WPBookingCalendarSettings.day_black_line1_color;
booking_day_black_line1_color_hover = WPBookingCalendarSettings.day_black_line1_color_hover;
booking_day_black_line2_color = WPBookingCalendarSettings.day_black_line2_color;
booking_day_black_line2_color_hover = WPBookingCalendarSettings.day_black_line2_color_hover;
booking_recaptcha_style = WPBookingCalendarSettings.recaptcha_style;
var booking_currentMousePos = { x: -1, y: -1 };
	$wbc(document).mousemove(function(event) {
		booking_currentMousePos.x = event.pageX;
		booking_currentMousePos.y = event.pageY;
	});
	
var booking_xhr = new Array();
function getBookingMonthCalendar(month, year, calendar_id,recaptchakey) {
	for(var i = 0; i < booking_xhr.length; i++) {
		booking_xhr[i].abort();
	}
	$wbc('#booking_container_all').parent().prepend('<div id=\"booking_sfondo\" class=\"booking_modal_sfondo\"></div>');
	$wbc('#booking_modal_loading').fadeIn();
	booking_xhr.push($wbc.ajax({
	  url: booking_path+'/ajax/getMonthCalendar.php?month='+month+'&year='+year+'&calendar_id='+calendar_id+'&publickey='+recaptchakey,
	  success: function(data) {
		$wbc('#booking_modal_loading').attr("style","display:none !important");
		$wbc('#booking_sfondo').remove();
		$wbc('#booking_calendar_container').html(data);
		$wbc('.booking_day_white a').each(function() {
			if($wbc(this).attr('over')==1) {
				$wbc(this).bind('mouseenter', function(e) {
					if($wbc(this).attr('popup') == 1) {
						fillBookingSlotsPopup($wbc(this).attr('year'),$wbc(this).attr('month'),$wbc(this).attr('day'),calendar_id);
						$wbc('#booking_box_slots').stop().fadeIn(0);
					}
					$wbc(this).css({'background-color': booking_day_white_bg_hover});
					$wbc(this).children('div.booking_day_number').css({'color':booking_day_white_line1_color_hover});
					$wbc(this).children('div.booking_day_slots').css({'color':booking_day_white_line2_color_hover});
					$wbc(this).children('div.booking_day_book').css({'color':booking_day_white_line1_color_hover});
					
				});
				$wbc(this).bind('mouseleave', function() {
					$wbc('#booking_box_slots').attr("style","display:none !important");
					$wbc(this).css({'background-color': booking_day_white_bg});
					$wbc(this).children('div.booking_day_number').css({'color':booking_day_white_line1_color});
					$wbc(this).children('div.booking_day_slots').css({'color':booking_day_white_line2_color});
					$wbc(this).children('div.booking_day_book').css({'color':booking_day_white_line1_color});
				});
				$wbc(this).bind('mousemove',function(e) {
					
					var top;
					var left;
					 
					 pageX = e.pageX- $wbc('#booking_container_all').offset().left;
					 pageY = e.pageY- $wbc('#booking_container_all').offset().top;
					
					 if(pageX-$wbc('#booking_box_slots').width()<0) {
						 newpageX = 0;
					 } else if(pageX+$wbc('#booking_box_slots').width()>$wbc('#booking_container_all').width()) {
						 newpageX = pageX-$wbc('#booking_box_slots').width()-20;
					 } else {
						 newpageX = pageX;
					 }
					 if(pageY<0) {
						 newpageY = 0;
					 } else if(pageY+$wbc('#booking_box_slots').height()+20>$wbc('#booking_container_all').height()) {
						 newpageY = pageY-$wbc('#booking_box_slots').height()-40;
					 } else {
						 newpageY = pageY;
					 }
					 
					 if(newpageY+$wbc('#booking_container_all').offset().top < e.pageY) {
						 top=newpageY+$wbc('#booking_container_all').offset().top -20;
					 } else {
						 top=newpageY+$wbc('#booking_container_all').offset().top +20;
					 }
					 if(newpageX+$wbc('#booking_container_all').offset().left <e.pageX) {
						 left =newpageX+$wbc('#booking_container_all').offset().left -20;
					 } else {
						 left = newpageX+$wbc('#booking_container_all').offset().left +20;
					 }
					 
					 top = (top-$wbc(window).scrollTop());
					 left = (left-$wbc(window).scrollLeft());
					 
					 if(top<0) {
						 top = pageY+40;
					 }
					 //top = 0;
					 $wbc('#booking_box_slots').css({
						top: top+'px',
						left: left+'px',
						display: $wbc('#booking_box_slots').css("display")
					 });
					
					
				});
				$wbc(this).bind('click', function() {
					$wbc('#booking_box_slots').stop().attr("style","display:none !important");
					getBookingForm($wbc(this).attr('year'),$wbc(this).attr('month'),$wbc(this).attr('day'),calendar_id,recaptchakey);
				});
			}
		});
		$wbc('.booking_day_black a').each(function() {
			if($wbc(this).attr('over')==1) {
				$wbc(this).bind('mouseenter', function(e) {
					if($wbc(this).attr('popup') == 1) {
						
						fillBookingSlotsPopup($wbc(this).attr('year'),$wbc(this).attr('month'),$wbc(this).attr('day'),calendar_id);
						$wbc('#booking_box_slots').stop().fadeIn(0);
					}
					$wbc(this).css({'background-color': booking_day_black_bg_hover});
					$wbc(this).children('div.booking_day_number').css({'color':booking_day_black_line1_color_hover});
					$wbc(this).children('div.booking_day_slots').css({'color':booking_day_black_line2_color_hover});
					$wbc(this).children('div.booking_day_book').css({'color':booking_day_black_line1_color_hover});
					
				});
				$wbc(this).bind('mouseleave', function() {
					$wbc('#booking_box_slots').attr("style","display:none !important");
					$wbc(this).css({'background-color': booking_day_black_bg});
					$wbc(this).children('div.booking_day_number').css({'color':booking_day_black_line1_color});
					$wbc(this).children('div.booking_day_slots').css({'color':booking_day_black_line2_color});
					$wbc(this).children('div.booking_day_book').css({'color':booking_day_black_line1_color});
				});
				$wbc(this).bind('mousemove',function(e) {
					var top;
					var left;
					 
					 pageX = e.pageX- $wbc('#booking_container_all').offset().left;
					 pageY = e.pageY- $wbc('#booking_container_all').offset().top;
					
					 if(pageX-$wbc('#booking_box_slots').width()<0) {
						 newpageX = 0;
					 } else if(pageX+$wbc('#booking_box_slots').width()>$wbc('#booking_container_all').width()) {
						 newpageX = pageX-$wbc('#booking_box_slots').width()-20;
					 } else {
						 newpageX = pageX;
					 }
					 if(pageY<0) {
						 newpageY = 0;
					 } else if(pageY+$wbc('#booking_box_slots').height()+20>$wbc('#booking_container_all').height()) {
						 newpageY = pageY-$wbc('#booking_box_slots').height()-40;
					 } else {
						 newpageY = pageY;
					 }
					 
					 if(newpageY+$wbc('#booking_container_all').offset().top < e.pageY) {
						 top=newpageY+$wbc('#booking_container_all').offset().top -20;
					 } else {
						 top=newpageY+$wbc('#booking_container_all').offset().top +20;
					 }
					 if(newpageX+$wbc('#booking_container_all').offset().left <e.pageX) {
						 left =newpageX+$wbc('#booking_container_all').offset().left -20;
					 } else {
						 left = newpageX+$wbc('#booking_container_all').offset().left +20;
					 }
					 
					 top = (top-$wbc(window).scrollTop());
					 left = (left-$wbc(window).scrollLeft());
					 if(top<0) {
						 top = pageY+40;
					 }
					 $wbc('#booking_box_slots').css({
						top: top+'px',
						left: left+'px',
						display: $wbc('#booking_box_slots').css("display")
					 });
					
					
				});
				$wbc(this).bind('click', function() {
					$wbc('#booking_box_slots').stop().attr("style","display:none !important");
					getBookingForm($wbc(this).attr('year'),$wbc(this).attr('month'),$wbc(this).attr('day'),calendar_id,recaptchakey);
				});
			}
		});
		$wbc('#booking_box_slots').resize(function() {
			
			$wbc(this).bind('mouseleave', function() {
				$wbc('#booking_box_slots').attr("style","display:none !important");
				
			});
			
			var top;
			var left;
			 
			 pageX = booking_currentMousePos.x- $wbc('#booking_container_all').offset().left;
			 pageY = booking_currentMousePos.y- $wbc('#booking_container_all').offset().top;
			
			 if(pageX-$wbc('#booking_box_slots').width()<0) {
				 newpageX = 0;
			 } else if(pageX+$wbc('#booking_box_slots').width()>$wbc('#booking_container_all').width()) {
				 newpageX = pageX-$wbc('#booking_box_slots').width()-20;
			 } else {
				 newpageX = pageX;
			 }
			 if(pageY<0) {
				 newpageY = 0;
			 } else if(pageY+$wbc('#booking_box_slots').height()+20>$wbc('#booking_container_all').height()) {
				 newpageY = pageY-$wbc('#booking_box_slots').height()-40;
			 } else {
				 newpageY = pageY;
			 }
			 
			 if(newpageY+$wbc('#booking_container_all').offset().top < booking_currentMousePos.y) {
				 top=newpageY+$wbc('#booking_container_all').offset().top -20;
			 } else {
				 top=newpageY+$wbc('#booking_container_all').offset().top +20;
			 }
			 if(newpageX+$wbc('#booking_container_all').offset().left <booking_currentMousePos.x) {
				 left =newpageX+$wbc('#booking_container_all').offset().left -20;
			 } else {
				 left = newpageX+$wbc('#booking_container_all').offset().left +20;
			 }
			 
			top = (top-$wbc(window).scrollTop());
			 left = (left-$wbc(window).scrollLeft());
			 if(top<0) {
				 top = pageY+40;
			 }
			 //top = 0;
			 $wbc('#booking_box_slots').css({
				top: top+'px',
				left: left+'px',
				display: $wbc('#booking_box_slots').css("display")
			 });
			
		});
	  }
	})
	);
	getMonthName(month);
	getBookingYearName(year);
}

function getBookingYearName(year) {
	$wbc('#booking_month_year').html(year);
	currentYear = year;
}
function getBookingPreviousMonth(calendar_id,recaptchakey,limit) {
	if(limit == -1) {
		if(currentMonth == 1) {
			 newYear = currentYear-1;
			 newMonth = 12;
		} else {
			 newYear = currentYear;
			 newMonth = currentMonth-1;
		}
		getBookingMonthCalendar(newMonth,newYear,calendar_id,recaptchakey);
	} else {
		var today = new Date();
		 var year = today.getFullYear();
		 var month = today.getMonth()+1;
		 var newlimit = limit;
		
		 if(month == 1) {
			 todaynum = ''+(year-1)+'10';
		 } else {
			 var newm = month-newlimit;
			 var newy = year;
			 if(month<10) {
				 month = "0"+month;
			 }
			 if(newm<1) {
				 newy--;
				 diff=0-newm;
				 newm=12-diff;
				 if(newm<10) {
					 newm='0'+newm;
				 }
			 } else if(newm<10) {
				 newm = '0'+newm;
			 } 
			 
			 todaynum = ''+newy+''+newm;		 
		 }	
		  
		 if(currentMonth == 1) {
			 newYear = currentYear-1;
			 newMonth = 12;
		 } else {
			 newYear = currentYear;
			 newMonth = currentMonth-1;
		 }
		 var newnumyear = newYear;
		 var newnummonth = newMonth;
		 if(newnummonth<10) {
			 newnummonth = '0'+newnummonth;
		 }
		 newnum = ''+newnumyear+''+newnummonth;
		
		 if(newnum>=todaynum) {
			getBookingMonthCalendar(newMonth,newYear,calendar_id,recaptchakey);
		 } else {
			 getBookingMonthCalendar(month,year,calendar_id,recaptchakey);
		 }

	}}
function getBookingNextMonth( calendar_id,recaptchakey, limit) {
	if(limit == -1) {
		if(currentMonth == 12) {
			 newYear = currentYear+1;
			 newMonth = 1;
		} else {
			 newYear = currentYear;
			 newMonth = currentMonth+1;
		}
		getBookingMonthCalendar(newMonth,newYear,calendar_id,recaptchakey);
	} else {
		var today = new Date();
		 var year = today.getFullYear();
		 var month = today.getMonth()+1;
		var newlimit = limit;
		 
		 if(month == 12) {
			 if(limit<=9) {
			 	todaynum = ''+(year+1)+'0'+newlimit;
			 } else {
				 todaynum = ''+(year+1)+newlimit;
			 }
		 } else {
			 var newm = ''+parseInt(month+newlimit);
			 var newy = year;
			 
			 
			 if(newm<10) {
				 newm = '0'+newm;
			 } else if(newm>12) {
				 diff=newm-12;
				 newm = diff;
				 if(diff<10) {
					 newm = '0'+diff;
				 }
				 newy++;
			 }
			 todaynum = ''+newy+''+newm;
			  
		 }
		 if(currentMonth == 12) {
			 newYear = currentYear+1;
			 newMonth = 1;
		 } else {
			 newYear = currentYear;
			 newMonth = currentMonth+1;
		 }
		 
		 var newnumyear = newYear;
		 var newnummonth = newMonth;
		 if(newnummonth<10) {
			 newnummonth = '0'+newnummonth;
		 }
		 newnum = ''+newnumyear+''+newnummonth;
		 if(newnum<=todaynum) {
			getBookingMonthCalendar(newMonth,newYear,calendar_id,recaptchakey);
		 } else {
			 getBookingMonthCalendar(month,year,calendar_id,recaptchakey);
		 }
	}}

function fillBookingSlotsPopup( year,month,day,calendar_id) {
	for(var i = 0; i < booking_xhr.length; i++) {
		booking_xhr[i].abort();
	}
	$wbc('#booking_slots_popup').html('<img src="'+booking_path+'/images/loading.gif">');
	booking_xhr.push($wbc.ajax({
	  url: booking_path+'/ajax/fillSlotsPopup.php?year='+year+'&month='+month+'&day='+day+'&calendar_id='+calendar_id,
	  success: function(data) {
		arrData=data.split('|');
		$wbc('#booking_slots_popup').html(arrData[0]);
		$wbc('#booking_popup_title').html(arrData[1]);
		$wbc('#booking_slots_popup').parent().resize();
	  }
	}));
	
}
function hideBookingSlotsPopup() {
	$wbc('#booking_box_slots').attr("style","display:none !important");
	
}
function closeBookingPage(calendar_id,recaptchakey,year,month) {
	if(navigator.appName == 'Microsoft Internet Explorer') {
		var target = $wbc('#booking_container');
			  var h = target.height();
				var cssHeight=target.css('height');
				target.animate( 
				{ height: '1px' }, 100, function() { 
				  target.attr("style","display:none !important");
				  target.height(h);
				  target.css('height',cssHeight);
				  
				} 
				);
		$wbc('#booking_calendar_container').fadeIn();
	} else {
		$wbc('#booking_calendar_container').slideDown();
		$wbc('#booking_container').slideUp();
	}
	$wbc('#booking_month_nav').fadeIn();
	$wbc('#booking_calendar_select').fadeIn();
	$wbc('#booking_calendar_select_label').fadeIn();
	$wbc('#booking_category_select').fadeIn();
	$wbc('#booking_category_select_label').fadeIn();
	$wbc('#booking_name_days_container').fadeIn();
	var today= new Date();
	if(month>-1 && year>0) {
		getBookingMonthCalendar(month,year,calendar_id,recaptchakey);
	} else {
		getBookingMonthCalendar((today.getMonth()+1),today.getFullYear(),calendar_id,recaptchakey);
	}
	
	
}

function hideBookingResponse(calendar_id,recaptchakey) {
	$wbc('#booking_modal_response').attr("style","display:none !important");
	$wbc('#booking_sfondo').remove();
	document.forms[0].reset();
	closeBookingPage(calendar_id,recaptchakey);
}

function getBookingForm(year,month,day,calendar_id,recaptchakey) {
	for(var i = 0; i < booking_xhr.length; i++) {
		booking_xhr[i].abort();
	}
	$wbc('#login-register-password').fadeIn();
	$wbc('#booking_container_all').parent().prepend('<div id=\"booking_sfondo\" class=\"booking_modal_sfondo\"></div>');
	$wbc('#booking_modal_loading').fadeIn();
	booking_xhr.push($wbc.ajax({
	  url: booking_path+'/ajax/getBookingForm.php?year='+year+'&month='+month+'&day='+day+'&calendar_id='+calendar_id,
	  success: function(data) {
		  $wbc('#booking_modal_loading').attr("style","display:none !important");
		  $wbc('#booking_sfondo').remove();		  
		  if(navigator.appName == 'Microsoft Internet Explorer') {
			  var target = $wbc('#booking_calendar_container');
			  var h = target.height();
				var cssHeight=target.css('height');
				target.animate( 
				{ height: '1px' }, 100, function() { 
				  target.attr("style","display:none !important");
				  target.height(h);
				  target.css('height',cssHeight);
				} 
				);
			
			  $wbc('#booking_container').fadeIn();
		  } else {
			  $wbc('#booking_calendar_container').slideUp();
			  $wbc('#booking_container').slideDown();
		  }
		 
		  
		  dataArr=data.split('|');
		 
		  $wbc('#booking_slot_form').html(dataArr[0]);
		  if(dataArr[1] == 1) {
			  $wbc('#booking_prev').html('');
			  $wbc('#booking_next').html('<a href=\"#\"></a>');
		  } 
		  $wbc('#booking_month_nav').attr("style","display:none !important");
		  $wbc('#booking_calendar_select').attr("style","display:none !important");
		  $wbc('#booking_calendar_select_label').attr("style","display:none !important");
		  $wbc('#booking_category_select').attr("style","display:none !important");
		  $wbc('#booking_category_select_label').attr("style","display:none !important");
		  $wbc('#booking_name_days_container').attr("style","display:none !important");
		  $wbc('#booking_captcha_error').attr("style","display:none !important");
		  if(recaptchakey != '') {
			  Recaptcha.create(recaptchakey,
				'captcha',
				{
				  theme: booking_recaptcha_style,
				  callback: function() { 
					$wbc('#recaptcha_response_field').attr('tmt:required','true');
					$wbc('#recaptcha_response_field').attr('tmt:message',dataArr[2]);
				  }
				});
		  }
			
			
	  }
	}));
}
