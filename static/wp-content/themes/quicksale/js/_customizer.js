// Customization panel

jQuery(document).ready(function() {
	"use strict";

	if (jQuery("#custom_options").length===1) {

		// Reset custom settings to default
		jQuery("#custom_options .co_reset_to_default" ).click(function(e) {
			"use strict";
			clearCustomCookies();
			window.location = jQuery("#custom_options #co_site_url").val();
			e.preventDefault();
			return false;
		});

		// Body and Main menu style
		jQuery("#custom_options .switcher a,#custom_options .switcher2 a" ).draggable({
			axis: 'x',
			containment: 'parent',
			stop: function() {
				var left = parseInt(jQuery(this).css('left'), 10);
				var curStyle = left < 25 ? (jQuery(this).parent().hasClass('switcher') ? 'wide' : 'right') : (jQuery(this).parent().hasClass('switcher') ? 'boxed' : 'center');
				switchBox(jQuery(this).parent(), curStyle, true);
			}
		});
		jQuery("#custom_options .switcher, #custom_options .switcher2" ).click(function(e) {
			"use strict";
			switchBox(jQuery(this));
			e.preventDefault();
			return false;
		});
		jQuery("#custom_options .co_switch_box .co_switch_label").click(function(e) {
			"use strict";
			var state = jQuery(this).hasClass('boxed') ? 'boxed' : (jQuery(this).hasClass('wide') ? 'wide' : (jQuery(this).hasClass('right') ? 'right' : 'center'));
			switchBox(jQuery(this).siblings('div'), state);
			e.preventDefault();
			return false;
		});

		// Main theme color and Background color
		iColorPicker();
		jQuery('#custom_options .iColorPicker').click(function (e) {
			"use strict";
            jQuery(this).addClass('active');
			iColorShow(null, jQuery(this), changeThemeColor);
		});




        // Color scheme
        jQuery('#custom_options #co_scheme_list a').click(function(e) {
            "use strict";
            jQuery('#custom_options #co_scheme_list .co_scheme_wrapper').removeClass('active');
            var obj = jQuery(this).addClass('active');
            var val = obj.data('value');
            //if (THEMEREX_remember_visitors_settings)  {
                jQuery.cookie('color_scheme', val, {expires: 1, path: '/'});
            //}
            location.reload();
            e.preventDefault();
            return false;
        });






		// Background patterns
		jQuery('#custom_options #co_bg_pattern_list a').click(function(e) {
			"use strict";
			jQuery("#custom_options .co_switch_box .boxed").trigger('click');
			jQuery('#custom_options #co_bg_pattern_list .co_pattern_wrapper,#custom_options #co_bg_images_list .co_image_wrapper').removeClass('current');
			var obj = jQuery(this).addClass('current');
			var val = obj.attr('id').substr(-1);
			if (THEMEREX_remember_visitors_settings) {
				jQuery.cookie('bg_color', null, {expires: -1, path: '/'});
				jQuery.cookie('bg_image', null, {expires: -1, path: '/'});
				jQuery.cookie('bg_pattern', val, {expires: 1, path: '/'});
			}
			jQuery(document).find('body').removeClass('bg_pattern_1 bg_pattern_2 bg_pattern_3 bg_image_1 bg_image_2 bg_image_3 bg_image_4 bg_image_5 bg_image_6').addClass('bg_pattern_' + val);
			e.preventDefault();
			return false;
		});
		// Background images
		jQuery('#custom_options #co_bg_images_list a').click(function(e) {
			"use strict";
			jQuery("#custom_options .co_switch_box .boxed").trigger('click');
			jQuery('#custom_options #co_bg_images_list .co_image_wrapper,#custom_options #co_bg_pattern_list .co_pattern_wrapper').removeClass('current');
			var obj = jQuery(this).addClass('current');
			var val = obj.attr('id').substr(-1);
			if (THEMEREX_remember_visitors_settings) {
				jQuery.cookie('bg_color', null, {expires: -1, path: '/'});
				jQuery.cookie('bg_pattern', null, {expires: -1, path: '/'});
				jQuery.cookie('bg_image', val, {expires: 1, path: '/'});
			}
			jQuery(document).find('body').removeClass('bg_pattern_1 bg_pattern_2 bg_pattern_3 bg_image_1 bg_image_2 bg_image_3 bg_image_4 bg_image_5 bg_image_6').addClass('bg_image_' + val);
			e.preventDefault();
			return false;
		});
		jQuery('#custom_options #co_bg_pattern_list a').hover(
			function() {
				"use strict";
				var pattern = jQuery(this).parent().attr('id')=='co_bg_pattern_list';
				jQuery(this).parent().parent().css({
					'backgroundImage': 'url('+jQuery(this).find('img').attr('src').replace('_thumb2', '_thumb')+')',
					'backgroundRepeat': pattern ? 'repeat' : 'no-repeat'
				});
			},
			function() {
				"use strict";
				jQuery(this).parent().parent().css('backgroundImage', 'none');
			}
		);

        jQuery('#custom_options #co_bg_images_list a').hover(
            function() {
                "use strict";
                var pattern = jQuery(this).parent().attr('id')=='co_bg_pattern_list';
                jQuery(this).parent().next().css({
                    'backgroundImage': 'url('+jQuery(this).find('img').attr('src').replace('_thumb2', '_thumb')+')',
                    'backgroundRepeat': 'no-repeat'
                });
            },
            function() {
                "use strict";
                jQuery(this).parent().next().css('backgroundImage', 'none');
            }
        );
	}
});


