$(document).ready(function() {



    $("td input,td select").change(function(){
        var editor=$(this);
		var val=$(this).val();
		if(val.length>0){
			addValidation(editor);
		}
		else{
			removeValidation(editor);
		}	
		
    });

	
	
    $("#exampleFrm").validate({
        errorElement: "span",
        errorClass: "arp-error",
        highlight: function(a, b) {
            $(a).addClass("arp-error-field")
        },
        success: function(a) {
            a.parent().find("input").removeClass("arp-error-field");
            a.hide();
            a.remove()
        },
        ignore: ".arp-ignore-validation",
        submitHandler: function(form) {
            form.submit();
          }
    });
    var table = $('#example').DataTable();
 
    /*$('button').click( function() {
        var data = table.$('input, select').serialize();
        alert(
            "The following data would have been submitted to the server: \n\n"+
            data.substr( 0, 120 )+'...'
        );
        return false;
    } );*/

    $("#submitBtn").click(function(e){
        e.preventDefault();
        $("#exampleFrm").valid();
    });

   
    jQuery.validator.addMethod("toYearGreaterthanFromYearCheck", function(a, b) {
        return p(a, b)
    }, "To year should be greater than From year");
    
} );


function addValidation(editor){
	editor.closest("tr").children("td").each(function(index){
		$(this).children().first().removeClass("arp-ignore-validation");
	});
}

function removeValidation(editor){
	editor.closest("tr").children("td").each(function(index){
		$(this).children().first().addClass("arp-ignore-validation").removeClass("arp-error-field");
	});
}