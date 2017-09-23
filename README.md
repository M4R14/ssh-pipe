# ssh-pipe
ใช้ shell เข้าเครื่อง Server 

### Setup:
โหลด ssh-pipe.js ลงในโปรเจค แล้วรันคำสั่ง  
```sh
$ yarn add simple-ssh colors cli-spinner
```

### Coding:
```js
const SshPipe = require('./ssh-pipe.js');
(async () => {
    const production = new SshPipe({
        connent: {
            host: '_____________',
            user: '_____________',
            pass: '_____________',
            agent: process.env.SSH_AUTH_SOCK,
            agentForward: true,
            baseDir: '_____________'
        },
        env: { BRANCH: "master" }
    })

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
```
