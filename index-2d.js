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
        var currentLine = ParsedSource[x];
        for (y in currentLine) {
          if (currentLine[y][0] === ".") {
            newline += "\n";
          }
          else {
            if (newline !== "") {
              newline += " ";
            }
            newline += currentLine[y][0];
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
      var newlines = "";
      ParsedSource = data["parsed"];
      for (x in ParsedSource) {
        var newline = "";
        var currentLine = ParsedSource[x];
        for (y in currentLine) {
          if (currentLine[y][0] === ".") {
            newline += "\n";
          }
          else {
            if (newline !== "") {
              newline += " ";
            }
            newline += currentLine[y][0];
          }
        }
        newlines += newline;
      }
      callback();
    },
    error: function (data, status) {
      console.log("error Status: " + status);
    }

  });
}


function CreateObject(obj_type, obj_name, obj_color, rule_id) {
  obj_type = obj_type.trim();
  obj_name = obj_name.trim();
  obj_color = obj_color.trim();

  if (obj_color === "") {
    obj_color = "black";
  }

  object_counter++;
  if (obj_name === "") {
    obj_name = obj_type + "_" + object_counter;
  }

  console.log("adding a '" + obj_type + "' object name '" + obj_name + "(" + obj_color + ")" + "' (rule " + rule_id + ")");

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
        border: "thin " + obj_color + " dashed",
        backgroundColor: obj_color
      }
    }));

    LastXPos += 100;
    if (LastXPos > 600) {
      LastXPos = 100;
      LastYPos += 100;
    }

    return obj_name;
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
        border: "thin " + obj_color + " dashed"
      }
    }));

    LastXPos += 100;
    if (LastXPos > 600) {
      LastXPos = 100;
      LastYPos += 100;
    }

    return obj_name;
  }
  else if (obj_type === 'triangle') {
    $("#DrawArea").append($("<div>", {
      "id": obj_name,
      "data-obj_type": obj_type,
      "css": {
        position: "absolute",
        top: LastYPos + "px",
        left: LastXPos + "px",
        borderBottom: "solid 50px "+obj_color,
        borderRight: "solid 50px "+obj_color,
        borderLeft: "solid 50px transparent",
        borderTop: "solid 50px transparent"
      }
    }));

    LastXPos += 100;
    if (LastXPos > 600) {
      LastXPos = 100;
      LastYPos += 100;
    }

    return obj_name;
  } else
  {
    var object_create_error = "no object selected";
    return object_create_error;
  }



}

var CurrentSelectedItem = "";

