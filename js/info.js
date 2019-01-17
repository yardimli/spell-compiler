$(document).ready(function ()
{

	$("#commandbox").keyup(function (e) {
		if (e.keyCode == 13) {

			$("#chatmsg").append( $("#commandbox").val() + "<br>").animate({scrollTop: $('#chatmsg').prop("scrollHeight")}, 500);
			$("#commandbox").val('');

		}
	});


});

