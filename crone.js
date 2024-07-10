const cron = require('node-cron');
const { exec } = require('child_process');

cron.schedule('0 0 * * *', () => {
  console.log('Running daily interest calculation...');
  exec('ts-node scripts/calculateInterest.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }
    console.log(`Script output: ${stdout}`);
  });
});