$(document).ready(function () {


  $('#compilebtn').on('click', function () {

    ParseSource($("#spellscript").val(), function () {
      $("#DrawArea").html("");
      LastXPos = 100;
      LastYPos = 100;

      var reservedNouns = ["ball", "cube","triangle"];
      var reservedSturcture = ["DT JJ NN", "JJ NN", "DT NN","NN"];

      for (var LineNumber = 0; LineNumber < ParsedSource.length; LineNumber++) {
        var currentLine = ParsedSource[LineNumber];

        console.log("--------------------------");
        console.log("sentence len: "+currentLine.length);
        for (var wordNumber = 0; wordNumber < currentLine.length; wordNumber++) {
          console.log(wordNumber + " " + currentLine[wordNumber][0] + " " + currentLine[wordNumber][1]);
          currentLine[wordNumber][2] = false;
        }

        //for naming item(s)
        if (currentLine[0][0].toLowerCase() === "call" || currentLine[0][0].toLowerCase() === "name") {
          if (currentLine[1][0].toLowerCase() === "it") {

            var new_object_name = currentLine[2][0].toLowerCase();
            console.log("rename: "+ CurrentSelectedItem +" to "+ new_object_name);
            $("#DrawArea").children().each(function () {
              if ($(this).attr("id")===CurrentSelectedItem) {
                $(this).attr("id",new_object_name);
                break;
              }
            });
          }
        }
        else

        //for making a selection
        if (currentLine[0][0].toLowerCase() === "select") {

        }
        else {
          //for adding items
          var operation = "";
          var object_x = "";
          var color_x = "";
          var object_name = "";


          //loop and get object to create with its properties replace with placeholder NN
          for (var structureNumber = 0; structureNumber < reservedSturcture.length; structureNumber++) {
            var xStructure = reservedSturcture[structureNumber];
            var xStructureParts = xStructure.split(" ");
            var xStructureMatch = false;
            var xStructureStart = -1;
            console.log(xStructureParts);

            for (var wordNumber = 0; wordNumber < currentLine.length; wordNumber++) {

              if (currentLine[wordNumber][1] === xStructureParts[0] && wordNumber + xStructureParts.length - 1 < currentLine.length) {
                xStructureMatch = true;
                xStructureStart = wordNumber;
                console.log("looking for structure: " + xStructure + " " + xStructureParts.length);

                if (xStructureParts.length === 1) {
                  if (currentLine[wordNumber][1] === "NN" && reservedNouns.indexOf(currentLine[wordNumber][0].toLowerCase()) !== -1) {
                    object_x = currentLine[wordNumber][0];
                  }
                  else {
                    xStructureMatch = false;
                  }
                }
                else {
                  for (var structurePartNumber = 0; structurePartNumber < xStructureParts.length; structurePartNumber++) {
                    console.log(currentLine[wordNumber + structurePartNumber][1] + "  === " + xStructureParts[structurePartNumber]);

                    if (currentLine[wordNumber + structurePartNumber][1] === xStructureParts[structurePartNumber]) {
                      if (currentLine[wordNumber + structurePartNumber][1] === "NN" && reservedNouns.indexOf(currentLine[wordNumber + structurePartNumber][0].toLowerCase()) !== -1) {
                        object_x = currentLine[wordNumber + structurePartNumber][0];
                      }
                      else if (currentLine[wordNumber + structurePartNumber][1] === "NN") {
                        xStructureMatch = false;
                      }

                      if (currentLine[wordNumber + structurePartNumber][1] === "JJ") {
                        color_x = currentLine[wordNumber + structurePartNumber][0];
                      }
                    }
                    else {
                      xStructureMatch = false;
                    }
                  }
                }
              }
              if (xStructureMatch) {
                break;
              }
            }
            if (xStructureMatch) {
              currentLine.splice(xStructureStart, xStructureParts.length, ["object_word", "NN", false]);
              break;
            }
          }

          if (xStructureMatch) {
            console.log("Found Object Structure: start:" + xStructureStart + ", object:" + object_x + ", color:" + color_x);
            console.log(currentLine);

            //loop to get variable name options:
            //x as book,
            //x as yellow book,
            //x as a book
            //x as a yellow book
            //book as x
            //yellow book as x

            //book called x
            //yellow book called x

            //book named x
            //yellow book named x

            for (var wordNumber = 0; wordNumber < currentLine.length; wordNumber++) {

              if (currentLine[wordNumber][1] === "IN" && currentLine[wordNumber][0].toLowerCase() === "as" && wordNumber + 1 < currentLine.length) {

                var reservedNounPosition = "";

                if (currentLine[wordNumber - 1][0].toLowerCase() === "object_word") {
                  reservedNounPosition = "left";
                }

                if (currentLine[wordNumber + 1][0].toLowerCase() === "object_word") {
                  reservedNounPosition = "right";
                }
                console.log("---" + reservedNounPosition);

                if (reservedNounPosition !== "") {
                  if (reservedNounPosition === "left") {
                    object_name = currentLine[wordNumber + 1][0].toLowerCase();
                    currentLine.splice(wordNumber, 2);
                    console.log(currentLine);
                  }
                  else if (reservedNounPosition === "right") {
                    object_name = currentLine[wordNumber - 1][0].toLowerCase();
                    currentLine.splice(wordNumber - 1, 2);
                    console.log(currentLine);
                  }
                }
              }
            }

            //loop to get verb and object definition
            for (var wordNumber = 0; wordNumber < currentLine.length; wordNumber++) {

              if (currentLine[wordNumber][1] === "VB" && wordNumber + 1 < currentLine.length) {
                operation = currentLine[wordNumber][0];
                break;
              }
            }

            if (operation.toLowerCase().isInList("add", "create", "insert")) {
              console.log("RUNNING: " + operation + " " + object_x + " " + color_x);
              CurrentSelectedItem = CreateObject(object_x, object_name, color_x, "4");
            }
          }
        }
      }


    });

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


})
;


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