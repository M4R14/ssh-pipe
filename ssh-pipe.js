const SSH = require('simple-ssh');
const colors = require('colors');
const Spinner = require('cli-spinner').Spinner;

const { repository, version, name } = require('./package.json');

class Server {
    constructor({ connent, env }) {
        this.connent = connent;
        this.env = env;
        this.report = {
            passed: 0,
            error: 0
        }
    }

    get description(){
        console.log("\n" + colors.bold("Doploy."))
        console.log("Name:", colors.yellow(name), colors.yellow(version))
        console.log("Github:", colors.yellow(repository.github))
        console.log("Host:", colors.yellow(this.connent.host))
        console.log("Dir:", colors.yellow(this.connent.baseDir))
    }

    get Report() {
        let { passed, error } = this.report;
        console.log("\n", colors.green(passed + " pass"))
        console.log("", colors.red(error + " error\n"))
    }

    set(connent, env) {
        this.connent = connent;
        this.env = env;
    }

    show(cmd, { code, stdout, stderr }) {
        switch (code) {
            case 0:
                this.report.passed += 1
                console.log(colors.green('✓'), cmd)
                break;

            default:
                this.report.error += 1
                console.log(colors.red('✗'), cmd)
                _out("    " + stdout, _debug)
                _err("    [Code " + code + "] " + stderr)
                break;
        }
    }

    exec(cmd) {
        return new Promise((res, rej) => {
            const _ssh = new SSH(this.connent)

            const env_keys = Object.keys(this.env);
            var setenv = "";
            for (var key in env_keys) {
                var keyName = env_keys[key];
                setenv += keyName + "=" + this.env[keyName] + " ";
            }

            _ssh.exec(setenv + "&&" + cmd, {
                exit: (code, stdout, stderr) => {
                    this.show(cmd, { code, stdout, stderr });
                    res({ code, stdout, stderr })
                }
            }).start()
        })
    }

    async start(pipelines) {
        for (var key in pipelines) {
            await this.steps(pipelines[key], (Number(key) + 1), async (cmd) => {
                await this.exec(cmd)
            })
        }
        this.report
    }

    title(step, text) {
        console.log("\n" + step, colors.bold(text))
    }

    async steps(pipeline, index, work = async () => { }) {
        var spinner = new Spinner('   %s ');
        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
        this.title(index + ".", pipeline.title);
        var start = tackTime.tack();
        spinner.start();
        for (var key in pipeline.step) {
            await work(pipeline.step[key]);
        }
        spinner.stop();
        var end = tackTime.tack();
        const time = tackTime.diff({ start, end });
        console.log(time.text);
    }
}

const tackTime = {
    tack: () => { return new Date().getTime() },
    diff: (time) => {
        const millisec = time.end - time.start;
        var seconds = (millisec / 1000).toFixed(2);

        var text = colors.green("(" + seconds + " s.)");

        if (millisec < 1000) {
            text = colors.green("(" + millisec + " ms.)");
        }
        return {
            text,
            time: {
                seconds,
                millisec
            }
        };
    }
}

module.exports = Server;