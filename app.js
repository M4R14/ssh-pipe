const SshPipe = require('./ssh-pipe.js');
(async () => {
    const production = new SshPipe({
        connent: {
            host: '128.199.241.190',
            user: 'root',
            pass: 'avoca826',
            agent: process.env.SSH_AUTH_SOCK,
            agentForward: true,
            baseDir: '/home/admin/web/mahidol.bkksol.com/public_html'
        },
        env: { BRANCH: "master" }
    })

    // production.description;
    await production.start([
        {
            title: "git load.",
            step: [
                "git fetch",
                "git checkout .",
                "git checkout $BRANCH",
                "git clean -fd",
                "git pull",
                "git reset --hard origin/$BRANCH"
            ]
        }
    ]);
    production.Report

})()