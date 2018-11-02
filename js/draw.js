// set up global variables
var val
var second_val
var last_checked = 0
var years = ["2010", "2011", "2012", "2013", "2014"]
var month_array = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var season_array = ["Spring", "Summer", "Autumn", "Winter"]
var state = 1
var state_text = "Average"
var path
var slider_values



$(document).ready(function() {
  loadData();
  wireButtonClickEvents();
  slider();
});


function loadData() {
  d3.csv("data/data.csv", function(d) {
    data = d;
    // when checkbox changes, update
    val = data;
    visualizeChart(state);
    drawCircleAnimation(val);
    $('input[type=checkbox]').on("change", update);

  })
}

function update() {
  var lowest_temp = slider_values[0]
  var highest_temp = slider_values[1]
  var lowest_wind = slider_values[2]
  var highest_wind = slider_values[3]

  arrays = []

  if ($(".winddirection:checked").length == 0) { // if there's no checked checkbox
    console.log("no wind direction")
    val = data;
  } else {
    val = [];
    $('input[type=checkbox]').each(function() {
      if (this.checked) {
        var cbwd = this.value // assign a variable!!
        var filtered_data = data.filter(function(d) {
          return d["cbwd"] == cbwd;
        });
        arrays.push(filtered_data)
      }
    })
    // combine all the arrays together
    for (i = 0; i < arrays.length; i++) {
      val = val.concat(arrays[i])
    }
  }

  //console.log(val.length)

  // console.log(lowest_temp, highest_temp)
  // console.log(lowest_wind, highest_wind)
  val = val.filter(function(d) {
    return d["Iws"] >= lowest_wind && d["Iws"] <= highest_wind && d["TEMP"] >= lowest_temp && d["TEMP"] <= highest_temp;

  })

  $("#chart").empty();
  drawCircleAnimation(val);
  return val


}

function generateSpiralData(state) {
  // extract the pm2.5 from all data
  var aggregated_pm = []
  var pm_data = []
  for (i = 0; i < data.length; i++) {
    pm_data.push(data[i]["pm2.5"])
  }


  for (i = 0; i < years.length; i++) {
    // for each year, create a separate array
    year_data = val.filter(function(d) {
      return d["year"] == years[i];
    });

    var year_pm

    switch (state) {
      case 1:
        year_pm = d3.nest()
          .key(function(d) {
            return d.month;
          })
          .rollup(function(v) {
            return d3.mean(v, function(d) {
              return d["pm2.5"];
            });
          })
          .entries(year_data);

        state_text = "Average"
        break;

      case 2:
        year_pm = d3.nest()
          .key(function(d) {
            return d.month;
          })
          .rollup(function(v) {
            return d3.max(v, function(d) {
              return parseInt(d["pm2.5"]);
            });
          })
          .entries(year_data);

        state_text = "Max"
        break;

      case 3:
        year_pm = d3.nest()
          .key(function(d) {
            return d.month;
          })
          //.rollup(function(v) { return d3.min(v, function(d) { return d["pm2.5"]; }); })
          .rollup(function(v) {
            return d3.median(v, function(d) {
              return parseInt(d["pm2.5"]);
            });
          })
          .entries(year_data);

        state_text = "Median"
        break;
    }



    aggregated_pm = aggregated_pm.concat(year_pm)
  }

  //console.log(aggregated_pm)
  all_year_pm = []
  for (i = 0; i < aggregated_pm.length; i++) {
    all_year_pm.push(aggregated_pm[i]["value"])
  }
  return all_year_pm

}


function visualizeChart() {



  const margin = {
    top: 0,
    right: 100,
    bottom: 20,
    left: 100
  };
  const width = 1000 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;



  initial_rad = 100;
  rad_offset = 25;
  ir = function(d, i) {
    return initial_rad + Math.floor(i / 12) * rad_offset;
  }
  or = function(d, i) {
    return initial_rad + rad_offset + Math.floor(i / 12) * rad_offset;
  }
  sa = function(d, i) {
    return (i * 2 * Math.PI) / 12;
  }
  ea = function(d, i) {
    return ((i + 1) * 2 * Math.PI) / 12;
  }

  var svg1 = d3.select("#spiral")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600)
  var g = svg1.append("g").attr("id", "spiralchart");
  drawSpiral()




}

function drawSpiral() {
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");
  var spiraldata = generateSpiralData(state);
  var color = d3.scaleLinear().domain([0, 100, 200, 500, 800]).range(["green", "yellow", "#ffb732", "red", "#8b0000"])

  path = d3.select('#spiralchart')
    .selectAll('path')
    .data(spiraldata)
    .enter()
    .append('svg:path')
    .attr('transform', 'translate(380, 300)')
    .attr('d', d3.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
    .attr("stroke", "white")
    .attr("stroke-width", "0.3px")
    .on('mouseover', function(d, i) {
      d3.select(this).attr("opacity", "0.7")
      year = parseInt((i) / 12) + 2010
      month = month_array[i % 12]
      // if ((i%12) >=2 && (i%12) <5){
      //   season = "Spring"
      // }
      tooltip
        .style("left", d3.event.pageX - 20 + "px")
        .style("top", d3.event.pageY - 88 + "px")
        .style("display", "inline-block")
        .html(month + " " + year + "<br>" + state_text + ":" +
          parseInt(all_year_pm[i]).toString()
        )

    })
    .on('mouseout', function(d, i) {
      d3.select(this).attr("opacity", "1")
      tooltip
        .style("display", "none")
    })
    .transition()
    .duration(750)
    .attr('fill', color)


}

function slider() {
  $("#slider-temp").slider({
    range: true,
    min: -20,
    max: 42,
    values: [-10, 20],
    slide: function(event, ui) {
      $("#amount-temp").val(ui.values[0] + "C to " + ui.values[1] + "C");
    },
    change: function(event, ui) {
      slider_values[0] = $("#slider-temp").slider("values", 0);
      slider_values[1] = $("#slider-temp").slider("values", 1);
      update();
    }
  });

  $("#amount-temp").val($("#slider-temp").slider("values", 0) +
    "C to " + $("#slider-temp").slider("values", 1) + "C");

  $("#slider-wind").slider({
    range: true,
    min: 0,
    max: 587,
    values: [0, 300],
    slide: function(event, ui) {
      $("#amount-wind").val(ui.values[0] + "m/s to " + ui.values[1] + "m/s");
    },
    change: function(event, ui) {
      slider_values[2] = $("#slider-wind").slider("values", 0);
      slider_values[3] = $("#slider-wind").slider("values", 1);
      update();

    }
  })

  $("#amount-wind").val($("#slider-wind").slider("values", 0) + "m/s to " +
    $("#slider-wind").slider("values", 1) + "m/s");

  slider_values = [$("#slider-temp").slider("values", 0), $("#slider-temp").slider("values", 1), $("#slider-wind").slider("values", 0), $("#slider-wind").slider("values", 1)]

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

function drawCircleAnimation(circle_data) {
  circle_pm = []
  for (i = 0; i < circle_data.length; i++) {
    circle_pm.push(data[i]["pm2.5"])
  }
  console.log(circle_pm)

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


function wireButtonClickEvents() {

  d3.selectAll(".button").on("click", function() {
    d3.select(".current").classed("current", false);
    d3.select(this).classed("current", true);
    state = parseInt($(this).attr('value'))
    console.log(state)
    //updateSpiral(state)
    $("#spiral").empty();
    visualizeChart(state);
    //drawSpiral();

  });

}
