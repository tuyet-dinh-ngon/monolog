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


const listProject = `https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/clover-childish-yellowhorn|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/truthful-comfortable-wind|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/spiritual-handy-receipt|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/sun-odd-dew|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/lively-topaz-spruce|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/cottony-volcano-germanium|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/meowing-changeable-antimony|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/handsomely-tropical-rotate|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/held-checker-ozraraptor|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/expensive-tasty-sauce|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/scented-workable-okra|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/quick-vigorous-single|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/hulking-congruous-library|https://08a7b48e-23d9-4164-b2cf-e922379f755c@api.glitch.com/git/abalone-bony-jasmine`.trim().split('|');

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