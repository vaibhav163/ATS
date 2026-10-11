$(document).ready(function(){
     miraclzTrack();
  $('ul.first').bsPhotoGallery({
    "classes" : "col-lg-3 col-md-3 col-sm-4 col-xs-4 col-xxs-12",
    "hasModal" : true
  });
	  $('ul.second').bsPhotoGallery({
    "classes" : "col-lg-3 col-md-3 col-sm-4 col-xs-4 col-xxs-12",
    "hasModal" : true
  });
  $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

  $(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

  $("#BtnEnquiry").click(function(){
  	if(validateEnquiry())
			{
                var ref = getUrlVars()["ref"];
				$("#BtnEnquiry").val('Please wait...');
				$("#BtnEnquiry").prop('disabled',false);
				 $.ajax({
			        type: 'POST',
			        contentType: "application/json; charset=utf-8",
			        url: "submit-data.php?type=Enquiry&reference="+ref,
			        data: JSON.stringify({ Cname:$("#TxtBxName").val(),Cemail: $("#TxtBxEmail").val(), Ctel: $("#TxtBxMob").val(), Ccountry: $("#TxtBxCountry").val() }),
			        dataType: 'json',
			        success: function (Result) {

			        	$("#BtnEnquiry").val('SUBMIT');
			        	$("#BtnEnquiry").prop('disabled',false);
			            if(Result=='success')
			            {
                            $("#EnquiryForm").fadeOut(500);
			            	$(".enq-success").fadeIn(500);
			            	
                            download("http://danubeproperties.ae/miraclz/miraclz.pdf");
                            
                            //window.location = 'http://danubeproperties.ae/miraclz/miraclz.pdf';
			            }
			        },
			        error: function (Result) {
			           $("#BtnEnquiry").prop('disabled',false);
			        }
    			});
			}
  });

  $("#BtnPayment").click(function(){
  	if(validatePayment())
			{
				$("#BtnPayment").val('Please wait...');
				$("#BtnPayment").prop('disabled',true);
				 $.ajax({
			        type: 'POST',
			        contentType: "application/json; charset=utf-8",
			        url: "submit-data.php?type=Payment&reference="+ref,
			        data: JSON.stringify({ Pname:$("#TxtBxPname").val(),Pemail: $("#TxtBxPemail").val(), Pmob: $("#TxtBxPmob").val(), Pmsg: $("#TxtBxPmsg").val() }),
			        dataType: 'json',
			        success: function (Result) {

			        	$("#BtnPayment").val('SEND MESSAGE');
			        	$("#BtnPayment").prop('disabled',false);
			            if(Result=='success')
			            {
			            	$(".payment-success").fadeIn(500);
			            	$(".payment-success").delay(2000).fadeOut(500);
			            }
			        },
			        error: function (Result) {
			           $("#BtnPayment").prop('disabled',false);
			        }
    			});
			}
  });

});


function miraclzTrack()
{
    var ref = getUrlVars()["ref"];
    $.ajax({
    		        type: 'GET',
			        contentType: "application/json; charset=utf-8",
			        url: "submit-data.php?type=track&reference="+ref,
			        data: JSON.stringify({}),
			        dataType: 'json',
			        success: function (Result) {
			        },
			        error: function (Result) {
			        }
    			});
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function validateEnquiry()
{
	var valid=true;
		if($("#TxtBxName").val().length<=3)
		{
			$(".cname").fadeIn(500).html("Please Enter your Name!!");
			valid=false;
		}
		else{$(".cname").fadeOut(500);}


		if(!IsEmail($("#TxtBxEmail").val()))
		{
			$(".cemail").fadeIn(500).html("The Email you entered is wrong!!");
			valid=false;
		}
		else{$(".cemail").fadeOut(500);}


		if($("#TxtBxMob").val().length<=3)
		{
			$(".cmob").fadeIn(500).html("Please Enter your Contact Number!!");
			valid=false;
		}
		else{$(".cmob").fadeOut(500);}

		if($("#TxtBxCountry").val()=='')
		{
			$(".ccountry").fadeIn(500).html("Please select your Country!!");
			valid=false;
		}
		else{$(".ccountry").fadeOut(500);}

		return valid;
}


function validatePayment()
{
	var valid=true;
		if($("#TxtBxPname").val().length<=3)
		{
			$(".pname").fadeIn(500).html("Please Enter your Name!!");
			valid=false;
		}
		else{$(".pname").fadeOut(500);}


		if(!IsEmail($("#TxtBxPemail").val()))
		{
			$(".pemail").fadeIn(500).html("The Email you entered is wrong!!");
			valid=false;
		}
		else{$(".pemail").fadeOut(500);}


		if($("#TxtBxPmob").val().length<=3)
		{
			$(".pmob").fadeIn(500).html("Please Enter your Contact Number!!");
			valid=false;
		}
		else{$(".pmob").fadeOut(500);}

		return valid;
}

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	    if (!regex.test(email)) {
	        return false;
	    } else {
	        return true;
	    }
	}