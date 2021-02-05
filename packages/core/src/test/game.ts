// @ts-nocheck
import ReadLine from 'readline'
import Shatranjan from '..'

function onCommandInput(input: string) {
  if (!input.length) return
  const args = input.trim().split(/ +/)
  // console.log(args, input);
  const commandName = args.shift()!.toLowerCase()
  switch (commandName) {
    case 'move':
      // @ts-ignore
      client.move(args[0])
      break
    case 'forcemove':
      // @ts-ignore
      client.forceMove(args[0])
      break
    case 'select':
      const validDestinationSquares = client.select(args[0])
      console.log(validDestinationSquares.toString())
      break

    case 'stop':
      readline.close()
      break
    default:
      console.log('Not a valid command!')
      break
  }
}

const readline = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
}).on('line', input => {
  try {
    onCommandInput(input)
  } catch (error) {
    console.error(error.message)
  }
});;

const client = Shatranjan.Create()
const
  mv = client.move.bind(client),
  fm = client.forceMove.bind(client),
  sl = client.select.bind(client)
// shadYantra.board.print();
// console.log(client.generateFEN());

mv('d2d3')
// shadYantra.move('b0c0');

console.log('\n')