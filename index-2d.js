var m, re;
var object_counter = 0;

var LastXPos = 100;
var LastYPos = 100;


//---------------------------------------------------------------------------------------------------------------------------
function LoadProgramFile(face_name) {
  object_counter = 0;
  LastXPos = 100;
  LastYPos = 100;


  var UrlToGet = "load_program.php";
  var data = {"program_name": face_name};

  $.ajax({
    url: UrlToGet,
    data: data,
    dataType: "json",
    success: function (data, status) {
      $("#spellscript").val(data);
//      console.log("Status: " + status);
    },
    error: function (data, status) {
      console.log("error Status: " + status);
    }

  });
}


function CreateObject(obj_type, obj_name, rule_id) {
  obj_type = obj_type.trim();
  obj_name = obj_name.trim();

  object_counter++;
  if (obj_name === "") {
    obj_name = obj_type + "_" + object_counter;
  }

  console.log("adding a '" + obj_type + "' object name '" + obj_name + "' (rule " + rule_id + ")");

  LastXPos += 100;
  if (LastXPos > 600) {
    LastXPos = 100;
    LastYPos += 100;
  }

  if (obj_type === 'ball') {
    $("#DrawArea").append($("<div/>", {
      "id": obj_name,
      "data-obj_type": obj_type,
      "css": {
        position: "absolute",
        top: LastYPos + "px",
        left: LastXPos + "px",
        width: "100px",
        height: "100px",
        borderRadius: "50px",
        border: "thin red dashed"
      }
    }));
  }
  else if (obj_type === 'cube') {
    $("#DrawArea").append($("<div>", {
      "id": obj_name,
      "data-obj_type": obj_type,
      "css": {
        position: "absolute",
        top: LastYPos + "px",
        left: LastXPos + "px",
        width: "100px",
        height: "100px",
        border: "thin red dashed"
      }
    }));
  }
}

function AddObject(scriptline) {
  re = /add (.*) (as a|as) (.*)/gi;
  m = re.exec(scriptline);
  if (m !== null) {
    CreateObject(m[3], m[1], "1");
    return;
  }

  re = /create a (.*) as(.*)/gi;
  m = re.exec(scriptline);
  if (m !== null) {
    CreateObject(m[1], m[2], "3");
    return;
  }

  re = /create (.*) (as a|as) (.*)/gi;
  m = re.exec(scriptline);
  if (m !== null) {
    CreateObject(m[3], m[1], "2");
    return;
  }

  re = /(add|create) a (.*)/gi;
  m = re.exec(scriptline);
  if (m !== null) {
    CreateObject(m[2], "", "4");
    return;
  }
}

$(document).ready(function () {


  $('#compilebtn').on('click', function () {

    $("#DrawArea").html("");
    LastXPos = 100;
    LastYPos = 100;

    var script1 = $('#spellscript').val().split('\n');

    for (var i = 0; i < script1.length; i++) {
      scriptline = script1[i].trim();
      console.log(scriptline);

      if (scriptline.indexOf("//") === 0 || scriptline === "") {

      }
      else {


        //creating new element
        AddObject(scriptline);


        //changing color
        re = /color (.*) as (.*)/gi;
        m = re.exec(scriptline);
        if (m !== null) {
          m1 = m[1];
          m2 = m[2];
          m1 = m1.trim();
          m2 = m2.trim();
          console.log(m1 + ' - ' + m2);

          $("#" + m1).css({"background-color": m2});
        }


        //changing position
        re = /move (.*) (left|right|up|down) (.*)/gi;
        m = re.exec(scriptline);
        if (m !== null) {
          m1 = m[1];
          m2 = m[2];
          m3 = m[3];
          m1 = m1.trim();
          m2 = m2.trim();
          m3 = m3.trim();
          m3 = parseInt(m3);
          console.log(m1 + ' - ' + m2 + ' - ' + m3);

          if (m2 === 'left') $("#" + m1).css({"left": $("#" + m1).position().left - m3});
          if (m2 === 'right') $("#" + m1).css({"left": $("#" + m1).position().left + m3});
          if (m2 === 'up') $("#" + m1).css({"top": ($("#" + m1).position().top - m3)});
          if (m2 === 'down') $("#" + m1).css({"top": $("#" + m1).position().top + m3});
        }

      }
    }

  });


  LoadProgramFile("program1.txt");
  $("#spellname").val("program1.txt");
  //---------------------------------------------------------------------------------------------------------------------------
  var UrlToGet = "load_programs.php";

  var data = {};

  $.ajax({
    url: UrlToGet,
    data: data,
    dataType: "json",
    success: function (data, status) {
      for (program in data) {
//        console.log(data[program]);
        $("#program_list").append('<option value="' + data[program] + '">' + data[program] + '</option>\n');
      }

      //---------------------------------------------------------------------------------------------------------------------------
      $("#program_list").on('change', function (e) {
        LoadProgramFile($(this).val());
        $("#spellname").val($(this).val());
        e.preventDefault();
      });

//      console.log("Status: " + status);
    },
    error: function (data, status) {
      console.log("error Status: " + status);
    }
  });

  //---------------------------------------------------------------------------------------------------------------------------
  $("#save_btn").on('click', function (e) {
    console.log("save program press");
    if ($("#spellname").val() !== "") {
      console.log("save program");

      var UrlToGet = "save_program.php";
      var data = {"program_code": $("#spellscript").val(), "program_name": $("#spellname").val()};

      $.ajax({
        type: "POST",
        url: UrlToGet,
        data: data,
        dataType: "text",
        success: function (data, status) {
          console.log("Status: " + status);
        },
        error: function (data, status) {
          console.log("error Status: " + status);
        }
      });
    }
    else {
      alert("program name?");
    }
    e.preventDefault();
  });


});
