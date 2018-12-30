var total_salary=0;
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
    var table = $('#example').DataTable({ "pageLength": 2});
 
 

    $("#submitBtn").click(function(e){
        e.preventDefault();
        if($("#exampleFrm").valid())
			calculate(table);
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

function calculate(table) {
        var data = table.$('input, select').serialize();
        data=decodeURI(data);
		
		var totalIssues=0;
		var totalVoids=0;
		var issues=0;
		var voids=0;
		var currentType="";
		$.each(data.split("&"),function(index){
			 var counter=index%3;
			 
			 	var val=this.split("=")[1];
				
				if(counter==0){
					currentType=val;
					if(currentType=="Issue")
						issues++;
					else
						voids++;
				}
				
				if(counter==1){
					if(currentType=="Issue")
						totalIssues+=parseFloat(val);
					else
						totalVoids+=parseFloat(val);
				
				}
				
					
			 	
		});
		alert(
           "totalIssues=" + totalIssues +",issues="+issues+",totalVoids="+totalVoids+",voids="+voids
        );
    } 