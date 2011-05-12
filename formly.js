// Formly v1.0 by Daniel Raftery
//
// http://thrivingkings.com/formly
// http://twitter.com/ThrivingKings


(function($)
	{
	
	$.fn.formly = function(options, callback) 
		{
		// Default settings
		var settings =
			{
			'theme'		:	'Base',
			'onBlur'	:	true
			};
		
		if(options)
			{ $.extend(settings, options); }
		
		// Form name, very important!
		var formName = this.attr('id');
		if(!formName)
			{ 
			// If no name, make a random one
			formName = Math.ceil(Math.random()*5000); 
			this.attr('id', formName);
			}
		this.append('<div style="clear:both;"></div><div class="formlyAlerts"></div>');
		this.addClass('formlyWrapper-' + settings['theme']);
		if(this.attr('width'))
			{ this.css('width', this.attr('width')); }
		
		if(this.attr('subtitle') || this.attr('title'))
			{ this.prepend('<hr/>'); }
		if(this.attr('subtitle'))
			{ this.prepend('<h2>' + this.attr('subtitle') + '</h2>'); }
		if(this.attr('title'))
			{ this.prepend('<h1>' + this.attr('title') + '</h1>'); }
		
		this.children().each(function(index, item)
			{
			// Placeholder text
			if($(item).attr('place'))
				{
				if($(item).attr('type')=='password')
					{
					// Password fields with placeholders
					var hID = 'pwPlace-' + $(item).attr('name');
					$(item).after('<input type="text" id="' + hID + '" value="' + $(item).attr('place') + '" class="formlyPWPlaces" />');
					$('#' + hID).css('color', '#bbb');
					$(item).hide();
					$('#' + hID).show();
					
					// Focus and blur must be handled independently for variables sake
					$('#' + hID).focus(function()
						{
						$('#' + hID).hide();
						$(item).show();
						$(item).focus();
						});
					$(item).blur(function()
						{
						if(!$(item).val())
							{
							$('#' + hID).show();
							$(item).hide();
							}
						});
					}
				else
					{
					$(item).val($(item).attr('place'));
					$(item).css('color', '#bbb');
					}
				}
			
			$(item).blur(function()
				{
				// Placeholder text
				if(!$(item).val() || $(item).val()==$(item).attr('pre-fix'))
					{ 
					if($(item).attr('type')!='password')
						{
						$(item).val($(item).attr('place')); 
						$(item).css('color', '#bbb');
						}
					}
				if($(item).attr('pre-fix'))
					{
					var originalVal = $(item).val();
					var thePrefix = $(item).attr('pre-fix');
					if(thePrefix.length==1)
						{
						if(originalVal.charAt(0) != thePrefix && $(item).val() != $(item).attr('place'))
							{ $(item).val(thePrefix + originalVal); }
						}
					else
						{
						if(originalVal.indexOf(thePrefix) == -1 && $(item).val() != $(item).attr('place'))
							{ $(item).val(thePrefix + originalVal); }
						}
					}
				if(settings['onBlur'])
					{
					// Validation
					if($(item).attr('validate'))
						{ functions.validate(item); }
					// Required
					if($(item).attr('require'))
						{ functions.require(item); }
					// Match
					if($(item).attr('match'))
						{ functions.match(item); }
					}
				});
			
			// Focus actions
			$(item).focus(function()
				{
				// Placeholder
				if($(item).attr('place'))
					{
					if($(item).val()==$(item).attr('place'))
						{ 
						$(item).val(''); 
						$(item).css('color', '');
						}
					}
				// Prefixes
				if($(item).attr('pre-fix') && !$(item).val())
					{
					$(item).val('');
					$(item).val($(item).attr('pre-fix'));
					}
				});

				
			// Reset button
			$('#' + formName).find('input:reset').click(function(item)
				{
				item.preventDefault();
				$('#' + formName).find('input:text, input:password, input:checkbox, input:radio').each(function()
					{
					$(this).css('border-color', '');
					
					if($(this).is(':checked'))
						{ $(this).attr('checked', false); }
					
					if($(this).attr('place'))
						{
						if($(this).attr('type')!='password')
							{
							$(this).val($(this).attr('place'));
							$(this).css('color', '#bbb');
							}
						else
							{ 
							if($(this).hasClass('formlyPWPlaces'))
								{
								$(this).show();
								$(this).prev('input').hide();
								}
							else
								{ $(this).val(''); }
							}
						}
					else
						{
						if($(this).hasClass('formlyPWPlaces'))
							{
							$(this).show();
							$(this).prev('input').hide();
							}
						else
							{ $(this).val(''); }
						}
					});
				$('#' + formName).find('.formlyAlert').each(function()
					{
					$(this).fadeOut(function()
						{ $(this).remove() }); 
					});
				});
			});
			
			// Submit button
			this.submit(function(item)
				{
				var canSubmit = true;
				$(this).find('input').each(function()
					{
					if($(this).attr('require'))
						{
						if(!functions.require(this)) 
							{ canSubmit = false; }
						}
					if($(this).attr('validate'))
						{
						if(!functions.validate(this)) 
							{ canSubmit = false; }
						}
					// Match
					if($(this).attr('match'))
						{
						if(!functions.match(this)) 
							{ canSubmit = false; }
						}
					});
				if(!canSubmit)
					{ item.preventDefault(); }
				else
					{
					if(callback)
						{  // Change this to .serializeArray() for JSON
						item.preventDefault();
						callback($(this).serialize());
						}
					}
				});
			
		var functions = 
			{
			validateString : function(type, string)
				{
				// Validate email regular expression
				if(type=='email')
					{
					var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
					if(filter.test(string))
						{ return true; }
					else
						{ return false; }
					}
				// Validate a simple URL regular expression
				else if(type=='http')
					{
					var filter = /http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2,3}/i
					if(filter.test(string))
						{ return true; }
					else
						{ return false; }
					}
				},
			validate : function(item)
				{
				var alertName = formName + $(item).attr('name');
				if($(item).attr('validate')=='email')
					{
					var valid = functions.validateString('email', $(item).val());
					var validType = 'email address';
					}
				else if($(item).attr('validate')=='http')
					{
					var valid = functions.validateString('http', $(item).val());
					var validType = 'web address';
					}
				if(!valid) 
					{
					if(!$('#' + alertName).is(':visible'))
						{
						$('#' + formName).find('.formlyAlerts').append('<div class="formlyInvalid formlyAlert" id="' + alertName + '">Invalid ' + validType + '</div>')
						$('#' + alertName).fadeIn();
						}
					var borderColor = $('#' + alertName).css('background-color');
					$(item).css('border-color', borderColor);
					if($(item).attr('type')=='password')
						{ $(item).next('.formlyPWPlaces').css('border-color', borderColor); }
					return false;
					}
				else
					{ 
					$('#' + alertName).fadeOut(function()
						{ $(this).remove() }); 
					$(item).css('border-color', '');
					$('.formlyPWPlaces').css('border-color', '');
					return true;
					}
					
				},
			require : function(item)
				{
				var alertName = formName + $(item).attr('name');
				var label = $(item).attr('label')+' ';
				if(label=='undefined '){label='';}
				if(!$(item).val() || $(item).val()==$(item).attr('place')) 
					{
					if(!$('#' + alertName).is(':visible'))
						{
						$('#' + formName).find('.formlyAlerts').append('<div class="formlyRequired formlyAlert" id="' + alertName + '">'+label+'Required</div>')
						$('#' + alertName).fadeIn();
						}
					var borderColor = $('#' + alertName).css('background-color');
					$(item).css('border-color', borderColor);
					if($(item).attr('type')=='password')
						{ $(item).next('.formlyPWPlaces').css('border-color', borderColor); }
					return false;
					}
				else if($(item).attr('type')=='checkbox' && !$(item).is(':checked'))
					{
					if(!$('#' + alertName).is(':visible'))
						{
						$('#' + formName).find('.formlyAlerts').append('<div class="formlyRequired formlyAlert" id="' + alertName + '">'+label+'Required</div>')
						$('#' + alertName).fadeIn();
						$(item).focus();
						}
					var borderColor = $('#' + alertName).css('background-color');
					$(item).css('border-color', borderColor);
					return false;
					}
				else
					{ 
					$('#' + alertName).fadeOut(function()
						{ $(this).remove() }); 
					$(item).css('border-color', '');
					$('.formlyPWPlaces').css('border-color', '');
					return true;
					}
				},
			match : function(item)
				{
				var alertName = formName + $(item).attr('name');
				var label = $(item).attr('label')+' ';
				if(label=='undefined '){label='';}
				var toMatch = $(item).attr('match');
				if($(item).val() != $('#' + formName).find('input[name=' + toMatch + ']').val() || !$(item).val())
					{
					if(!$('#' + alertName).is(':visible'))
						{
						$('#' + formName).find('.formlyAlerts').append('<div class="formlyInvalid formlyAlert" id="' + alertName + '">'+label+'Does not match</div>')
						$('#' + alertName).fadeIn();
						}
					var borderColor = $('#' + alertName).css('background-color');
					$(item).css('border-color', borderColor);
					if($(item).attr('type')=='password')
						{ $(item).next('.formlyPWPlaces').css('border-color', borderColor); }
					return false;
					}
				else
					{ 
					$('#' + alertName).fadeOut(function()
						{ $(this).remove() }); 
					$(item).css('border-color', '');
					$('.formlyPWPlaces').css('border-color', '');
					return true;
					}
				}
			};
		};
		
})( jQuery );