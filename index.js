const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

let count = 0;

rl.setPrompt('OHAI> ');
rl.prompt();

rl.on('line', (line) => {
  switch(line.trim()) {
    case 'hello':
      console.log('world!');
rl.write('Delete me!');
      break;
    default:
      console.log('Say what? I might have heard `' + line.trim() + '`');
      break;
  }
  rl.setPrompt('OHAI> '+count++);
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});