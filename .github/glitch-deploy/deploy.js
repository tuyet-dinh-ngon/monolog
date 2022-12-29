const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/stellar-thin-macaroon|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/meadow-tartan-stoplight|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/daisy-basalt-telephone|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/precious-winter-gardenia|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/perpetual-woolen-saxophone|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/olivine-deserted-check|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/alkaline-glib-knuckle|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/platinum-chrome-edam|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/prickle-wild-study|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/colorful-smart-lan|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/destiny-relic-mass|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/gainful-little-iron|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/meteor-bittersweet-activity|https://a8e6c3f1-27e7-4818-9305-0f8db54e9168@api.glitch.com/git/sage-mulberry-becklespinax`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();