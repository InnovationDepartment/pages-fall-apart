var blue = false;
$(function(){
  var body = $('body');
  $('a').click(function(e){ 
    e.preventDefault();
  })

  $('a').on('mouseDown', function(e) {
    e.preventDefault();
  })
  // var background = body.css('backgroundColor');
  // if(background == 'rgb(0, 0, 255)') {
  //   console.log("already blue")
  //   body.css('backgroundColor', 'white')
  // } else {
  //   console.log("just white")
  //   body.css('backgroundColor', 'blue')
  // }
})
