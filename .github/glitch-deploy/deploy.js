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


const listProject = `https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/rhinestone-glacier-kite|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/caring-adjoining-binder|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/defiant-cyclic-launch|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/resisted-sulfuric-author|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/cliff-observant-sherbet|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/fantastic-lucky-supply|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/eight-plastic-egret|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/fortune-evening-sunshine|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/tall-hungry-prepared|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/decisive-garnet-mallow|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/cut-tangible-catamaran|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/sugary-bottlenose-freckle|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/shine-inconclusive-zenobia|https://08f363a2-ee79-4af2-ab23-d2ae6a19a531@api.glitch.com/git/sudden-unleashed-polka`.trim().split('|');

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