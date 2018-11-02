// set up global variables
var val
var years = ["2010","2011","2012","2013","2014"]
var state = 1
var path


$(document).ready(function() {
  loadData();
  wireButtonClickEvents();
});


function loadData() {
  d3.csv("data/data.csv", function(d) {
    data = d;
    // when checkbox changes, update
    val = data;
    visualizeChart(state);
    drawCircleAnimation();
    //$('input[type=checkbox]').on("change", updateWindDir);

  })
}

function generateSpiralData(state){
  // extract the pm2.5 from all data
  var aggregated_pm = []
  var pm_data = []
  for (i=0;i<data.length; i++){
    pm_data.push(data[i]["pm2.5"])
  }


  for (i=0;i<years.length;i++){
    // for each year, create a separate array
    year_data = val.filter(function(d) {
      return d["year"] == years[i];
    });

    var year_pm

    switch(state) {
    case 1:
        year_pm = d3.nest()
        .key(function(d) { return d.month; })
        .rollup(function(v) { return d3.mean(v, function(d) { return d["pm2.5"]; }); })
        .entries(year_data);
        break;

    case 2:
        year_pm = d3.nest()
        .key(function(d) { return d.month; })
        .rollup(function(v) { return d3.max(v, function(d) { return parseInt(d["pm2.5"]); }); })
        .entries(year_data);
        break;

    case 3:
        year_pm = d3.nest()
        .key(function(d) { return d.month; })
        //.rollup(function(v) { return d3.min(v, function(d) { return d["pm2.5"]; }); })
        .rollup(function(v) { return d3.median(v, function(d) { return parseInt(d["pm2.5"]); }); })
        .entries(year_data);
        break;
    }



    aggregated_pm = aggregated_pm.concat(year_pm)
  }

  //console.log(aggregated_pm)
  all_year_pm = []
  for (i=0;i<aggregated_pm.length;i++){
    all_year_pm.push(aggregated_pm[i]["value"])
  }
  return all_year_pm

}


function visualizeChart() {



  const margin = { top: 0, right: 100, bottom: 20, left: 100 };
  const width = 1000 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;



  initial_rad = 100;
  rad_offset = 25;
  ir = function(d, i) {return initial_rad+Math.floor(i/12)*rad_offset;}
  or = function(d, i) {return initial_rad+rad_offset+Math.floor(i/12)*rad_offset;}
  sa = function(d, i) {return (i*2*Math.PI)/12;}
  ea = function(d, i) {return ((i+1)*2*Math.PI)/12;}

  var svg1 = d3.select("#spiral")
     .append("svg")
     .attr("width", 800)
     .attr("height", 600)
  var g = svg1.append("g").attr("id", "spiralchart");
  drawSpiral()






//	.on('mouseout', );


}

function drawSpiral(){
  var tooltip = d3.select("body")
  .append("div")
  .attr("class", "toolTip");
  var spiraldata = generateSpiralData(state);
  var color = d3.scaleLinear().domain([0, 100, 200, 500, 800]).range(["green","yellow", "#ffb732", "red", "#8b0000"]);

  path = d3.select('#spiralchart')
  .selectAll('path')
  .data(spiraldata)
  .enter()
  .append('svg:path')
  .attr('transform', 'translate(380, 300)')
  .attr('d', d3.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
  .attr("stroke", "white")
  .attr("stroke-width", "0.3px")
  .on('mouseover', function(d,i){
    tooltip
      .style("left", d3.event.pageX-10 + "px")
      .style("top", d3.event.pageY - 30 + "px")
      .style("position", "absolute")
      .style("display", "inline-block")
      .style("background","white")
      .style("border","1px")
      .attr("padding",30)
      .html(parseInt(all_year_pm[i]))

  })
  .on('mouseout',function(d,i){
    tooltip
      .style("display","none")
  })
  .transition()
  .duration(750)
  .attr('fill', color)


}

function render_info(){
  console.log("1")

}

function sliderChange(id) {
  value = document.getElementById(id).value
  document.getElementsByClassName(id)[0].innerHTML = value
  update();
}



function updateWindDir() {
  arrays = []
  wind_val = []
  $('input[type=checkbox]').each(function() {
    if (this.checked) {
      val.push(this.value)
    }
  })
  if ($("input:checkbox:checked").length == 0) { // if there's no checked checkbox
    val = data;
  } else {
    $('input[type=checkbox]').each(function() {
      if (this.checked) {
        var cbwd = this.value // assign a variable!!
        var filtered_data = val.filter(function(d) {
          return d["cbwd"] == cbwd;
        });
        arrays.push(filtered_data)
      }
    });
    // combine all the arrays together
    for (i = 0; i < arrays.length; i++) {
      val = wind_val.concat(arrays[i])
    }
  }
  return val
}



// combine all the arrays together

//return val
function updateTemp() {
  var lowest = parseInt(document.getElementById("temp_lowest").value)
  var highest = parseInt(document.getElementById("temp_highest").value)
  val = val.filter(function(d) {
        val = val.filter(function(d) {
          return d["TEMP"] > lowest && d["TEMP"] < highest;
        })
    })
}

function updateWindSpeed(){
    var lowest = parseInt(document.getElementById("wind_lowest").value)
    var highest = parseInt(document.getElementById("wind_highest").value)
    val = val.filter(function(d) {
      return d["Iws"]> lowest && d["Iws"]< highest;
    })
}


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
  var svg2 = d3.select("#chart")
    .append("svg")
    .attr("width", 500)
    .attr("height", 300)
    .append("g")

  var circle = svg2.append("circle")
    .attr("cx", 250)
    .attr("cy", 150)
    .style("fill", "blue")
    .attr("r", 20)

  var pm = svg2.append("text")
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

// function updateSpiral(state){
//   var spiraldata = generateSpiralData(state)
//   path = path.data(spiraldata) // compute the new angles
//   path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
//
// }

function wireButtonClickEvents() {

    d3.selectAll(".button").on("click", function () {
        //USER_SEX = d3.select(this).attr("data-val");
        d3.select(".current").classed("current", false);
        d3.select(this).classed("current", true);
        state = parseInt($(this).attr('value'))
        console.log(state)
        //updateSpiral(state)
        $("#spiral").empty();
        visualizeChart(state);
        //drawSpiral();
        // TODO: find the data item and invoke the visualization function
    });
    // RACE

    //AGEGROUP

}
