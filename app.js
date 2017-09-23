const SshPipe = require('./ssh-pipe.js');
(async () => {
    const production = new SshPipe({
        connent: {
            host: '__________',
            user: '__________',
            pass: '__________',
            agent: process.env.SSH_AUTH_SOCK,
            agentForward: true,
            baseDir: '___________'
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
