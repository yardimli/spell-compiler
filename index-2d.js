var m, re;
var object_counter = 0;

var LastXPos = 100;
var LastYPos = 100;

var ParsedSource;

if (!String.prototype.isInList) {
  String.prototype.isInList = function () {
    let value = this.valueOf();
    for (let i = 0, l = arguments.length; i < l; i += 1) {
      if (arguments[i] === value) return true;
    }
    return false;
  }
}

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
      var newlines = "";
      ParsedSource = data["parsed"];
      for (x in ParsedSource) {
        var newline = "";
        var linex = ParsedSource[x];
        for (y in linex) {
          if (linex[y][0] === ".") {
            newline += "\n";
          }
          else {
            if (newline !== "") {
              newline += " ";
            }
            newline += linex[y][0];
          }
        }
        newlines += newline;
      }

      $("#spellscript").val(data["raw"]);
      //$("#spellscript").val(newlines);
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


    for (x in ParsedSource) {
      var newline = "";
      var linex = ParsedSource[x];

      var operation = "";
      var object_x = "";
      var color_x = "";

      for (y in linex) {
        if (linex[y][0] === ".") {
          newline += "\n";
        }
        else {
          if (linex[y][1] === "VB") {
            operation = linex[y][0];
          }

          if (linex[y][1] === "DT") {
            if (linex[y + 1][1] === "NN") {
              object_x = linex[y + 1][0];
            }
          }

          if (linex[y][1] === "DT") {
            if (linex[y + 1][1] === "JJ" && linex[y + 2][1] === "NN") {
              color_x = linex[y + 1][0];
              object_x = linex[y + 2][0];
            }
          }

        }
      }

      if (operation.toLowerCase().isInList("add", "create", "insert")) {
        CreateObject("ball", "", "4");
      }
    }

    //
    // 0: [["create", "VB"], ["a", "DT"], ["ball", "NN"], [".", "."]]
    // 1: [["create", "VB"], ["ball", "NN"], [".", "."]]
    // 2: [["create", "VB"], ["x1", "NN"], ["as", "IN"], ["ball", "NN"], [".", "."]]
    // 3: [["create", "VB"], ["x2", "NN"], ["as", "IN"], ["a", "DT"], ["ball", "NN"], [".", "."]]
    // 4: [["create", "VB"], ["a", "DT"], ["ball", "NN"], ["as", "IN"], ["x5", "NN"], [".", "."]]
    // 5: [["create", "VB"], ["ball", "NN"], ["as", "IN"], ["x6", "NN"], [".", "."]]

    // 6: [["create", "VB"], ["a", "DT"], ["white", "JJ"], ["ball", "NN"], [".", "."]]
    // 7: [["create", "VB"], ["white", "JJ"], ["ball", "NN"], [".", "."]]
    // 8: [["create", "VB"], ["x1", "NN"], ["as", "IN"], ["white", "JJ"], ["ball", "NN"], [".", "."]]
    // 9: [["create", "VB"], ["x2", "NN"], ["as", "IN"], ["a", "DT"], ["white", "JJ"], ["ball", "NN"],…]
    // 10: [["create", "VB"], ["a", "DT"], ["white", "JJ"], ["ball", "NN"], ["as", "IN"], ["x5", "NN"],…]
    // 11: [["create", "VB"], ["white", "JJ"], ["ball", "NN"], ["as", "IN"], ["x6", "NN"], [".", "."]]

    // 12: [["create", "VB"], ["two", "CD"], ["balls", "NNS"], [".", "."]]
    // 13: [["create", "VB"], ["x1", "NN"], ["and", "CC"], ["x2", "NN"], ["as", "IN"], ["two", "CD"],…]
    // 14: [["create", "VB"], ["x3", "NN"], ["and", "CC"], ["x4", "NN"], ["as", "IN"], ["balls", "NNS"],…]
    // 15: [["create", "VB"], ["three", "CD"], ["balls", "NNS"], ["as", "IN"], ["x5", "NN"], [",", ","],…]

    // 16: [["create", "VB"], ["two", "CD"], ["blue", "JJ"], ["balls", "NNS"], [".", "."]]
    // 17: [["create", "VB"], ["x1", "NN"], ["and", "CC"], ["x2", "NN"], ["as", "IN"], ["two", "CD"],…]
    // 18: [["create", "VB"], ["x3", "NN"], ["and", "CC"], ["x4", "NN"], ["as", "IN"], ["blue", "JJ"],…]
    // 19: [["create", "VB"], ["three", "CD"], ["blue", "JJ"], ["balls", "NNS"], ["as", "IN"], ["x5", "NN"],…]
    // 20: [["create", "VB"], ["a", "DT"], ["cube", "NN"], ["as", "IN"], ["y3", "NN"], [".", "."]]


    // 21: [["add", "VB"], ["y2", "NN"], ["as", "IN"], ["a", "DT"], ["cube", "NN"], [".", "."]]
    // 22: [["add", "VB"], ["a", "DT"], ["ball", "NN"], [".", "."]]
    // 23: [["create", "VB"], ["a", "DT"], ["ball", "NN"], [".", "."]]
    // 24: [["color", "NN"], ["x", "NN"], ["as", "IN"], ["blue", "JJ"], [".", "."]]
    // 25: [["move", "VB"], ["x", "CC"], ["right", "JJ"], ["100", "CD"], [".", "."]]
    // 26: [["move", "VB"], ["y", "RB"], ["up", "RP"], ["100", "CD"], [".", "."]]
    // 27: [["move", "NN"], ["y", "RB"], ["left", "VBD"], ["100", "CD"], [".", "."]]
    // 28: [["move", "NN"], ["x", "NN"], ["up", "IN"], ["50", "CD"], [".", "."]]
    // 29: [["color", "NN"], ["y", "NN"], ["as", "IN"], ["green", "JJ"], [".", "."]]

    if (1 == 2) {
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


// Number Tag Description
//  1.	CC	Coordinating conjunction
//  2.	CD	Cardinal number
//  3.	DT	Determiner
//  4.	EX	Existential there
//  5.	FW	Foreign word
//  6.	IN	Preposition or subordinating conjunction
//  7.	JJ	Adjective
//  8.	JJR	Adjective, comparative
//  9.	JJS	Adjective, superlative
// 10.	LS	List item marker
// 11.	MD	Modal
// 12.	NN	Noun, singular or mass
// 13.	NNS	Noun, plural
// 14.	NNP	Proper noun, singular
// 15.	NNPS	Proper noun, plural
// 16.	PDT	Predeterminer
// 17.	POS	Possessive ending
// 18.	PRP	Personal pronoun
// 19.	PRP$	Possessive pronoun
// 20.	RB	Adverb
// 21.	RBR	Adverb, comparative
// 22.	RBS	Adverb, superlative
// 23.	RP	Particle
// 24.	SYM	Symbol
// 25.	TO	to
// 26.	UH	Interjection
// 27.	VB	Verb, base form
// 28.	VBD	Verb, past tense
// 29.	VBG	Verb, gerund or present participle
// 30.	VBN	Verb, past participle
// 31.	VBP	Verb, non-3rd person singular present
// 32.	VBZ	Verb, 3rd person singular present
// 33.	WDT	Wh-determiner
// 34.	WP	Wh-pronoun
// 35.	WP$	Possessive wh-pronoun
// 36.	WRB	Wh-adverb