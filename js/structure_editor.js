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
        structure_div += "<div style='display: inline-block; vertical-align: top; margin-right:10px; border: 1px solid #ccc; padding:5px;'>";
        structure_div += "<div style='background-color: #ccc;'>" + structures["rules"][i][j].word + "</div>";
        structure_div += structures["rules"][i][j].op + "<br>";

        if (typeof structures["rules"][i][j].command === "undefined" || structures["rules"][i][j].command === "") {
          structure_div += "<span class='command_input'>---</span><br>";
        }
        else {
          structure_div += "c:<span class='command_input'>" + structures["rules"][i][j].command + "</span><br>";
        }

        if (typeof structures["rules"][i][j].value === "undefined" || structures["rules"][i][j].value === "") {
          structure_div += "---<br>";
        }
        else {
          structure_div += "v:" + structures["rules"][i][j].value + "<br>";
        }

        if (typeof structures["rules"][i][j].group === "undefined" || structures["rules"][i][j].group === "") {
          structure_div += "---<br>";
        }
        else {
          structure_div += "g:" + structures["rules"][i][j].group + "<br>";
        }

        structure_div += "</div>";
      }
      structure_div += "</div>";
      $("#json_list").append(structure_div);
    }

    $('.command_input').editable({
      type: 'select',
      pk: 1,
      name: 'command',
      title: 'Enter command',
      source: [{
        value: 'create',
        text: 'create'
      },
        {
          value: 'quantity',
          text: 'quantity'
        },
        {
          value: 'quality',
          text: 'quality'
        },
        {
          value: 'color',
          text: 'color'
        },
        {
          value: 'shape',
          text: 'shape'
        },
        {
          value: 'end',
          text: 'end'
        },
        {
          value: 'var_name',
          text: 'variable name'
        },
        {
          value: 'var_target',
          text: 'variable target'
        }
      ]

      // validate: function (value) {
      //   if ($.trim(value) === '') return 'This field is required';
      // }
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


//   // set json
// const initialJson = {
//   "Array": [1, 2, 3],
//   "Boolean": true,
//   "Null": null,
//   "Number": 123,
//   "Object": {"a": "b", "c": "d"},
//   "String": "Hello World"
// }
// editor.set(initialJson)

// get json


  $.fn.editable.defaults.mode = 'inline';
  $.fn.editableform.buttons =
    '<button type="submit" class="btn btn-primary btn-sm editable-submit">' +
    '<i class="fa fa-fw fa-check"></i>' +
    '</button>' +
    '<button type="button" class="btn btn-warning btn-sm editable-cancel">' +
    '<i class="fa fa-fw fa-times"></i>' +
    '</button>';


  $('#sex').editable({
    source: [{
      value: 1,
      text: 'Male'
    },
      {
        value: 2,
        text: 'Female'
      }
    ]
  });

  $('#status').editable();

  $('#group').editable({
    showbuttons: false
  });

  $('#vacation').editable({
    datepicker: {
      todayBtn: 'linked'
    }
  });

  $('#dob').editable();

  $('#event').editable({
    placement: 'right',
    combodate: {
      firstItem: 'name'
    }
  });

  $('#meeting_start').editable({
    format: 'yyyy-mm-dd hh:ii',
    viewformat: 'dd/mm/yyyy hh:ii',
    validate: function (v) {
      if (v && v.getDate() === 10) return 'Day cant be 10!';
    },
    datetimepicker: {
      todayBtn: 'linked',
      weekStart: 1
    }
  });

  $('#comments').editable({
    showbuttons: 'bottom'
  });

  $('#note').editable();
  $('#pencil').on("click", function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('#note').editable('toggle');
  });

  $('#state').editable({
    source: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
  });

  $('#state2').editable({
    value: 'California',
    typeahead: {
      name: 'state',
      local: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
    }
  });

  $('#fruits').editable({
    pk: 1,
    limit: 3,
    source: [{
      value: 1,
      text: 'banana'
    },
      {
        value: 2,
        text: 'peach'
      },
      {
        value: 3,
        text: 'apple'
      },
      {
        value: 4,
        text: 'watermelon'
      },
      {
        value: 5,
        text: 'orange'
      }
    ]
  });

  $('#tags').editable({
    inputclass: 'input-large',
    select2: {
      tags: ['html', 'javascript', 'css', 'ajax'],
      tokenSeparators: [",", " "]
    }
  });

  $('#address').editable({
    url: '/post',
    value: {
      city: "Moscow",
      street: "Lenina",
      building: "12"
    },
    validate: function (value) {
      if (value.city === '') return 'city is required!';
    },
    display: function (value) {
      if (!value) {
        $(this).empty();
        return;
      }
      var html = '<b>' + $('<div>').text(value.city).html() + '</b>, ' + $('<div>').text(value.street).html() + ' st., bld. ' + $('<div>').text(value.building).html();
      $(this).html(html);
    }
  });

  $('#user .editable').on('hidden', function (e, reason) {
    if (reason === 'save' || reason === 'nochange') {
      var $next = $(this).closest('tr').next().find('.editable');
      if ($('#autoopen').is(':checked')) {
        setTimeout(function () {
          $next.editable('show');
        }, 300);
      }
      else {
        $next.focus();
      }
    }
  });

});