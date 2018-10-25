$(document).ready(function () {
    loadData();
    drawCircleAnimation();
});

function loadData() {
  d3.csv("data/data.csv",function(d){

  })
}

function toggle(){
  if($("#temp").is(":checked")){
    $(".tempfilter").css("display", "block");
  }else{
    $(".tempfilter").css("display", "none");
  }
}

function drawCircleAnimation(){
  var svg = d3.select("#chart")
     .append("svg")
     .attr("width", 500)
     .attr("height", 300)
     .append("g")

  var circle =  svg.append("circle")
      .attr("cx",250)
      .attr("cy",150)
      .style("fill","blue")
      .attr("r",20)

  var pm = svg.append("text")
      .attr("dx", 250)
      .attr("dy", 150)
	    .text("100")

  repeat();

  function repeat(){
    circle
    .transition()
    .attr('r', function(d){
      return Math.random()*50
    })
    .on("end", repeat);
  }
}
