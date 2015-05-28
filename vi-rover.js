var keypress = require("keypress");

var five = require("johnny-five");
var board = new five.Board({
  debug: true, 
  repl: false
});

var DEFAULT_SPEED = 100;
var TURNING_SPEED = 30;

board.on("ready", function() {
  var self = this;
  console.log("vi-rover ready!");
  console.log("\tj = forward");
  console.log("\tk = backward");
  console.log("\th = left");
  console.log("\tl = right");
  console.log("\tspace = stop");

  var motors = new five.Motors([
    five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD.M1,
    five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD.M2,
  ]);

  var rightMotor = motors[0];
  var leftMotor = motors[1];

  motors.speed(DEFAULT_SPEED);
  motors.stop();

  if(self.repl){
    self.repl.inject({
      motors: motors
    });
  }

  keypress(process.stdin);

  // listen for the "keypress" event
  process.stdin.on('keypress', function (ch, key) {
    console.log('got "keypress"', key);
    if(key && key.name === 'space'){
      motors.stop();
    }

    if(key && key.name === 'j'){
      motors.fwd();
      motors.speed(DEFAULT_SPEED);
    }

    if(key && key.name === 'k'){
      motors.rev();
      motors.speed(DEFAULT_SPEED);
    }

    if(key && key.name === 'h'){
      motors.stop();
      leftMotor.speed(TURNING_SPEED);
      rightMotor.speed(DEFAULT_SPEED);
    }

    if(key && key.name === 'l'){
      motors.stop();
      rightMotor.speed(TURNING_SPEED);
      leftMotor.speed(DEFAULT_SPEED);
    }

    if (key && key.ctrl && key.name == 'c') {
      process.stdin.pause();
        
      console.log("Exiting...");
      motors.stop();
      self.wait(1000, function(){
        process.exit();
      });
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();

});
