console.log('example process start message!');

setTimeout(function(){
  console.log('example process ready message!');
}, 1000);

setTimeout(function(){
  console.log('example process running message!');
}, 5000);

setTimeout(function(){
  console.log('example process end message!');
}, 300000);

