const { exec } = require('child_process');

const terminateOtherAppInstance = async () => {
	await exec(
		'tasklist | findstr "LessonReminder.exe"',
		(err, stdout, stderr) => {
			if (err) return console.log(err);
			if (stderr) return console.log(stderr);

			const tasks = stdout.split('\n').filter((task) => task);
			if (!tasks.length || tasks.length <= 4) return;

			const otherAppInstanceTasks = tasks.slice(0, -4);

			otherAppInstanceTasks.map((task: string) => {
				if (!task) return;

				const taskData = task
					.split(' ')
					.filter((value) => value.length >= 3 && value.length <= 5);

				const pid = +taskData[0];
				process.kill(pid, 'SIGINT');
			});
		}
	);
};

module.exports = terminateOtherAppInstance;
