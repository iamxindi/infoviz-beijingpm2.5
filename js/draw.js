$(document).ready(function () {
    loadData();
    drawCircleAnimation();
});

function loadData() {
  d3.csv("data/data.csv",function(d){
    data = d;
    // when checkbox changes, update
    $('input[type=winddirection]').on("change",update);

  })
}
function sliderChange(id){
   value = document.getElementById(id).value
   document.getElementsByClassName(id)[0].innerHTML = value
   update();
}

function update(){
  var arrays = [];
  var val = [];
  if ($("input:checkbox:checked").length == 0){  // if there's no checked checkbox
    val = data;
  }else{
    $('input[type=checkbox]').each(function(){
        if (this.checked) {
          // for all the checked checkbox
          if (this.name == "winddirection"){
            var cbwd = this.value // assign a variable!!
            var filtered_data = data.filter(function (d) {
                          return d["cbwd"] == cbwd;
                              });
            arrays.push(filtered_data)
            for(i=0; i<arrays.length; i++){
              val = val.concat(arrays[i])
            }
           }
          }
          if (this.name == "temp"){
            console.log(val);

            var lowest = document.getElementById("temp_lowest").value
            var highest = document.getElementById("temp_highest").value

            val = data.filter(function(d){
              return d["TEMP"] >= lowest;
            })
            // console.log(lowest);
            // console.log(highest);
          }
       }
    )};

// combine all the arrays together

  return val
}

function toggle(){
  if($("#temp").is(":checked")){
    $(".tempfilter").css("display", "block");
  }else{
    $(".tempfilter").css("display", "none");
  }

  if($("#windspd").is(":checked")){
    $(".windspdfilter").css("display", "block");
  }else{
    $(".windspdfilter").css("display", "none");
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
