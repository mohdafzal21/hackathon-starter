$(document).ready(function() {

  // Place JavaScript code here...

    $('#link').on('click',function (e) {
        $('.form',).hide();
        $('#edit-form').show();


    })

    $('#ajax_update').on('click',function (e) {

        e.preventDefault();

        $.ajax({
            method: "POST",
            url: "/updateSport",
            data: {_csrf: $("#_csrf").val(),id: $("#id").val(), name: $("#name").val(), type: $("#type").val() }
        })
            .done(function( json ) {
                console.log($("#id").val())
                $('.form').show();
                $('#edit-form').hide();

                $('#li_name').html(json.sport.name);
                $('#li_type').html(json.sport.type);
                // console.log();

            });

    })

    // $('.form').each( function(index) {
    //     $(this).on('click', function (e) {
    //         e.preventDefault();
    //
    //         $.ajax({
    //             method: "POST",
    //             url: '/deleteSport' + $("#id").val(),
    //             data: {_csrf: $("#_csrf").val(), id: $("#id").val()}
    //             // success: function(result) {
    //             //     // Do something with the result
    //             //     console.log('succesfully deleted'+result);
    //             // }
    //         })
    //             .done(function (json) {
    //                 console.log($("#id").val())
    //                 console.log(json);
    //                 $('.form').show();
    //             });
    //
    //     })
    // })

    $(function() {
        $('form').each(function() {
            var form = this;
            $(form).find(".deletebutton").click(function(e) {
                e.preventDefault();


                var id = $(form).find(".id").val()
                $.ajax({
                    method: "POST",
                    url: '/deleteSport/' + id,
                    data: {_csrf: $("#_csrf").val(), id: id}

                })
                    .done(function (json) {
                        console.log($("#id").val())
                        console.log(json);
                        $(form).closest('.listItem').remove();
            });
            });
        });
    });
});