function clearCustomCookies() {
	jQuery.cookie('theme_color', null, {expires: -1, path: '/'});
	jQuery.cookie('theme_color_1', null, {expires: -1, path: '/'});
	jQuery.cookie('theme_color_2', null, {expires: -1, path: '/'});
	jQuery.cookie('bg_image', null, {expires: -1, path: '/'});
	jQuery.cookie('bg_pattern', null, {expires: -1, path: '/'});
	jQuery.cookie('body_style', null, {expires: -1, path: '/'});
    jQuery.cookie('color_scheme', null, {expires: -1, path: '/'});
}


function switchBox(box) {
	"use strict";
	var toStyle = arguments[1] ? arguments[1] : '';
	var important = arguments[2] ? arguments[2] : false;
	var switcher = box.find('a').eq(0);
	var left = parseInt(switcher.css('left'), 10);
	var newStyle = left < 5 ? (box.hasClass('switcher') ? 'boxed' : 'center') : (box.hasClass('switcher') ? 'wide' : 'right');
	if (toStyle==='' || important || newStyle === toStyle) {
		if (toStyle==='') {toStyle = newStyle;}
		var right = box.width() - switcher.width() - 7;
		if (toStyle === 'wide' || toStyle === 'right')
			switcher.animate({left: 0}, 200);
		else
			switcher.animate({left: right}, 200);
		if (box.hasClass('switcher')) {
			if (THEMEREX_remember_visitors_settings) jQuery.cookie('body_style', toStyle, {expires: 1, path: '/'});
			jQuery(document).find('body').removeClass(toStyle==='boxed' ? 'wide' : 'boxed').addClass(toStyle);
			jQuery(window).trigger('resize');

		}
	}
	return newStyle;
}


