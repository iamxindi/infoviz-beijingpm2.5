$(document).ready(function() {
  loadData();
  drawCircleAnimation();
});

function loadData() {
  d3.csv("data/data.csv", function(d) {
    data = d;
    // when checkbox changes, update
    $('input[type=checkbox]').on("change", update);

  })
}




function sliderChange(id) {
  value = document.getElementById(id).value
  document.getElementsByClassName(id)[0].innerHTML = value
  update();
}

function update() {

  var val = [];
  var arrays = [];

  if ($("input:checkbox:checked").length == 0) { // if there's no checked checkbox
    val = data;
  } else { // there is some filters


    if (val.length == 0){
      console.log("update")
      //console.log("filters")
      //add data
      $('input[type=checkbox]').each(function() {
        if (this.checked) {
          if (this.name == "winddirection") {
            var cbwd = this.value // assign a variable!!
            var filtered_data = data.filter(function(d) {
              return d["cbwd"] == cbwd;
            });
            arrays.push(filtered_data)
            for (i = 0; i < arrays.length; i++) {
              val = val.concat(arrays[i])
            }
          }

          if (this.name == "temp") {
            var lowest = parseInt(document.getElementById("temp_lowest").value)
            var highest = parseInt(document.getElementById("temp_highest").value)

            val = data.filter(function(d) {
              return d["TEMP"]>lowest && d["TEMP"]<highest;
            })
          }

          if (this.name == "windspd") {
            var lowest = parseInt(document.getElementById("wind_lowest").value)
            var highest = parseInt(document.getElementById("wind_highest").value)

            val = data.filter(function(d) {
              return d["Iws"]> lowest && d["Iws"]< highest;
            })
          }
        }
      })

    }
    else{
      console.log("1")
      //filter val
      $('input[type=checkbox]').each(function() {
        if (this.checked) {
          if (this.name == "winddirection") {


          }

          if (this.name == "temp") {


          }

          if (this.name == "windspd") {

          }
        }
      })
    }



  }
  return val
}

// combine all the arrays together

//return val


function toggle() {
  if ($("#temp").is(":checked")) {
    $(".tempfilter").css("display", "block");
  } else {
    $(".tempfilter").css("display", "none");
  }

  if ($("#windspd").is(":checked")) {
    $(".windspdfilter").css("display", "block");
  } else {
    $(".windspdfilter").css("display", "none");
  }


}

function drawCircleAnimation() {
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", 500)
    .attr("height", 300)
    .append("g")

  var circle = svg.append("circle")
    .attr("cx", 250)
    .attr("cy", 150)
    .style("fill", "blue")
    .attr("r", 20)

  var pm = svg.append("text")
    .attr("dx", 250)
    .attr("dy", 150)
    .text("100")

  repeat();

  function repeat() {
    circle
      .transition()
      .attr('r', function(d) {
        return Math.random() * 50
      })
      .on("end", repeat);
  }
}
