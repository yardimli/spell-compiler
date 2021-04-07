$(document).ready(function () {


// create the editor
// const container = document.getElementById("jsoneditor");
// const options = {};
// const editor = new JSONEditor(container, options);
  var structures;
  var updatedJson;

  $("#test_query_submit").on('click', function () {

    console.log($("#test_query").val());

    ParseSource($("#test_query").val(), function (data) {

      var structure_div = "<div style='margin-bottom: 10px;'>";

      for (var i = 0; i < data.parsed[0].length; i++) {
        console.log(data.parsed[0][i]);

        structure_div += "<div style='display: inline-block; vertical-align: top; margin-right:20px; border: 1px solid #ccc; padding:5px;'>";
        structure_div += data.parsed[0][i][0] + "<br>";
        structure_div += data.parsed[0][i][1] + "<br>";
        structure_div += "</div>";
      }
      structure_div += "</div>";


      $("#query_result_box").html(structure_div);

    });

  });

  var value_array_string = "{value: 'big', text: 'big' }, { value: 'circle', text: 'circle' }, { value: '1', text: '1' }";

  $.getJSON("structures.json", function (json) {
    structures = json;
    // editor.set(structures);
    // updatedJson = editor.get();

    console.log(structures["rules"]);

    for (var i = 0; i < structures["rules"].length; i++) {
      console.log(structures["rules"][i]);
      var structure_div = "<div style='margin-bottom: 10px;'>";

      for (var j = 0; j < structures["rules"][i].length; j++) {
        console.log(structures["rules"][i][j]);
        structure_div += "<div class='structure_container'>";
        structure_div += "<div class='structure_container_word'>" + structures["rules"][i][j].word + "</div>";
        structure_div += "<div class='structure_container_pos'>" + structures["rules"][i][j].op + "</div>";

        var structure_command = structures["rules"][i][j].command;
        if (typeof structures["rules"][i][j].command === "undefined" || structures["rules"][i][j].command === "") {
          structure_command = "---";
        }
        structure_div += "<span class='structure_container_command' data-value='" + structure_command + "'>" +  structure_command.replaceAll(",","<br>") + "</span><br>";

        structure_div += "</div>";
      }
      structure_div += "</div>";
      $("#json_list").append(structure_div);
    }

    $(".structure_container_command").on('click',function () {
      $('.dropdown-tree__item').removeClass("checked");

      var temp_categories = $(this).data("value");
      temp_categories = temp_categories.split(",");
      $('.dropdown-tree__item').each(
        function (index,item) {
          for (var i=0; i<temp_categories.length; i++) {
            if ($(item).data("catid")===temp_categories[i].trim()) {
              console.log($(item).data("catid"));
              $(item).addClass("checked");
            }
          }
        });

      $("#dropdown_edit").css({
        "top" : ($(this).position().top-13) + "px",
        "left" : ($(this).position().left-5) + "px",
      });
      $("#structure_categories").val( $(this).data("value") );
      $("#dropdown_edit").fadeIn(300);
      $("#dropdown_edit").fadeIn(300);
      $('.js-dropdown-tree').fadeIn(300,function () {
        tree_is_visible = true;
      });
    });

  });


//---------------------------------------------------------------------------------------------------------------------------
  function ParseSource(Source, callback) {
    object_counter = 0;
    LastXPos = 100;
    LastYPos = 100;


    var UrlToGet = "parse_temp_program.php";
    var data = {"source": Source};

    $.ajax({
      type: "POST",
      url: UrlToGet,
      data: data,
      dataType: "json",
      success: function (data, status) {
        console.log(data);
        callback(data);
      },
      error: function (data, status) {
        console.log("error Status: " + status);
      }

    });
  }


});