function changeThemeColor(fld, clr) {
	"use strict";
	fld.css('backgroundColor', clr);
	fld.siblings('input').attr('value', clr);

	if (fld.attr('id')==='co_bg_color') {
		jQuery("#custom_options .co_switch_box .boxed").trigger('click');
		jQuery('#custom_options #co_bg_pattern_list .co_pattern_wrapper,#custom_options #co_bg_images_list .co_image_wrapper').removeClass('current');
		if (THEMEREX_remember_visitors_settings) {
			jQuery.cookie('bg_image', null, {expires: -1, path: '/'});
			jQuery.cookie('bg_pattern', null, {expires: -1, path: '/'});
			jQuery.cookie('bg_color', clr, {expires: 1, path: '/'});
		}
		jQuery(document).find('body').removeClass('bg_pattern_1 bg_pattern_2 bg_pattern_3 bg_pattern_4 bg_pattern_5 bg_image_1 bg_image_2 bg_image_3').css('backgroundColor', clr);
		return;
	}

	if (THEMEREX_remember_visitors_settings) {
		if (fld.attr('id')==='co_theme_color')
			jQuery.cookie('theme_color', clr, {expires: 1, path: '/'});
        else if (fld.attr('id')==='co_theme_color_1')
            jQuery.cookie('theme_color_1', clr, {expires: 1, path: '/'});
        else if (fld.attr('id')==='co_theme_color_2')
            jQuery.cookie('theme_color_2', clr, {expires: 1, path: '/'});
	}


	var styles = jQuery('#theme-skin-inline-css').length > 0 ? jQuery('#theme-skin-inline-css') : '';

        // Apply skin filters
        if (fld.attr('id')==='co_theme_color') { cl(1);
            clr = rgb2hex(jQuery('#co_theme_color').css('backgroundColor'));
            var rgb = hex2rgb(clr);
            var css_text =
                // Color for site
                '.theme_accent, .theme_accent:before, a:hover, a:hover > h6, a:hover > h5, a:hover > h4, a:hover > h3, .topTabsWrap .speedBar a:hover, .sc_pricing_dark .sc_pricing_columns:hover ul.columnsAnimate .sc_pricing_data > span, .sc_pricing_dark .sc_pricing_columns.active ul.columnsAnimate .sc_pricing_data > span, .sc_pricing_dark .sc_pricing_columns:hover ul.columnsAnimate .sc_pricing_title, .sc_pricing_dark .sc_pricing_columns.active ul.columnsAnimate .sc_pricing_title, .sc_team .sc_team_item .sc_team_item_position, .squareButton.global > a:hover, .squareButton.gray > a:hover, .squareButton.gray > a:active, .sidebarStyleDark.widget_area .search-form a:hover, .topWrap .search:not(.searchOpen):hover:before, .topWrap .search .searchSubmit:hover .icoSearch:before, .page404 .searchAnimation.sFocus .searchIcon, .topWrap .usermenu_area ul.usermenu_list li.usermenu_currency > a:hover, .topWrap .usermenu_area ul.usermenu_list li.usermenu_currency.sfHover > a, .topWrap .usermenu_area ul.usermenu_list li ul li a:hover, .topWrap .usermenu_area ul.usermenu_list li.usermenu_cart .widget_area ul li a:hover, .topWrap .usermenu_area a:hover, .topWrap .usermenu_area .sfHover a, .topWrap .topMenuStyleLine > ul > li ul li a:hover, .topWrap .topMenuStyleLine > ul > li ul li a:active, .topWrap .topMenuStyleLine > ul > li .current-menu-item > a, .topWrap .topMenuStyleLine > ul > li .current-menu-ancestor > a, .sidemenu_wrap .usermenu_area ul.usermenu_list li.usermenu_currency > a:hover, .sidemenu_wrap .usermenu_area ul.usermenu_list li.usermenu_currency.sfHover > a, .sidemenu_wrap .usermenu_area ul.usermenu_list li ul li a:hover, .sidemenu_wrap .usermenu_area ul.usermenu_list li.usermenu_cart .widget_area ul li a:hover .infoPost a:hover, .infoPost > span a:hover, .infoPost span.infoTags a:hover, .infoPost > span a:hover:before, .infoTopWrap .phone > .info_icon:before, .infoTopWrap .location > .info_icon:before, .openResponsiveMenu:before, .openResponsiveMenu, .picker__button--close:before, .isotopeFiltr ul a .data_count, .sc_list_style_arrows li:before, .sc_list_style_arrows li a:hover, .sc_list_style_iconed li a:hover, .sc_testimonials_style .sc_testimonials_item_author .sc_testimonials_item_name, .sc_testimonials_style .sc_testimonials_item_author .sc_testimonials_item_name a, .sc_blogger.style_date .sc_blogger_item .sc_blogger_info a:hover, .sc_blogger a:hover, #viewmore_link:hover, #viewmore_link:active, .comments .commBody li.commItem .replyWrap .posted a:hover, .comments .commBody li.commItem h4 a:hover, .nav_comments > a:hover, .comments_list a.comment-edit-link:hover, .comments .commBody li.commItem .replyWrap a:hover, .post .tagsWrap .post_cats a:hover, .post .tagsWrap .post_tags a:hover, .post_text_area .tagsWrap .post_cats a:hover, .post_text_area .tagsWrap .post_tags a:hover, .portfolBlock ul li a:hover, .sc_title_icon.sc_title_bg, .sc_title_icon, .responsive_menu .topWrap .menuTopWrap ul li ul li ul li a:hover, .twitBlock .sc_slider .swiper-slide a:hover, .twitBlockWrap .twitterAuthor a:hover, .user-popUp .formItems.loginFormBody .remember .forgotPwd, .user-popUp .formItems.loginFormBody .loginProblem, .user-popUp .formItems.registerFormBody .i-agree a'
                + ' { color: ' + clr + '; }'

                    // Color for site !important
                + '.roundButton.border_1:hover > a, .squareButton.border_1 > a:hover, .squareButton.border_1 > a:active, .flip-clock-wrapper ul li a div div.inn, .days_container_all .booking_day_slots, .booking_back_today a, .relatedPostWrap .indent_style .relatedInfo a:hover, .product_cats a:hover, #booking_slot_form > div > a:hover, .responsive_menu .topWrap .topMenuStyleLine > ul > li ul li a:hover, .responsive_menu .topWrap .topMenuStyleLine .current-menu-item > a, .responsive_menu .topWrap .topMenuStyleLine .current-menu-ancestor > a, .responsive_menu .topWrap .topMenuStyleLine > ul li a:hover, .responsive_menu .topWrap .topMenuStyleLine > ul li.sfHover > a, .revlink.red:hover'
                + ' { color: ' + clr + ' !important; }'

                    // Background color for site
                + '.theme_accent_bgc, .theme_accent_bgc:before, input[type="submit"]:active, input[type="button"]:active, .squareButton.active > span, .squareButton.active > a, .squareButton.ui-state-active > a, .roundButton > a:active, .squareButton > a:active, .squareButton.global > a, .nav_pages_parts > span.page_num, .nav_comments > span.current, ul > li.likeActive:active > a, .masonry article .status, .portfolio .isotopeElement .folioShowBlock:before, .itemPageFull .itemDescriptionWrap .toggleButton:active, .topMenuStyleLine > ul .menu-panel, .sliderLogo .elastislide-wrapper nav span:active:before, .sc_dropcaps.sc_dropcaps_style_1 .sc_dropcap, .sc_testimonials_style_1 .flex-direction-nav a:active, .sc_testimonials_style_3 .sc_testimonials_items, .sc_testimonials_style_3 .flex-direction-nav li, .sc_testimonials_style_3 .flex-direction-nav a, .pagination .pageLibrary > li.libPage > .pageFocusBlock .flex-direction-nav a:active, .sc_popup_light:before, .global_bg, .widgetTabs .widgetTop .tagcloud a:hover, .widgetTabs .widgetTop .tagcloud a:active, .fullScreenSlider.globalColor .sliderHomeBullets .rsContent:before, .fullScreenSlider .sliderHomeBullets .rsContent .slide-3 .order p span, ul.sc_list_style_disk li:before, .sc_slider_pagination_area .flex-control-nav.manual .slide_date, .sc_contact_form_custom .bubble label:hover, .sc_contact_form_custom .bubble label.selected, .sc_tooltip_parent .sc_tooltip, .sc_tooltip_parent .sc_tooltip:before, .sc_quote_style_1, .postLink, .sidebarStyleLight .widget_socials .socPage ul li a:hover, .sidebarStyleLight .wp-calendar tbody td a:hover, .sidebarStyleLight .wp-calendar tbody td a:hover, .sidebarStyleLight .wp-calendar tbody td.today > span, .sidebarStyleLight .wp-calendar tbody td.today a, .footerStyleLight .contactFooter .contactShare ul li a:hover, .isotopeFiltr ul a .data_count:before, .sc_accordion.sc_accordion_style_2 .sc_accordion_item.sc_active .sc_accordion_title:before, .sc_toggles.sc_toggles_style_2 .sc_toggles_item.sc_active .sc_toggles_title:before, .sc_toggles.sc_toggles_style_2 .sc_toggles_item .sc_toggles_title.ui-state-active:before, .openResponsiveMenu:hover, #viewmore_link, .user-popUp .formItems .formList li .sendEnter, .user-popUp ul.loginHeadTab li.ui-tabs-active:before, .revlink.red'
                + ' { background-color: ' + clr + '; }'

                    // Background color for site !important
                + '.booking_day_container.booking_day_black a, #booking_submit_button.booking_book_now_custom, a.sc_icon.bg_icon.sc_icon_round:hover, a.sc_icon.no_bg_icon.sc_icon_round:hover'
                + ' { background-color: ' + clr + ' !important; }'

                    // Border color for site
                + '.theme_accent_border, .sidebarStyleLight .widgetWrap .tagcloud a:hover, .sidebarStyleLight .widgetWrap .tagcloud a:active, .sidebarStyleLight.widget_area .tabs_area ul.tabs > li > a:hover, .sidebarStyleLight.widget_area .tagcloud a:hover, .sidebarStyleLight.widget_area .tagcloud a:active, .sidebarStyleLight.widget_area ul.tabs > li.ui-state-active > a, .sidebarStyleLight.widget_area .wp-calendar tbody a:hover, #toc .toc_item.current, #toc .toc_item:hover, .upToScroll a.addBookmark:hover, .sc_scroll_controls .flex-direction-nav a:active, .sc_testimonials_style_1 .flex-direction-nav a:active, .pagination .flex-direction-nav a:active .sc_scroll_controls .flex-direction-nav a:hover, .squareButton.global > a:after, .squareButton.gray > a:after, .revlink.red:after, #viewmore_link:after, .topWrap .search:not(.searchOpen):hover, .picker__button--today:before, .picker__button--clear:before, .isotopeFiltr ul a .data_count, .sc_title_icon.sc_title_bg'
                + ' {border-color: ' + clr + '; }'

                    // Background
                + '.theme_accent_bg, .theme_accent_bg:before, .color_1:before, .picker__day--selected, .picker__day--selected:hover, .picker--focused .picker__day--selected'
                + ' { background:' + clr + '; }'

                + '::selection'
                + ' { background-color: ' + clr + '; }'

                + '::-moz-selection'
                + ' { background-color: ' + clr + '; }';

            if (window.theme_skin_set_theme_color)
                css_text = theme_skin_set_theme_color(css_text, clr);
        }
        else if(fld.attr('id')==='co_theme_color_1') { cl(2);
            // theme color 1
            clr = rgb2hex(jQuery('#co_theme_color_1').css('backgroundColor'));
            rgb = hex2rgb(clr);

            css_text =
                // Color 1 for site
                '.tabsButton ul li a:hover, .popularFiltr ul li a:hover, .isotopeFiltr ul li a:hover, .widget_popular_posts article h3:before, .widgetTabs .widget_popular_posts article .post_info .post_date a:hover, .sidebar .widget_popular_posts article .post_info .post_date a:hover, .sidebar .widget_recent_posts article .post_info .post_date a:hover, .main .widgetWrap a:hover, .main .widgetWrap a:hover span, .widgetWrap a:hover span, .roundButton:hover a, input[type="submit"]:hover, input[type="button"]:hover, .squareButton > a:hover, .nav_pages_parts > a:hover, .wp-calendar tbody td.today a:hover, .masonry article .masonryInfo a:hover, .masonry article .masonryInfo span.infoTags a:hover, .infoPost > span:before, .infoPost > span a:before, .page404 p a, .copyWrap a, .ratingItem span:before, .reviewBlock .totalRating, .widget_area .contactInfo .fContact:before, .footerStyleLight .widget_area article .post_title:before, .footerStyleLight .widget_area article .post_info a:hover, .footerStyleLight .widget_area article .post_info .post_date a:hover, .sc_tabs .sc_tabs_titles li a:hover, .sc_highlight.sc_highlight_style_2, .sc_price_item .sc_price_money, .sc_price_item .sc_price_penny, .sc_pricing_table .sc_pricing_columns ul li .sc_icon, .sc_scroll_controls .flex-direction-nav a:hover:before, .sc_testimonials_style_1 .flex-direction-nav a:hover:before, .sc_testimonials_style_3 .flex-direction-nav a:hover:before, .sc_testimonials_style_3 .flex-direction-nav a:active:before, .pagination .pageLibrary > li.libPage > .pageFocusBlock .flex-direction-nav a:hover:before, .sc_blogger.style_date .load_more:before, .sc_blogger.style_accordion .sc_blogger_info .comments_number, .widgetTabs .widgetTop ul > li:not(.tabs):before, .widgetTabs .widgetTop ul > li:not(.tabs) > a:hover, .widgetTabs .widgetTop ul > li:not(.tabs) > a:hover span, .widgetTabs .widgetTop.widget_popular_posts article .post_title:before, .swpRightPos .tabsMenuBody a:hover, .swpRightPos .tabsMenuBody a:hover:before, .swpRightPos .panelmenu_area .current-menu-item > a, .swpRightPos .panelmenu_area .current-menu-ancestor > a, .swpRightPos .panelmenu_area > ul li a:hover, .swpRightPos .panelmenu_area > ul li.sfHover > a, .swpRightPos .panelmenu_area .current-menu-item.dropMenu:before, .swpRightPos .panelmenu_area .current-menu-ancestor.dropMenu:before, .swpRightPos .panelmenu_area li.liHover.dropMenu:before, .sc_slider_pagination_area .flex-control-nav.manual .slide_info .slide_title, #toc .toc_item.current .toc_icon, #toc .toc_item:hover .toc_icon, .sidebarStyleLight .widgetWrap ul li.liHover:before, .sidebarStyleLight .widgetWrap  a:hover, .sidebarStyleLight .widgetWrap  a:active, .sidebarStyleLight.widget_area .widgetWrap a:hover span, .sidebarStyleLight.widget_area .widgetWrap a:hover, .sidebarStyleLight.widget_area .widgetWrap ul > li > a:hover, .sidebarStyleLight.widget_area .widgetWrap ul > li > a:hover span, .sidebarStyleLight.widget_area ul.tabs > li.ui-state-active > a, .sidebarStyleLight .widgetWrap .tagcloud a:hover, .sidebarStyleLight .widgetWrap .tagcloud a:active, .sidebarStyleLight.widget_area a:hover, .sidebarStyleLight.widget_area a:hover span, .sidebarStyleLight.widget_area .ui-state-active a, .sidebarStyleLight.widget_area .widgetWrap ul li a:hover, .sidebarStyleLight.widget_area .widget_twitter ul li:before, .sidebarStyleLight .wp-calendar tfoot th a:before, .sidebarStyleLight.widget_area table.wp-calendar tfoot a:hover, .sidebarStyleLight.widget_area article span:before, .sidebarStyleLight.widget_area .widgetWrap ul > li.dropMenu:hover:before, .sidebarStyleLight.widget_area .widgetWrap ul > li.dropMenu.dropOpen:before, .postSharing > ul > li> a:before, .swpRightPos .searchBlock .searchSubmit:hover:before, ul#mainmenu .menu-panel.thumb_title > li > ul > li > ul li a:before, .theme_accent_1, .theme_accent_1:before, .sc_accordion.sc_accordion_style_1 .sc_accordion_item .sc_accordion_title:before, .sc_toggles.sc_toggles_style_1 .sc_toggles_item .sc_toggles_title:before, .squareButton.accent_1 > a:hover, .sc_video_player .sc_video_play_button:after, .sc_video_player:active .sc_video_play_button:after, .hoverIncreaseOut .hoverIcon > a:before, .hoverIncreaseIn .hoverLink > a:before, .hoverIncrease .hoverIcon > a:before, .sc_team .sc_team_item .sc_team_item_avatar .hoverLink'
                + ' { color: ' + clr + '; }'

                    // Color 1 for site !important
                + '.relatedPostWrap.sc_blogger article a.readmore_blogger:hover'
                + ' { color: ' + clr + ' !important; }'

                    // Background color 1 for site
                + '.sc_dropcaps.sc_dropcaps_style_4 .sc_dropcap, .squareButton.accent_1 > a, .theme_accent_1_bgc, .theme_accent_1_bgc:before, .sc_highlight.sc_highlight_style_1, .sc_accordion.sc_accordion_style_1 .sc_accordion_item.sc_active .sc_accordion_title:before, .sc_toggles.sc_toggles_style_1 .sc_toggles_item.sc_active .sc_toggles_title:before, .postStatus, .page404 .titleError > span, a.sc_image_hover_link .hoverShadow, .hoverIncrease .hoverShadow, .hoverIncreaseIn .hoverShadow, .hoverIncreaseOut .hoverShadow, .relatedPostWrap .no_indent_style .wrap:hover:before, .relatedPostWrap.sc_blogger .wrap:hover:before, .portfolioWrap .isotopePadding:before, .sc_team .sc_team_item .sc_team_item_avatar:hover:before'
                + ' { background-color: ' + clr + '; }'

                    // Background
                + '.theme_accent_1_bg, .theme_accent_1_bg:before, .color_3:before'
                + ' { background:' + clr + '; }'

                + '.sc_slider_flex .sc_slider_info, .sc_slider_swiper .sc_slider_info'
                + ' { background-color: rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.7) !important; }'

                + '.sc_image_shape_round:hover figcaption, .post .sc_image_shape_round:hover figcaption'
                + ' { background-color: rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.6); }'

                + '.mejs-controls .mejs-volume-button .mejs-volume-slider'
                + ' { background-color: rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.6) !important; }'

                    // Border color 1 for site
                + 'blockquote.sc_quote_style_2, .sc_accordion.sc_accordion_style_1 .sc_accordion_item .sc_accordion_title:before, .sc_toggles.sc_toggles_style_1 .sc_toggles_item .sc_toggles_title:before, .squareButton.accent_1 > a:after'
                + ' {border-color: ' + clr + '; }';

            if (window.theme_skin_set_theme_color_1)
                css_text = theme_skin_set_theme_color_1(css_text, clr);
        }
        else if(fld.attr('id')==='co_theme_color_2') {
            // theme color 2
            clr = rgb2hex(jQuery('#co_theme_color_2').css('backgroundColor'));
            rgb = hex2rgb(clr);

            css_text =
                // Color 2 for site
                '.theme_accent_2, .theme_accent_2:before, .widgetWrap ul li.liHover:before, .widgetWrap  a:hover, .widgetWrap  a:active, .postLink a, .sidebarStyleDark.widget_area a:hover, .sidebarStyleDark.widget_area a:hover span, .widget_area .widgetWrap ul > li > a:hover, .widget_area .widgetWrap ul > li > a:hover span, .widget_area ul.tabs > li.ui-state-active > a, aside.widgetWrap .tagcloud a:hover, aside.widgetWrap .tagcloud a:active, .sidebarStyleDark.widget_area a:hover, .sidebarStyleDark.widget_area .ui-state-active a, .sidebarStyleDark.widget_area .widgetWrap ul li a:hover, .sidebarStyleDark.widget_area .widget_twitter ul li:before, .sidebarStyleDark .wp-calendar tfoot th a:before, .sidebarStyleDark.widget_area table.wp-calendar tfoot a:hover, .sidebarStyleDark.widget_area .widgetWrap ul > li.dropMenu:hover:before, .sidebarStyleDark.widget_area .widgetWrap ul > li.dropMenu.dropOpen:before, .copyWrap .copy .copyright > a, .widget_area article span:before, .sidemenu_wrap .sidemenu_area .current-menu-item > a, .sidemenu_wrap .sidemenu_area .current-menu-ancestor > a, .sidemenu_wrap .sidemenu_area > ul li a:hover, .sidemenu_wrap .sidemenu_area > ul li.sfHover > a, .sidemenu_wrap .sidemenu_area .current-menu-item.dropMenu:before, .sidemenu_wrap .sidemenu_area .current-menu-ancestor.dropMenu:before, .sidemenu_wrap .sidemenu_area li.liHover.dropMenu:before, .twitBlock .sc_slider .swiper-slide a, .twitBlockWrap .twitterAuthor a, #sidebar_main.sidebarStyleDark .widget_layered_nav ul li.chosen a:before, #sidebar_main.sidebarStyleDark .widget_layered_nav ul li a:hover:before, #sidebar_main.sidebarStyleDark .widget_layered_nav_filters ul li a:hover:before, #sidebar_main.sidebarStyleDark .widget_layered_nav_filters ul li.chosen a:before, .sidebarStyleDark.widget_area .widgetWrap a:hover, .sidebarStyleDark.widget_area .widgetWrap .post_info a:hover, .sc_team .sc_team_item .sc_team_item_avatar .sc_team_item_socials li a:hover, .squareButton.accent_2 > a:hover, .author .socPage li a:hover:before, .twitBlock .sc_slider .swiper-slide a, .twitBlock .sc_slider .swiper-slide .twitterIco:before, .twitBlock .sc_slider .swiper-slide a, .twitBlockWrap .twitterAuthor a'
                + ' { color: ' + clr + '; }'

                    // Color 2 for site !important
                + '.sidebarStyleDark.widget_area a:hover span, .roundButton.border:hover > a, .squareButton.border > a:hover, .squareButton.border > a:active, .revlink:hover'
                + ' { color: ' + clr + ' !important; }'

                    // Background color 2 for site
                + '.theme_accent_2_bgc, .theme_accent_2_bgc:before, .sc_dropcaps.sc_dropcaps_style_3 .sc_dropcap, .squareButton.accent_2 > a, .sc_skills_bar .sc_skills_item .sc_skills_count, .sc_skills_counter .sc_skills_item.sc_skills_style_3 .sc_skills_count, .sc_skills_counter .sc_skills_item.sc_skills_style_4 .sc_skills_count, .sc_skills_counter .sc_skills_item.sc_skills_style_4 .sc_skills_info, .sc_blogger.style_date .sc_blogger_item .sc_blogger_date, .sc_scroll_bar .swiper-scrollbar-drag:before, .sc_blogger.sc_blogger_vertical.style_date.sc_scroll_controls ul.flex-direction-nav li a:hover, .audio_container, .widget_area .instagram-pics li a:after, .widget_area .flickr_images .flickr_badge_image a:after, .postAside, .sc_dropcaps.sc_dropcaps_style_2 .sc_dropcap, .wp-calendar tbody td a:hover, .footerStyleDark .contactFooter .contactShare ul li a:hover, ul > li.share > ul.shareDrop > li > a:hover, .wp-calendar tbody td a:hover, .wp-calendar tbody td.today > span, .revlink, .sc_emailer, .topWrap .menuTopWrap, .footerContentWrap .googlemap_button, .sc_countdown.sc_countdown_square .sc_countdown_counter .countdown-section, .sc_pricing_light .sc_pricing_columns .sc_pricing_title, .sc_pricing_light .sc_pricing_columns:hover ul.columnsAnimate li.sc_pricing_title, .sc_pricing_light .sc_pricing_columns ul li.sc_pricing_price, .sc_pricing_light .sc_pricing_columns:hover ul.columnsAnimate .sc_pricing_title, .sc_pricing_light .sc_pricing_columns:hover ul.columnsAnimate li.sc_pricing_title, .sc_pricing_light .sc_pricing_columns:hover ul.columnsAnimate li.sc_pricing_price, .topWrap .sidebar_cart .widget_shopping_cart_content .buttons .button.checkout, .topWrap .sidebar_cart .widget_shopping_cart_content .buttons .button, .sc_accordion.sc_accordion_style_2 .sc_accordion_item .sc_accordion_title:before, .sc_toggles.sc_toggles_style_2 .sc_toggles_item .sc_toggles_title:before'
                + ' { background-color: ' + clr + '; }'

                + 'ul > li.share > ul.shareDrop > li > a:after, .widget_socials .socPage li a:after, .author .socPage li a:after'
                + '{ box-shadow: 0 0 0 35px ' + clr + ' inset; }'

                + 'ul > li.share > ul.shareDrop > li > a:hover:after, .widget_socials .socPage li a:hover:after, .author .socPage li a:hover:after'
                + '{ box-shadow: 0 0 0 2px ' + clr + ' inset; }'

                    // Background color 2 for site !important
                + '#booking_calendar_container .booking_day_white a:hover, #form_container_all .booking_clear_custom, #pagination .squareButton.active span, #pagination .squareButton a:hover, #pagination .squareButton a:active'
                + ' { background-color: ' + clr + ' !important; }'

                    // Background
                + '.theme_accent_2_bg, .theme_accent_2_bg:before, .color_2:before, .picker__day--infocus:hover, .picker__day--outfocus:hover, .picker__day--highlighted:hover, .picker--focused .picker__day--highlighted'
                + ' { background:' + clr + '; }'

                    // Transparent background color 2 for site
                + '.sc_table table tr:hover'
                + ' { background-color: rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.15); }'

                    // Border color 2 for site
                + '#sidebar_main.sidebarStyleDark.widget_area .widget_layered_nav ul li a:hover:before, #sidebar_main.sidebarStyleDark .widget_layered_nav_filters ul li.chosen a:before, #sidebar_main.sidebarStyleDark .widget_layered_nav_filters ul li a:hover:before, .postSharing > ul > li > a:active, .postSharing > ul > li > span:active, .roundButton > a:active, .nav_pages_parts > span.page_num, .nav_comments > span.current, .itemPageFull .itemDescriptionWrap .toggleButton:active, .sliderLogo .elastislide-wrapper nav span:active:before, pre.code, .squareButton.accent_2 > a:after, .picker__day--highlighted, .revlink:after'
                + ' {border-color: ' + clr + '; }'
            ;

            if (window.theme_skin_set_theme_color_2)
                css_text = theme_skin_set_theme_color_2(css_text, clr);

        }
		// Apply styles
        if (styles.length == 0)
            jQuery('head').append('<style id="theme-skin-inline-css" type="text/css">'+css_text+'</style>');
        else
            styles.append(css_text);
}